import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { 
  Package, Users, ShoppingCart, TrendingUp, 
  Search, Filter, ExternalLink, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, BarChart3, Plus, Edit2, 
  Trash2, X, PlusCircle, UserCheck, DollarSign, Calendar, MapPin, 
  Phone, Mail, ArrowRight, ArrowUpRight, Award, FileText, Settings, Sparkles, Loader2,
  Lock, User, LogOut, ShieldCheck, KeyRound
} from "lucide-react";

import { 
  getOrders, 
  updateOrderStatus, 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getManualCustomers,
  createManualCustomer,
  adminLogin,
  changeAdminPassword
} from "@/lib/serverFunctions";
import { Order } from "@/types/order";
import { Product } from "@/data/products";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin Portal | TSR Botanical Rituals" }],
  }),
});

const PRESET_IMAGES = [
  { name: "TSR™ Growth Oil", url: "/src/assets/product-growth-oil.jpg" },
  { name: "TSR™ Hydrating Spray", url: "/src/assets/Hydrating-Spray.jpg" },
  { name: "TSR™ Hair Butter", url: "/src/assets/Hair-Butter-v2.jpg" },
  { name: "TSR™ 3-Step Bundle", url: "/src/assets/3-Step-Hair-Growth.jpg" },
  { name: "TSR™ Rosemary Lotion", url: "/src/assets/Rosemary.jpg" },
  { name: "TSR™ Aloe Shea Bar", url: "/src/assets/Aloe-Shea.jpg" },
  { name: "TSR™ Charcoal Detox Bar", url: "/src/assets/Charcoal-Detox.jpg" },
  { name: "TSR™ Goat Milk Honey Bar", url: "/src/assets/Goat-Milk.jpg" },
  { name: "TSR™ 3 Soap Bundle", url: "/src/assets/3-shop.jpg" },
  { name: "TSR™ Men's Repair Butter", url: "/src/assets/Men’s-Repair-Hair.jpg" },
  { name: "TSR™ Leave-In Spray", url: "/src/assets/Leave-In-Hydrating.jpg" },
  { name: "TSR™ Bald Spot Oil", url: "/src/assets/Men’s-Bald-Spot.jpg" },
];

function AdminDashboard() {
  // Authentication Guard states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab control
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Database datasets state
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [manualCustomers, setManualCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Selection states for Drawers & Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  
  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState<Product | null>(null);
  const [showDeleteProductConfirm, setShowDeleteProductConfirm] = useState<Product | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Password setting form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // CRUD Forms state
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    price: 0,
    category: "hair" as Product["category"],
    description: "",
    ingredients: "",
    benefits: "",
    imagePreset: PRESET_IMAGES[0].url,
    imageCustom: "",
    useCustomImage: false,
  });

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  // Action status loading spinners
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

  // Elegant Toast Notifications state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // CHECK ACTIVE SESSION ON MOUNT
  useEffect(() => {
    const session = localStorage.getItem("tsr_admin_session");
    if (session === "tsr_admin_session_token") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
    setAuthChecking(false);
  }, [isAuthenticated]);

  // FETCH ALL DATA
  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedProducts, fetchedCustomers] = await Promise.all([
        getOrders(),
        getProducts(),
        getManualCustomers(),
      ]);
      setOrders(fetchedOrders as Order[]);
      setProducts(fetchedProducts as Product[]);
      setManualCustomers(fetchedCustomers);
    } catch (e) {
      console.error("Failed to load admin panel data", e);
      showToast("Error retrieving live database data", "error");
    } finally {
      setLoading(false);
    }
  };

  // ADMIN LOGIN FLOW
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter both username and password");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await adminLogin(loginUsername.trim(), loginPassword);
      if (response && response.success) {
        localStorage.setItem("tsr_admin_session", response.token);
        setIsAuthenticated(true);
        showToast("Access authenticated successfully");
      } else {
        setLoginError(response.error || "Authentication failed. Incorrect credentials.");
      }
    } catch (err) {
      setLoginError("Server error verifying authentication");
    } finally {
      setLoginLoading(false);
    }
  };

  // LOGOUT TRIGGER
  const handleLogout = () => {
    localStorage.removeItem("tsr_admin_session");
    setIsAuthenticated(false);
    setOrders([]);
    setProducts([]);
    setManualCustomers([]);
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setActiveTab("dashboard");
    showToast("Logged out of administration panel");
  };

  // UPDATE PASSWORD IN DATABASE
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      showToast("All security fields are required", "error");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (securityForm.newPassword.length < 5) {
      showToast("New password must be at least 5 characters long", "error");
      return;
    }
    setSubmittingPassword(true);
    try {
      const response = await changeAdminPassword(securityForm.currentPassword, securityForm.newPassword);
      if (response && response.success) {
        showToast("Password updated in MongoDB");
        setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(response.error || "Error updating credentials", "error");
      }
    } catch (err: any) {
      showToast("Server network error changing credentials", "error");
    } finally {
      setSubmittingPassword(false);
    }
  };

  // UPDATE ORDER STATUS IN DATABASE
  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response && response.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showToast(`Order ${orderId} updated to ${newStatus}`);
      } else {
        showToast("Failed to update status in MongoDB", "error");
      }
    } catch (err) {
      showToast("Server error during status update", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // PRODUCT CRUD OPERATIONS
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.id || !productForm.name || productForm.price <= 0) {
      showToast("Please fill in ID, Name, and valid Price", "error");
      return;
    }
    setSubmittingProduct(true);
    try {
      const finalImage = productForm.useCustomImage ? productForm.imageCustom : productForm.imagePreset;
      const newProductPayload = {
        id: productForm.id.trim().toLowerCase(),
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        ingredients: productForm.ingredients.split(",").map(i => i.trim()).filter(Boolean),
        benefits: productForm.benefits.split(",").map(b => b.trim()).filter(Boolean),
        image: finalImage,
      };

      const response = await createProduct(newProductPayload);
      if (response && response.success) {
        showToast(`Product "${productForm.name}" created successfully`);
        setShowAddProductModal(false);
        setProductForm({
          id: "",
          name: "",
          price: 0,
          category: "hair",
          description: "",
          ingredients: "",
          benefits: "",
          imagePreset: PRESET_IMAGES[0].url,
          imageCustom: "",
          useCustomImage: false,
        });
        fetchData();
      } else {
        showToast("Error creating product", "error");
      }
    } catch (err) {
      showToast("Server error creating product", "error");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditProductModal) return;
    setSubmittingProduct(true);
    try {
      const finalImage = productForm.useCustomImage ? productForm.imageCustom : productForm.imagePreset;
      const updatedPayload = {
        id: showEditProductModal.id,
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        ingredients: productForm.ingredients.split(",").map(i => i.trim()).filter(Boolean),
        benefits: productForm.benefits.split(",").map(b => b.trim()).filter(Boolean),
        image: finalImage,
      };

      const response = await updateProduct(updatedPayload);
      if (response && response.success) {
        showToast(`Product "${productForm.name}" updated successfully`);
        setShowEditProductModal(null);
        fetchData();
      } else {
        showToast("Error updating product", "error");
      }
    } catch (err) {
      showToast("Server error updating product", "error");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (!showDeleteProductConfirm) return;
    try {
      const response = await deleteProduct(showDeleteProductConfirm.id);
      if (response && response.success) {
        showToast(`Product "${showDeleteProductConfirm.name}" deleted`);
        setShowDeleteProductConfirm(null);
        fetchData();
      } else {
        showToast("Error deleting product", "error");
      }
    } catch (err) {
      showToast("Server error deleting product", "error");
    }
  };

  // CUSTOMER MANUAL ADDITION
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      showToast("Name and Email are required", "error");
      return;
    }
    setSubmittingCustomer(true);
    try {
      const response = await createManualCustomer({
        ...customerForm,
        createdAt: new Date().toISOString(),
      });
      if (response && response.success) {
        showToast(`VIP Customer "${customerForm.name}" added to database`);
        setShowAddCustomerModal(false);
        setCustomerForm({
          name: "",
          email: "",
          phone: "",
          city: "",
          address: "",
          notes: "",
        });
        fetchData();
      } else {
        showToast("Failed to add customer", "error");
      }
    } catch (err) {
      showToast("Server error adding customer", "error");
    } finally {
      setSubmittingCustomer(false);
    }
  };

  // POPULATE EDIT PRODUCT FORM
  const openEditProductModal = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || "",
      ingredients: (product.ingredients || []).join(", "),
      benefits: (product.benefits || []).join(", "),
      imagePreset: PRESET_IMAGES.find(i => i.url === product.image) ? product.image : PRESET_IMAGES[0].url,
      imageCustom: PRESET_IMAGES.find(i => i.url === product.image) ? "" : product.image,
      useCustomImage: !PRESET_IMAGES.find(i => i.url === product.image),
    });
    setShowEditProductModal(product);
  };

  // DERIVE COMBINED CUSTOMER LIST
  const derivedCustomers = useMemo(() => {
    const map: Record<string, any> = {};

    orders.forEach(order => {
      const email = order.email.toLowerCase().trim();
      if (!map[email]) {
        map[email] = {
          name: order.customerName,
          email: order.email,
          phone: order.phone || "N/A",
          city: order.city || "N/A",
          address: order.address || "N/A",
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: order.date,
          orders: [],
          source: "online",
          notes: "",
        };
      }
      map[email].orderCount += 1;
      if (order.status !== "cancelled") {
        map[email].totalSpent += order.total;
      }
      map[email].orders.push(order);
      if (new Date(order.date) > new Date(map[email].lastOrderDate)) {
        map[email].lastOrderDate = order.date;
        map[email].name = order.customerName;
        map[email].phone = order.phone || map[email].phone;
        map[email].city = order.city || map[email].city;
        map[email].address = order.address || map[email].address;
      }
    });

    manualCustomers.forEach(manual => {
      const email = manual.email.toLowerCase().trim();
      if (map[email]) {
        map[email].notes = manual.notes || "";
        map[email].source = "hybrid";
      } else {
        map[email] = {
          name: manual.name,
          email: manual.email,
          phone: manual.phone || "N/A",
          city: manual.city || "N/A",
          address: manual.address || "N/A",
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: "No online purchases",
          orders: [],
          source: "manual",
          notes: manual.notes || "",
        };
      }
    });

    return Object.values(map);
  }, [orders, manualCustomers]);

  // CALCULATE METRICS
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "paid" || o.status === "shipped").length;
    const shippedRituals = orders.filter(o => o.status === "shipped" || o.status === "completed").length;
    const customerBase = derivedCustomers.length;
    return { totalRevenue, activeOrders, shippedRituals, customerBase, totalOrders };
  }, [orders, derivedCustomers]);

  // STATUS DISTRIBUTION
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = { hair: 0, skin: 0, bundles: 0, men: 0 };
    const statusCounts: Record<string, number> = { pending: 0, processing: 0, paid: 0, shipped: 0, completed: 0, cancelled: 0 };

    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      if (order.status !== "cancelled") {
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          const cat = prod?.category || "hair";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    return { categoryTotals, statusCounts };
  }, [orders, products]);

  // FILTERED LISTINGS
  const filteredOrdersList = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const filteredProductsList = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const filteredCustomersList = useMemo(() => {
    return derivedCustomers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [derivedCustomers, searchTerm]);

  // HSL COLOR CONVERSION FOR BADGES
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "text-emerald-700 bg-emerald-50 border-emerald-200/60";
      case "shipped": return "text-blue-700 bg-blue-50 border-blue-200/60";
      case "processing": return "text-amber-700 bg-amber-50 border-amber-200/60";
      case "paid": return "text-violet-700 bg-violet-50 border-violet-200/60";
      case "pending": return "text-slate-700 bg-slate-50 border-slate-200/60";
      case "cancelled": return "text-rose-700 bg-rose-50 border-rose-200/60";
      default: return "text-slate-700 bg-slate-50 border-slate-200/60";
    }
  };

  // ON INIT AUTH CHECKS
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="size-10 text-gold animate-spin" />
        <div className="text-sm italic font-serif text-muted-foreground">Authenticating admin portal access...</div>
      </div>
    );
  }

  // ─── RENDERING RITUAL LOGIN CARD SCREEN IF UNAUTHENTICATED ───────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6 relative overflow-hidden font-serif selection:bg-accent/20">
        
        {/* Abstract Luxury Background Blurs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

        <div className="max-w-md w-full glass bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative z-10 animate-fade-up">
          <div className="text-center space-y-3">
            <span className="text-[10px] tracking-[0.45em] uppercase text-accent font-medium font-sans">Administrative Portal</span>
            <h2 className="font-display text-4xl text-white">TSR<span className="text-accent text-gold font-serif">.</span> Rituals</h2>
            <div className="h-px w-16 bg-white/20 mx-auto" />
            <p className="text-xs text-white/50 leading-relaxed font-sans font-medium">Verify your credentials to manage botanical recipes and checkouts.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 font-sans">
            
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 flex gap-3 text-rose-300 text-xs items-center leading-relaxed">
                <AlertCircle className="size-4 shrink-0" />
                <div>{loginError}</div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] tracking-wider uppercase font-bold text-white/40">Username Credentials</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-gold transition-colors" />
                <input 
                  type="text" 
                  placeholder="tsr_admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/40 rounded-2xl py-3 pl-12 pr-6 text-xs text-white outline-none transition-all placeholder:text-white/20 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] tracking-wider uppercase font-bold text-white/40">Administrative Security Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-gold transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/40 rounded-2xl py-3 pl-12 pr-6 text-xs text-white outline-none transition-all placeholder:text-white/20 font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full bg-white text-ink hover:bg-gold hover:text-white py-4 rounded-full text-[10px] tracking-widest uppercase font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer pt-4.5"
            >
              {loginLoading ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-4" />}
              {loginLoading ? "Authenticating Session..." : "Verify & Enter"}
            </button>

          </form>

          <div className="text-center">
            <Link to="/" className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition font-sans font-bold flex items-center justify-center gap-1.5">
              ← Visit Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDERING AUTHORIZED DASHBOARD WORKSPACE ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDFCF9] text-ink selection:bg-accent/20">
      
      {/* ELEVENTH TOAST SYSTEM */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-bounce bg-white ${
          toast.type === "success" ? "border-emerald-200" : "border-rose-200"
        }`}>
          <div className={`size-8 rounded-full flex items-center justify-center ${
            toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {toast.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink/40">Notification</div>
            <div className="text-sm font-medium text-ink/80">{toast.message}</div>
          </div>
        </div>
      )}

      <div className="flex">
        
        {/* SIDEBAR */}
        <aside className="w-64 min-h-screen bg-ink text-white p-8 space-y-12 sticky top-0 hidden lg:flex flex-col justify-between border-r border-white/5">
          <div className="space-y-12">
            <div className="font-display text-3xl flex items-center gap-2">
              TSR<span className="text-accent text-gold font-serif">.</span> Admin
            </div>
            
            <nav className="space-y-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4 font-bold">Management</div>
              <button 
                onClick={() => { setActiveTab("dashboard"); setSearchTerm(""); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-white/10 text-white font-medium shadow-soft" : "text-white/50 hover:text-white"}`}
              >
                <BarChart3 className="size-4" /> Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab("orders"); setSearchTerm(""); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "orders" ? "bg-white/10 text-white font-medium shadow-soft" : "text-white/50 hover:text-white"}`}
              >
                <ShoppingCart className="size-4" /> Orders
                {metrics.activeOrders > 0 && (
                  <span className="ml-auto size-5 bg-gold text-ink text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {metrics.activeOrders}
                  </span>
                )}
              </button>
              <button 
                onClick={() => { setActiveTab("products"); setSearchTerm(""); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "products" ? "bg-white/10 text-white font-medium shadow-soft" : "text-white/50 hover:text-white"}`}
              >
                <Package className="size-4" /> Products
              </button>
              <button 
                onClick={() => { setActiveTab("customers"); setSearchTerm(""); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "customers" ? "bg-white/10 text-white font-medium shadow-soft" : "text-white/50 hover:text-white"}`}
              >
                <Users className="size-4" /> Customers
              </button>
              <button 
                onClick={() => { setActiveTab("settings"); setSearchTerm(""); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-white/10 text-white font-medium shadow-soft" : "text-white/50 hover:text-white"}`}
              >
                <Settings className="size-4" /> Settings
              </button>
            </nav>
          </div>

          <div className="space-y-4 pt-12">
            <div className="h-px bg-white/10" />
            <Link to="/" className="text-xs text-white/40 hover:text-white transition flex items-center gap-2">
              <ExternalLink className="size-3" /> Visit Storefront
            </Link>
            
            {/* LOGOUT SECURE ACTION */}
            <button 
              onClick={handleLogout}
              className="text-xs text-rose-400/70 hover:text-rose-400 transition flex items-center gap-2 cursor-pointer w-full text-left font-bold uppercase tracking-wider"
            >
              <LogOut className="size-3.5" /> Secure Logout
            </button>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-8 lg:p-12 space-y-12 max-w-7xl mx-auto overflow-hidden">
          
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="font-display text-4xl leading-tight">
                {activeTab === "dashboard" && "Executive Dashboard"}
                {activeTab === "orders" && "Fulfillment Center"}
                {activeTab === "products" && "Catalog Management"}
                {activeTab === "customers" && "Customer Directory"}
                {activeTab === "settings" && "Security Settings"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {activeTab === "dashboard" && "Real-time analytics and financial metrics."}
                {activeTab === "orders" && "Review, fulfill, and update client rituals."}
                {activeTab === "products" && "Add new botanical formulations and manage stock prices."}
                {activeTab === "customers" && "Nurture high-profile client purchasing histories."}
                {activeTab === "settings" && "Manage administrator credentials and database settings."}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-gold" />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-border/60 rounded-full py-2.5 pl-10 pr-6 text-xs outline-none focus:border-gold/60 w-56 shadow-sm transition-all"
                />
              </div>

              {activeTab === "products" && (
                <button 
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-ink text-white px-5 py-2.5 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5" /> Add Product
                </button>
              )}

              {activeTab === "customers" && (
                <button 
                  onClick={() => setShowAddCustomerModal(true)}
                  className="bg-ink text-white px-5 py-2.5 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <PlusCircle className="size-3.5" /> Add Client
                </button>
              )}
            </div>
          </header>

          {/* METRICS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Revenue", val: `$${metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50", desc: "Lifetime order billing" },
              { label: "Active Orders", val: String(metrics.activeOrders), icon: Clock, color: "text-amber-600 bg-amber-50", desc: "Awaiting dispatch status" },
              { label: "Rituals Shipped", val: String(metrics.shippedRituals), icon: CheckCircle2, color: "text-blue-600 bg-blue-50", desc: "Fulfilled packages" },
              { label: "Customer Base", val: String(metrics.customerBase), icon: Users, color: "text-gold bg-amber-50/40", desc: "VIP customer accounts" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4 hover:shadow-soft transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">{stat.label}</div>
                  <div className={`p-2 rounded-xl ${stat.color} transition-all duration-500 group-hover:scale-110`}>
                    <stat.icon className="size-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-display leading-tight">{stat.val}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC TAB SWITCHER */}
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="size-10 text-gold animate-spin" />
              <div className="text-sm italic font-serif text-muted-foreground">Syncing with TSR botanical database...</div>
            </div>
          ) : (
            <>
              {/* ──────────────────────────────────────────────────────── DASHBOARD TAB ──────────────────────────────────────────────────────── */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fade-up">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-border/40 shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl">Revenue Growth Trend</h3>
                          <p className="text-xs text-muted-foreground">Order value metrics parsed by database sequence.</p>
                        </div>
                        <span className="glass px-3 py-1 rounded-full text-[10px] tracking-wider uppercase text-gold font-bold">Live DB Sync</span>
                      </div>

                      <div className="h-64 relative flex items-end">
                        {orders.length === 0 ? (
                          <div className="w-full text-center text-xs italic text-muted-foreground py-20">Awaiting checkout orders to calculate sales volume...</div>
                        ) : (
                          <div className="w-full h-full pt-4">
                            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#C5A880" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#C5A880" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1EDE7" strokeWidth="1" strokeDasharray="5,5" />
                              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1EDE7" strokeWidth="1" strokeDasharray="5,5" />
                              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1EDE7" strokeWidth="1" strokeDasharray="5,5" />
                              <path 
                                d={`M 0,200 
                                  ${orders.slice().reverse().map((o, idx) => {
                                    const x = (idx / (orders.length - 1 || 1)) * 500;
                                    const y = 200 - Math.min(180, (o.total / 150) * 150 + 10);
                                    return `L ${x},${y}`;
                                  }).join(" ")} 
                                  L 500,200 Z`}
                                fill="url(#chartGrad)"
                              />
                              <path 
                                d={orders.slice().reverse().map((o, idx) => {
                                  const x = (idx / (orders.length - 1 || 1)) * 500;
                                  const y = 200 - Math.min(180, (o.total / 150) * 150 + 10);
                                  return `${idx === 0 ? "M" : "L"} ${x},${y}`;
                                }).join(" ")}
                                fill="none"
                                stroke="#C5A880"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              {orders.slice().reverse().map((o, idx) => {
                                const x = (idx / (orders.length - 1 || 1)) * 500;
                                const y = 200 - Math.min(180, (o.total / 150) * 150 + 10);
                                return (
                                  <circle key={idx} cx={x} cy={y} r="4" fill="#1C1B19" stroke="#C5A880" strokeWidth="1.5" />
                                );
                              })}
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] tracking-wider text-muted-foreground uppercase pt-4 border-t border-border/20">
                        <div>First checkout</div>
                        <div>Database sequence chronological plot</div>
                        <div>Latest checkout</div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-display text-xl">Revenue by Category</h3>
                        <p className="text-xs text-muted-foreground">Product performance distribution.</p>
                      </div>
                      <div className="space-y-5 pt-2">
                        {Object.entries(chartData.categoryTotals).map(([cat, total]) => {
                          const percentage = metrics.totalRevenue > 0 ? (total / metrics.totalRevenue) * 100 : 0;
                          return (
                            <div key={cat} className="space-y-2">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-2">
                                  <span className={`size-2.5 rounded-full ${
                                    cat === "hair" ? "bg-amber-600" :
                                    cat === "skin" ? "bg-indigo-600" :
                                    cat === "bundles" ? "bg-gold bg-gold text-yellow-600 bg-yellow-600" : "bg-emerald-600"
                                  }`} />
                                  {cat}
                                </span>
                                <span className="text-muted-foreground">${total.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="h-2 bg-secondary/35 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    cat === "hair" ? "bg-amber-600" :
                                    cat === "skin" ? "bg-indigo-600" :
                                    cat === "bundles" ? "bg-gold bg-yellow-600" : "bg-emerald-600"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2rem] border border-border/40 shadow-luxe overflow-hidden">
                    <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
                      <h3 className="font-display text-2xl">Awaiting Fulfillment</h3>
                      <button 
                        onClick={() => { setActiveTab("orders"); setStatusFilter("pending"); }}
                        className="text-xs tracking-widest text-gold hover:text-ink transition flex items-center gap-1 font-bold uppercase"
                      >
                        View Fulfillment list <ArrowRight className="size-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-secondary/10 border-b border-border/40">
                          <tr>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Order ID</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Customer</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Items</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Total</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "paid").slice(0, 5).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-8 py-16 text-center text-muted-foreground italic text-xs">
                                All online client orders are fully fulfilled. Excellent work!
                              </td>
                            </tr>
                          ) : (
                            orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "paid").slice(0, 5).map((order) => (
                              <tr 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="hover:bg-secondary/10 transition-colors cursor-pointer group"
                              >
                                <td className="px-8 py-5 text-xs font-bold font-serif">{order.id}</td>
                                <td className="px-8 py-5">
                                  <div className="text-xs font-bold font-display">{order.customerName}</div>
                                  <div className="text-[10px] text-muted-foreground">{order.email}</div>
                                </td>
                                <td className="px-8 py-5 text-xs">{order.items.length} items</td>
                                <td className="px-8 py-5 text-xs font-bold">${order.total.toFixed(2)}</td>
                                <td className="px-8 py-5">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] tracking-wider uppercase font-bold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── ORDERS TAB ──────────────────────────────────────────────────────── */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-up">
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {["all", "pending", "processing", "paid", "shipped", "completed", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2 rounded-full text-[10px] tracking-wider uppercase font-bold transition-all border shrink-0 cursor-pointer ${
                          statusFilter === status 
                            ? "bg-ink text-white border-ink shadow-soft" 
                            : "bg-white text-muted-foreground border-border/40 hover:bg-secondary/20"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-[2rem] border border-border/40 shadow-luxe overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-secondary/10 border-b border-border/40">
                          <tr>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Order ID</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Customer</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Date</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Items</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Total</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Status</th>
                            <th className="px-8 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {filteredOrdersList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-8 py-24 text-center text-muted-foreground italic text-xs">
                                No records match the active criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrdersList.map((order) => (
                              <tr 
                                key={order.id} 
                                className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                              >
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6 text-xs font-bold font-serif"
                                >
                                  {order.id}
                                </td>
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6"
                                >
                                  <div className="text-xs font-bold font-display">{order.customerName}</div>
                                  <div className="text-[10px] text-muted-foreground">{order.email}</div>
                                </td>
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6 text-xs text-muted-foreground"
                                >
                                  {order.date}
                                </td>
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6 text-xs"
                                >
                                  {order.items.length} items
                                </td>
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6 text-xs font-bold"
                                >
                                  ${order.total.toFixed(2)}
                                </td>
                                <td className="px-8 py-6">
                                  {updatingOrderId === order.id ? (
                                    <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-wider font-bold">
                                      <Loader2 className="size-3 animate-spin" /> Saving...
                                    </div>
                                  ) : (
                                    <select 
                                      value={order.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order["status"])}
                                      className={`px-3 py-1 rounded-full text-[9px] tracking-wider uppercase font-bold outline-none border cursor-pointer ${getStatusColor(order.status)}`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="paid">Paid</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  )}
                                </td>
                                <td 
                                  onClick={() => setSelectedOrder(order)} 
                                  className="px-8 py-6 text-right"
                                >
                                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-ink transition-transform group-hover:translate-x-1 inline" />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── PRODUCTS TAB ──────────────────────────────────────────────────────── */}
              {activeTab === "products" && (
                <div className="space-y-6 animate-fade-up">
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {["all", "hair", "skin", "bundles", "men"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-5 py-2 rounded-full text-[10px] tracking-wider uppercase font-bold transition-all border shrink-0 cursor-pointer ${
                          categoryFilter === cat 
                            ? "bg-ink text-white border-ink shadow-soft" 
                            : "bg-white text-muted-foreground border-border/40 hover:bg-secondary/20"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {filteredProductsList.length === 0 ? (
                    <div className="bg-white p-24 text-center border border-border/40 rounded-3xl italic text-xs text-muted-foreground">
                      No products added to the catalog database yet. Click "Add Product" to create one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProductsList.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl border border-border/40 overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between group">
                          <div className="aspect-video w-full relative overflow-hidden bg-secondary/10 border-b border-border/20">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              onError={(e) => { (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url; }}
                              className="size-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                            />
                            <span className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[9px] tracking-wider uppercase font-bold text-ink/80 backdrop-blur-md">
                              {product.category}
                            </span>
                            
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button 
                                onClick={() => openEditProductModal(product)}
                                className="bg-white border border-border/40 p-2 rounded-xl hover:bg-gold hover:text-white transition shadow-sm text-ink cursor-pointer"
                                title="Edit Catalog Fields"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              <button 
                                onClick={() => setShowDeleteProductConfirm(product)}
                                className="bg-white border border-border/40 p-2 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm text-ink cursor-pointer"
                                title="Remove Formulation"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="font-display text-lg group-hover:text-gold transition-colors">{product.name}</h4>
                                <span className="font-display font-bold text-accent text-gold text-lg">${product.price.toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 italic font-serif leading-relaxed">
                                {product.description || "No botanical notes declared."}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-border/30">
                              {product.ingredients && product.ingredients.length > 0 && (
                                <div className="flex flex-wrap gap-1 text-[9px] tracking-wider uppercase text-gold font-bold">
                                  <Sparkles className="size-3 shrink-0" />
                                  {product.ingredients.slice(0, 3).join(" · ")}
                                </div>
                              )}
                              <div className="text-[10px] text-muted-foreground italic">
                                ID: <span className="font-mono bg-secondary/50 px-1 py-0.5 rounded text-[9px] font-bold uppercase">{product.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── CUSTOMERS TAB ──────────────────────────────────────────────────────── */}
              {activeTab === "customers" && (
                <div className="space-y-6 animate-fade-up">
                  <div className="bg-white rounded-[2rem] border border-border/40 shadow-luxe overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-secondary/10 border-b border-border/40">
                          <tr>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Client Name</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Email</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Region</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold text-center">Orders</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">LTV Contribution</th>
                            <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Account Channel</th>
                            <th className="px-8 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {filteredCustomersList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-8 py-24 text-center text-muted-foreground italic text-xs">
                                No customer records loaded in directory matching filters.
                              </td>
                            </tr>
                          ) : (
                            filteredCustomersList.map((customer, idx) => (
                              <tr 
                                key={idx} 
                                onClick={() => setSelectedCustomer(customer)}
                                className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                              >
                                <td className="px-8 py-5">
                                  <div className="text-xs font-bold font-display flex items-center gap-2">
                                    {customer.source === "manual" || customer.source === "hybrid" ? (
                                      <Award className="size-3.5 text-gold shrink-0" title="VIP Registered Client" />
                                    ) : (
                                      <UserCheck className="size-3.5 text-slate-400 shrink-0" />
                                    )}
                                    {customer.name}
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-xs text-muted-foreground font-mono">{customer.email}</td>
                                <td className="px-8 py-5 text-xs text-muted-foreground">{customer.city}</td>
                                <td className="px-8 py-5 text-xs text-center font-bold">{customer.orderCount}</td>
                                <td className="px-8 py-5 text-xs font-bold text-emerald-600">${customer.totalSpent.toFixed(2)}</td>
                                <td className="px-8 py-5">
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] tracking-wider uppercase font-bold ${
                                    customer.source === "online" ? "text-blue-600 bg-blue-50 border border-blue-100" :
                                    customer.source === "manual" ? "text-gold bg-amber-50 border border-amber-100" :
                                    "text-violet-600 bg-violet-50 border border-violet-100"
                                  }`}>
                                    {customer.source}
                                  </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-ink transition-transform group-hover:translate-x-1 inline" />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── SECURITY SETTINGS TAB ─────────────────────────────────────────────── */}
              {activeTab === "settings" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
                  
                  {/* Master Profile Info Card */}
                  <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-sm space-y-6 h-fit">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl flex items-center gap-2">
                        <User className="size-5 text-gold" /> Master Credentials
                      </h3>
                      <p className="text-xs text-muted-foreground">Admin profile parameters and connection status.</p>
                    </div>

                    <div className="space-y-4 pt-2 text-xs">
                      <div className="flex justify-between py-2 border-b border-border/20">
                        <span className="text-muted-foreground font-medium">Username:</span>
                        <span className="font-mono font-bold text-ink bg-secondary/30 px-2 py-0.5 rounded">tsr_admin</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/20">
                        <span className="text-muted-foreground font-medium">Access Tier:</span>
                        <span className="font-bold text-emerald-600">Master Administrator</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/20">
                        <span className="text-muted-foreground font-medium">Database Store:</span>
                        <span className="font-bold text-ink">MongoDB tsr-commerce</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground font-medium">Status:</span>
                        <span className="font-bold text-gold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-600" /> Active Sync
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Change Password Form Card */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-border/40 shadow-sm space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl flex items-center gap-2">
                        <KeyRound className="size-5 text-gold" /> Change Account Password
                      </h3>
                      <p className="text-xs text-muted-foreground">Modify security credentials saved directly in MongoDB.</p>
                    </div>

                    <form onSubmit={handlePasswordChangeSubmit} className="space-y-5 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Current Password *</label>
                        <input 
                          type="password"
                          placeholder="••••••••"
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                          className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">New Security Password *</label>
                          <input 
                            type="password"
                            placeholder="At least 5 characters"
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                            className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Confirm New Password *</label>
                          <input 
                            type="password"
                            placeholder="Must match exactly"
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                            className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button 
                          type="submit"
                          disabled={submittingPassword}
                          className="bg-ink text-white px-8 py-3 rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-gold transition shadow-soft flex items-center gap-2 cursor-pointer"
                        >
                          {submittingPassword && <Loader2 className="size-3.5 animate-spin" />}
                          {submittingPassword ? "Updating DB..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* DRAWERS & OVERLAYS */}
      
      {/* 1. ORDER DETAILS SLIDING DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-border/20 flex flex-col justify-between">
              
              <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-gold">Fulfillment Details</div>
                  <h3 className="font-display text-2xl flex items-center gap-2">Order {selectedOrder.id}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2.5 rounded-xl border border-border/60 hover:bg-secondary transition text-ink cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="bg-[#FDFCF9] p-5 rounded-2xl border border-border/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ritual Status</span>
                    <div className="text-xs font-bold text-ink uppercase tracking-wider">{selectedOrder.status}</div>
                  </div>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order["status"])}
                    className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold border ${getStatusColor(selectedOrder.status)} outline-none cursor-pointer`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display text-lg pb-2 border-b border-border/30 flex items-center gap-2">
                    <Users className="size-4 text-gold" /> Client Profile
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-muted-foreground font-bold">Client Name:</div>
                    <div className="col-span-2 text-ink font-semibold">{selectedOrder.customerName}</div>
                    <div className="text-muted-foreground font-bold">Email Address:</div>
                    <div className="col-span-2 text-ink font-mono">{selectedOrder.email}</div>
                    <div className="text-muted-foreground font-bold">Phone Number:</div>
                    <div className="col-span-2 text-ink">{selectedOrder.phone || "N/A"}</div>
                    <div className="text-muted-foreground font-bold">Dispatch Region:</div>
                    <div className="col-span-2 text-ink leading-relaxed">
                      {selectedOrder.address}<br />
                      {selectedOrder.city}, {selectedOrder.zipCode}
                    </div>
                    <div className="text-muted-foreground font-bold">Ritual Date:</div>
                    <div className="col-span-2 text-ink">{selectedOrder.date}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display text-lg pb-2 border-b border-border/30 flex items-center gap-2">
                    <ShoppingCart className="size-4 text-gold" /> Formulations Ordered
                  </h4>
                  <div className="divide-y divide-border/20">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-4 flex gap-4 items-center">
                        <div className="size-12 rounded-xl overflow-hidden bg-secondary/20 border border-border/40 shrink-0">
                          <img src={item.image} alt={item.name} onError={(e) => { (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url; }} className="size-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold font-display">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">Qty: {item.quantity} &nbsp;·&nbsp; ${item.price.toFixed(2)} each</div>
                        </div>
                        <div className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border/30 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal value</span>
                    <span className="font-medium text-ink">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Premium Shipping fee</span>
                    <span className="font-medium text-ink">
                      {selectedOrder.shipping === 0 ? "Complimentary" : `$${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-border/20">
                    <span className="font-display font-medium">Grand Billing Total</span>
                    <span className="text-gold font-display text-lg">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-border/40 bg-secondary/5 flex gap-3">
                <button onClick={() => handleStatusUpdate(selectedOrder.id, "shipped")} className="flex-1 bg-ink text-white py-3 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft cursor-pointer text-center">
                  Fulfill & Ship
                </button>
                <button onClick={() => handleStatusUpdate(selectedOrder.id, "completed")} className="flex-1 border border-border/60 hover:bg-secondary py-3 rounded-full text-[10px] tracking-wider uppercase font-bold text-ink transition cursor-pointer text-center">
                  Mark Complete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOMER HISTORY SLIDING DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCustomer(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-l-border/20 flex flex-col justify-between">
              
              <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-gold">VIP Client Profile</div>
                  <h3 className="font-display text-2xl flex items-center gap-2">{selectedCustomer.name}</h3>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2.5 rounded-xl border border-border/60 hover:bg-secondary transition text-ink cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FDFCF9] p-4 rounded-2xl border border-border/30 space-y-1 text-center">
                    <span className="text-[9px] tracking-wider uppercase text-muted-foreground font-bold">Total Spent LTV</span>
                    <div className="text-xl font-bold font-display text-emerald-600">${selectedCustomer.totalSpent.toFixed(2)}</div>
                  </div>
                  <div className="bg-[#FDFCF9] p-4 rounded-2xl border border-border/30 space-y-1 text-center">
                    <span className="text-[9px] tracking-wider uppercase text-muted-foreground font-bold">Orders Completed</span>
                    <div className="text-xl font-bold font-display text-ink">{selectedCustomer.orderCount}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display text-lg pb-2 border-b border-border/30 flex items-center gap-2">
                    <Users className="size-4 text-gold" /> Personal Credentials
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-muted-foreground font-bold">Phone Number:</div>
                    <div className="col-span-2 text-ink font-medium">{selectedCustomer.phone}</div>
                    <div className="text-muted-foreground font-bold">Email Address:</div>
                    <div className="col-span-2 text-ink font-mono font-medium">{selectedCustomer.email}</div>
                    <div className="text-muted-foreground font-bold">Region Location:</div>
                    <div className="col-span-2 text-ink leading-relaxed font-medium">
                      {selectedCustomer.address}<br />
                      {selectedCustomer.city}
                    </div>
                    <div className="text-muted-foreground font-bold">Last Checkout:</div>
                    <div className="col-span-2 text-ink font-medium">{selectedCustomer.lastOrderDate}</div>
                    <div className="text-muted-foreground font-bold">VIP Notes:</div>
                    <div className="col-span-2 text-ink font-serif italic">{selectedCustomer.notes || "No bespoke private client notes saved."}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display text-lg pb-2 border-b border-border/30 flex items-center gap-2">
                    <FileText className="size-4 text-gold" /> Checkout Ledger
                  </h4>
                  {selectedCustomer.orders.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic text-center py-8">
                      No online purchases registered for this profile yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCustomer.orders.map((order: any, idx: number) => (
                        <div key={idx} onClick={() => { setSelectedOrder(order); setSelectedCustomer(null); }} className="p-4 rounded-xl border border-border/40 bg-secondary/5 hover:bg-secondary/15 transition cursor-pointer flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-serif text-ink">{order.id}</div>
                            <div className="text-[10px] text-muted-foreground">{order.date} &nbsp;·&nbsp; {order.items.length} item(s)</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-xs font-bold text-ink">${order.total.toFixed(2)}</div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] tracking-wider uppercase font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. ADD PRODUCT MODAL OVERLAY */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-2xl max-w-lg w-full z-10 overflow-hidden flex flex-col justify-between max-h-[90vh]">
            
            <div className="px-8 py-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-display text-2xl">New Formulation</h3>
              <button onClick={() => setShowAddProductModal(false)} className="p-2 rounded-xl border border-border/60 hover:bg-secondary text-ink cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Product ID Slug *</label>
                  <input 
                    type="text" 
                    placeholder="rose-mist"
                    value={productForm.id}
                    onChange={(e) => setProductForm({...productForm, id: e.target.value})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value as Product["category"]})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="hair">Hair Care</option>
                    <option value="skin">Skin Care</option>
                    <option value="bundles">Ritual Bundles</option>
                    <option value="men">Men's Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Name *</label>
                  <input 
                    type="text" 
                    placeholder="TSR™ Rosemary Mist"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Price *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="19.99"
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Description</label>
                <textarea 
                  placeholder="Botanical notes of this recipe..."
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none font-serif italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Ingredients (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Rosemary, Castor, Vitamin E"
                  value={productForm.ingredients}
                  onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Benefits (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Deep moisture, Protects ends"
                  value={productForm.benefits}
                  onChange={(e) => setProductForm({...productForm, benefits: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Product Image</span>
                  <button
                    type="button"
                    onClick={() => setProductForm({...productForm, useCustomImage: !productForm.useCustomImage})}
                    className="text-[9px] tracking-wider uppercase text-gold hover:text-ink transition font-bold cursor-pointer"
                  >
                    {productForm.useCustomImage ? "Preset Assets" : "Custom URL"}
                  </button>
                </div>

                {productForm.useCustomImage ? (
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.imageCustom}
                    onChange={(e) => setProductForm({...productForm, imageCustom: e.target.value})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({...productForm, imagePreset: img.url})}
                        className={`aspect-square rounded-xl overflow-hidden border-2 relative shrink-0 transition-all ${
                          productForm.imagePreset === img.url ? "border-gold scale-95 shadow-soft" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3 border-t border-border/30">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="flex-1 border border-border/60 hover:bg-secondary py-3 rounded-full text-[10px] tracking-wider uppercase font-bold text-ink transition cursor-pointer text-center">
                  Cancel
                </button>
                <button type="submit" disabled={submittingProduct} className="flex-1 bg-ink text-white py-3 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft flex items-center justify-center gap-2 cursor-pointer">
                  {submittingProduct && <Loader2 className="size-3.5 animate-spin" />}
                  {submittingProduct ? "Formulating..." : "Create Product"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 4. EDIT PRODUCT MODAL OVERLAY */}
      {showEditProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowEditProductModal(null)} />
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-2xl max-w-lg w-full z-10 overflow-hidden flex flex-col justify-between max-h-[90vh]">
            
            <div className="px-8 py-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-display text-2xl">Modify Formulation</h3>
              <button onClick={() => setShowEditProductModal(null)} className="p-2 rounded-xl border border-border/60 hover:bg-secondary text-ink cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Product ID (Locked)</label>
                  <input type="text" value={showEditProductModal.id} disabled className="w-full bg-secondary/10 border border-transparent rounded-xl px-4 py-2.5 text-xs font-mono text-muted-foreground select-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value as Product["category"]})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="hair">Hair Care</option>
                    <option value="skin">Skin Care</option>
                    <option value="bundles">Ritual Bundles</option>
                    <option value="men">Men's Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Name *</label>
                  <input 
                    type="text" 
                    placeholder="TSR™ Rosemary Mist"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Price *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="19.99"
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Description</label>
                <textarea 
                  placeholder="Botanical notes of this recipe..."
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none font-serif italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Ingredients (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Rosemary, Castor, Vitamin E"
                  value={productForm.ingredients}
                  onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Benefits (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Deep moisture, Protects ends"
                  value={productForm.benefits}
                  onChange={(e) => setProductForm({...productForm, benefits: e.target.value})}
                  className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Product Image</span>
                  <button
                    type="button"
                    onClick={() => setProductForm({...productForm, useCustomImage: !productForm.useCustomImage})}
                    className="text-[9px] tracking-wider uppercase text-gold hover:text-ink transition font-bold cursor-pointer"
                  >
                    {productForm.useCustomImage ? "Preset Assets" : "Custom URL"}
                  </button>
                </div>

                {productForm.useCustomImage ? (
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.imageCustom}
                    onChange={(e) => setProductForm({...productForm, imageCustom: e.target.value})}
                    className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({...productForm, imagePreset: img.url})}
                        className={`aspect-square rounded-xl overflow-hidden border-2 relative shrink-0 transition-all ${
                          productForm.imagePreset === img.url ? "border-gold scale-95 shadow-soft" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3 border-t border-border/30">
                <button type="button" onClick={() => setShowEditProductModal(null)} className="flex-1 border border-border/60 hover:bg-secondary py-3 rounded-full text-[10px] tracking-wider uppercase font-bold text-ink transition cursor-pointer text-center">
                  Cancel
                </button>
                <button type="submit" disabled={submittingProduct} className="flex-1 bg-ink text-white py-3 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft flex items-center justify-center gap-2 cursor-pointer">
                  {submittingProduct && <Loader2 className="size-3.5 animate-spin" />}
                  {submittingProduct ? "Applying edits..." : "Save Edits"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 5. ADD CUSTOMER MODAL OVERLAY */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowAddCustomerModal(false)} />
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-2xl max-w-md w-full z-10 overflow-hidden flex flex-col justify-between">
            
            <div className="px-8 py-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-display text-2xl">Register VIP Client</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="p-2 rounded-xl border border-border/60 hover:bg-secondary text-ink cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Full Name *</label>
                <input type="text" placeholder="e.g. Lady Clara Sterling" value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Email Address *</label>
                <input type="email" placeholder="clara@sterlinghall.com" value={customerForm.email} onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none font-mono" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Phone Number</label>
                  <input type="text" placeholder="407-555-0199" value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">City Region</label>
                  <input type="text" placeholder="Orlando, FL" value={customerForm.city} onChange={(e) => setCustomerForm({...customerForm, city: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Physical Shipping Address</label>
                <input type="text" placeholder="100 Botanical Manor Lane" value={customerForm.address} onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">Bespoke Client Notes</label>
                <textarea placeholder="Private notes about hair textures, preferred scents..." rows={2} value={customerForm.notes} onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})} className="w-full bg-secondary/15 border border-border/40 focus:border-gold/40 rounded-xl px-4 py-2 text-xs outline-none font-serif italic" />
              </div>

              <div className="pt-4 flex gap-3 border-t border-border/30">
                <button type="button" onClick={() => setShowAddCustomerModal(false)} className="flex-1 border border-border/60 hover:bg-secondary py-2.5 rounded-full text-[10px] tracking-wider uppercase font-bold text-ink transition cursor-pointer text-center">
                  Cancel
                </button>
                <button type="submit" disabled={submittingCustomer} className="flex-1 bg-ink text-white py-2.5 rounded-full text-[10px] tracking-wider uppercase font-bold hover:bg-gold transition shadow-soft flex items-center justify-center gap-2 cursor-pointer">
                  {submittingCustomer && <Loader2 className="size-3.5 animate-spin" />}
                  {submittingCustomer ? "Saving Client..." : "Register Client"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. DELETE PRODUCT CONFIRMATION MODAL OVERLAY */}
      {showDeleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowDeleteProductConfirm(null)} />
          <div className="bg-white rounded-3xl border border-border/40 shadow-2xl max-w-sm w-full z-10 overflow-hidden p-8 space-y-6 text-center">
            <div className="size-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="size-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-xl">Decommission Formulation?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete <strong className="text-ink">"{showDeleteProductConfirm.name}"</strong>? This will permanently remove this ritual from the storefront and MongoDB catalog.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteProductConfirm(null)} className="flex-1 border border-border/60 hover:bg-secondary py-3 rounded-full text-[10px] tracking-wider uppercase font-bold text-ink transition cursor-pointer text-center">
                Retain Mist
              </button>
              <button onClick={handleDeleteProductConfirm} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-full text-[10px] tracking-wider uppercase font-bold transition shadow-soft cursor-pointer text-center">
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
