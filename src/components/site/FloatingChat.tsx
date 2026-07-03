import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { startChatThread } from "@/lib/serverFunctions";
import logo from "@/assets/logo.png";

interface ChatMessage {
  sender: "customer" | "admin";
  text: string;
  timestamp: string;
}

// Singleton socket — created once, reused across renders
let _socket: Socket | null = null;

function getSocket(): Socket {
  if (!_socket) {
    _socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
  }
  return _socket;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<{ id: string; name: string; email: string } | null>(null);
  const [connected, setConnected] = useState(false);

  // Registration Form
  const [regForm, setRegForm] = useState({ name: "", email: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // admin typing indicator

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const sessionRef = useRef<string | null>(null);

  // ──────────────────────────────────────────────────────────
  // SOCKET.IO SETUP
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Incoming message from admin (real-time push)
    socket.on("receive-message", (data: { chatId: string; message: ChatMessage }) => {
      if (data.chatId === sessionRef.current) {
        setMessages(prev => {
          // Deduplicate: skip if last message matches (in case HTTP saved it too)
          const last = prev[prev.length - 1];
          if (last && last.text === data.message.text && last.sender === data.message.sender) return prev;
          return [...prev, data.message];
        });
        setIsTyping(false);
      }
    });

    // Admin typing indicator
    socket.on("admin-typing", (chatId: string) => {
      if (chatId === sessionRef.current) setIsTyping(true);
    });
    socket.on("admin-typing-stop", (chatId: string) => {
      if (chatId === sessionRef.current) setIsTyping(false);
    });

    return () => {
      socket.off("receive-message");
      socket.off("admin-typing");
      socket.off("admin-typing-stop");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // ──────────────────────────────────────────────────────────
  // RESTORE SESSION FROM LOCALSTORAGE
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("tsr_chat_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) {
          setSession(parsed);
          sessionRef.current = parsed.id;
        }
      } catch (e) {
        console.error("Error parsing chat session:", e);
      }
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // JOIN SOCKET ROOM WHEN SESSION IS KNOWN
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.id) return;
    sessionRef.current = session.id;
    const socket = getSocket();
    socket.emit("join-chat", session.id);
  }, [session]);

  // ──────────────────────────────────────────────────────────
  // LOAD INITIAL MESSAGES WHEN CHAT OPENS
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !session?.id) return;
    // Fetch history once via HTTP on open
    fetch(`/api/chat/get?id=${encodeURIComponent(session.id)}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.chat) setMessages(res.chat.messages || []);
      })
      .catch(err => console.error("Failed to load chat history:", err));
  }, [isOpen, session]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isTyping]);

  // ──────────────────────────────────────────────────────────
  // REGISTRATION
  // ──────────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.email.trim()) return;
    setIsRegistering(true);
    setRegError("");
    try {
      const res = await startChatThread(regForm.name.trim(), regForm.email.trim());
      if (res?.success && res.chat) {
        const newSession = { id: res.chat.id, name: res.chat.customerName, email: res.chat.customerEmail };
        localStorage.setItem("tsr_chat_session", JSON.stringify(newSession));
        setSession(newSession);
        sessionRef.current = newSession.id;
        setMessages(res.chat.messages || []);
        // Join socket room immediately
        getSocket().emit("join-chat", newSession.id);
      } else {
        setRegError(res?.error || "Failed to start conversation. Please try again.");
      }
    } catch {
      setRegError("Unable to connect to support channel. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  // ──────────────────────────────────────────────────────────
  // SEND MESSAGE VIA SOCKET.IO (instant delivery)
  // ──────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session?.id || isSending) return;

    const currentText = inputText.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setInputText("");
    setIsSending(true);

    // Optimistic UI update
    const optimisticMsg: ChatMessage = { sender: "customer", text: currentText, timestamp };
    setMessages(prev => [...prev, optimisticMsg]);

    // Emit via socket — server persists to DB and broadcasts to admin
    getSocket().emit("send-message", { chatId: session.id, sender: "customer", text: currentText }, () => {
      setIsSending(false);
    });
  }, [inputText, session, isSending]);

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Trigger Button ── */}
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

      {/* ── Chat Popover ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white border border-border/30 rounded-3xl shadow-luxe z-50 flex flex-col overflow-hidden animate-fade-in font-sans">

          {/* Header */}
          <div className="bg-gradient-to-r from-ink via-ink/95 to-ink text-white p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="relative">
                <div className="size-10 rounded-full bg-white border border-gold/40 flex items-center justify-center p-1 overflow-hidden">
                  <img src={logo} alt="TSR Logo" className="size-full object-contain rounded-full" />
                </div>
                {/* Live indicator — green if socket connected */}
                <span className={`absolute bottom-0 right-0 size-2.5 border border-ink rounded-full transition-colors ${connected ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide">TSR Skin and Hair Care</h3>
                <p className="text-[10px] font-serif italic text-accent/80">
                  {connected ? "Live Botanical Advisor" : "Reconnecting…"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col bg-[#FDFCF9] overflow-hidden">
            {!session ? (
              /* ── Registration Form ── */
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="font-display text-xl text-ink">Begin Consultation</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans font-medium px-4">
                    Enter your details to initiate a live consultation thread with a TSR skin &amp; hair specialist.
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
                    <input required type="text" placeholder="e.g. Clara Sterling"
                      value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-accent/40 transition-all font-medium text-ink"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest uppercase text-muted-foreground px-1 font-bold">Email Address</label>
                    <input required type="email" placeholder="e.g. clara@example.com"
                      value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-accent/40 transition-all font-medium text-ink"
                    />
                  </div>
                  <button type="submit" disabled={isRegistering}
                    className="w-full bg-ink text-white py-3.5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-gold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer border-none mt-2"
                  >
                    {isRegistering ? <Loader2 className="size-4 animate-spin text-white" /> : "Start Chat"}
                  </button>
                </form>
              </div>
            ) : (
              /* ── Message Feed ── */
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, index) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div key={index} className={`flex gap-3 text-left ${isAdmin ? "justify-start" : "justify-end"}`}>
                        {isAdmin && (
                          <div className="size-7 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0">
                            <Sparkles className="size-3 text-accent" />
                          </div>
                        )}
                        <div className="max-w-[75%] space-y-1">
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans font-medium ${
                            isAdmin ? "bg-white text-ink border border-border/20 shadow-xs" : "bg-gold text-white shadow-soft"
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

                  {/* Typing indicator bubble */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="size-7 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0">
                        <Sparkles className="size-3 text-accent" />
                      </div>
                      <div className="bg-white border border-border/20 shadow-xs rounded-2xl px-4 py-3 flex items-center gap-1">
                        <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
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
                    <button type="submit" disabled={isSending}
                      className="size-9 bg-ink hover:bg-gold text-white rounded-full flex items-center justify-center shrink-0 transition-all shadow-soft cursor-pointer border-none"
                    >
                      {isSending ? <Loader2 className="size-4 animate-spin text-white" /> : <Send className="size-3.5" />}
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
