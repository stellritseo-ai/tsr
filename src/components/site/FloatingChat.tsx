import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import { startChatThread, getChatThread, sendChatMessage } from "@/lib/serverFunctions";
import logo from "@/assets/logo.png";

interface ChatMessage {
  sender: "customer" | "admin";
  text: string;
  timestamp: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<{ id: string; name: string; email: string } | null>(null);
  
  // Registration Form state
  const [regForm, setRegForm] = useState({ name: "", email: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat session from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tsr_chat_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          setSession(parsed);
        }
      } catch (e) {
        console.error("Error parsing chat session:", e);
      }
    }
  }, []);

  // Sync messages from database when open and session is active
  useEffect(() => {
    if (!isOpen || !session?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await getChatThread(session.id);
        if (res && res.success && res.chat) {
          setMessages(res.chat.messages || []);
        }
      } catch (err) {
        console.error("Failed to sync chat messages:", err);
      }
    };

    // Run immediately
    fetchMessages();

    // Poll database every 5 seconds for admin replies
    const timer = setInterval(fetchMessages, 5000);
    return () => clearInterval(timer);
  }, [isOpen, session]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.email.trim()) return;

    setIsRegistering(true);
    setRegError("");

    try {
      const res = await startChatThread(regForm.name.trim(), regForm.email.trim());
      if (res && res.success && res.chat) {
        const newSession = {
          id: res.chat.id,
          name: res.chat.customerName,
          email: res.chat.customerEmail
        };
        localStorage.setItem("tsr_chat_session", JSON.stringify(newSession));
        setSession(newSession);
        setMessages(res.chat.messages || []);
      } else {
        setRegError(res.error || "Failed to start conversation. Please try again.");
      }
    } catch (err) {
      setRegError("Unable to connect to support channel. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session?.id || isSending) return;

    const currentText = inputText.trim();
    setInputText("");
    setIsSending(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append locally first for instant feedback
    setMessages(prev => [...prev, { sender: "customer", text: currentText, timestamp: timeStr }]);

    try {
      await sendChatMessage(session.id, 'customer', currentText);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 size-14 bg-white hover:bg-[#FAF7F2] text-white rounded-full flex items-center justify-center shadow-luxe transition-all duration-300 z-50 hover:scale-105 active:scale-95 cursor-pointer border-2 border-gold/70 p-1.5"
        title="Botanical Chat Consultation"
      >
        {isOpen ? (
          <X className="size-6 text-gold animate-fade-in" />
        ) : (
          <img src={logo} alt="TSR Logo" className="size-full object-contain rounded-full animate-fade-in" />
        )}
      </button>

      {/* Floating Chat Box Popover */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white border border-border/30 rounded-3xl shadow-luxe z-50 flex flex-col overflow-hidden animate-fade-in font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-ink via-ink/95 to-ink text-white p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="relative">
                <div className="size-10 rounded-full bg-white border border-gold/40 flex items-center justify-center p-1 overflow-hidden">
                  <img src={logo} alt="TSR Logo" className="size-full object-contain rounded-full" />
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border border-ink rounded-full" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide">TSR Skin and Hair Care</h3>
                <p className="text-[10px] text-accent/80 font-serif italic">Live Botanical Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col bg-[#FDFCF9] overflow-hidden">
            {!session ? (
              /* REGISTRATION FORM */
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="font-display text-xl text-ink">Begin Consultation</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans font-medium px-4">
                    Enter your details to initiate a live consultation thread with a TSR skin & hair specialist.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                  {regError && (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold leading-relaxed border border-rose-200/50">
                      {regError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest uppercase text-muted-foreground px-1 font-bold">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Clara Sterling"
                      value={regForm.name}
                      onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-accent/40 transition-all font-medium text-ink"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest uppercase text-muted-foreground px-1 font-bold">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. clara@example.com"
                      value={regForm.email}
                      onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-accent/40 transition-all font-medium text-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-ink text-white py-3.5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-gold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer border-none mt-2"
                  >
                    {isRegistering ? (
                      <Loader2 className="size-4 animate-spin text-white" />
                    ) : (
                      "Start Chat"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* MESSAGES LIST */
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, index) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={index}
                        className={`flex gap-3 text-left ${isAdmin ? "justify-start" : "justify-end"}`}
                      >
                        {isAdmin && (
                          <div className="size-7 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0">
                            <Sparkles className="size-3 text-accent" />
                          </div>
                        )}
                        <div className="max-w-[75%] space-y-1">
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans font-medium ${
                            isAdmin
                              ? "bg-white text-ink border border-border/20 shadow-xs"
                              : "bg-gold text-white shadow-soft"
                          }`}>
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                          <p className={`text-[8px] text-muted-foreground font-mono font-medium ${isAdmin ? "text-left" : "text-right"}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input panel */}
                <div className="p-3 bg-white border-t border-border/20">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      className="flex-1 bg-secondary/15 border border-border/30 focus:border-gold/40 rounded-full px-4 py-2.5 text-xs outline-none font-sans font-medium text-ink"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSending}
                      className="size-9 bg-ink hover:bg-gold text-white rounded-full flex items-center justify-center shrink-0 transition-all shadow-soft cursor-pointer border-none"
                    >
                      {isSending ? (
                        <Loader2 className="size-4 animate-spin text-white" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
