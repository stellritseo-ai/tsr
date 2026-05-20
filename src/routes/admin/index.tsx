import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { 
  Package, Users, ShoppingCart, TrendingUp, 
  Search, Filter, ExternalLink, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, BarChart3
} from "lucide-react";

import { getOrders, updateOrderStatus } from "@/lib/serverFunctions";
import { Order } from "@/types/order";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin | TSR Botanical Rituals" }],
  }),
});

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data as Order[]);
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    // In a real app, this would call a server function to update the DB
    console.log("Updating status:", orderId, newStatus);
    // For now, we update local state
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "shipped": return "text-blue-600 bg-blue-50";
      case "processing": return "text-amber-600 bg-amber-50";
      case "pending": return "text-slate-600 bg-slate-50";
      case "cancelled": return "text-rose-600 bg-rose-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-ink selection:bg-accent/20">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 min-h-screen bg-ink text-white p-8 space-y-12 sticky top-0 hidden lg:block">
          <div className="font-display text-3xl">TSR<span className="text-accent">.</span> Admin</div>
          
          <nav className="space-y-4">
            <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">Management</div>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
            >
              <BarChart3 className="size-4" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "orders" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
            >
              <ShoppingCart className="size-4" /> Orders
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "products" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
            >
              <Package className="size-4" /> Products
            </button>
            <button 
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "customers" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
            >
              <Users className="size-4" /> Customers
            </button>
          </nav>

          <div className="pt-12">
            <Link to="/" className="text-xs text-white/40 hover:text-white transition flex items-center gap-2">
              <ExternalLink className="size-3" /> Visit Storefront
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 lg:p-12 space-y-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="font-display text-4xl">Order Management</h1>
              <p className="text-muted-foreground text-sm">Review and fulfill your botanical rituals.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white border border-border/60 p-2.5 rounded-xl hover:bg-secondary/20 transition shadow-sm">
                <Search className="size-5 text-muted-foreground" />
              </button>
              <button className="bg-ink text-white px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase font-bold hover:bg-accent transition shadow-luxe flex items-center gap-2">
                Export Orders
              </button>
            </div>
          </header>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Revenue", val: "$12,482.00", icon: TrendingUp, color: "text-green-600" },
              { label: "Active Orders", val: "14", icon: Clock, color: "text-amber-600" },
              { label: "Rituals Shipped", val: "142", icon: CheckCircle2, color: "text-blue-600" },
              { label: "Customer Base", val: "892", icon: Users, color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground">{stat.label}</div>
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
                <div className="text-3xl font-display">{stat.val}</div>
              </div>
            ))}
          </div>

          {/* ORDERS TABLE */}
          <section className="bg-white rounded-[2rem] border border-border/40 shadow-luxe overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
              <h2 className="font-display text-2xl">Recent Orders</h2>
              <div className="flex items-center gap-4">
                <button className="text-xs text-muted-foreground hover:text-ink flex items-center gap-2">
                  <Filter className="size-3" /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/10 border-b border-border/40">
                  <tr>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Order ID</th>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Customer</th>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Date</th>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Items</th>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Total</th>
                    <th className="px-8 py-4 text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Status</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center text-muted-foreground italic">
                        No rituals have been ordered yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/10 transition-colors cursor-pointer group">
                        <td className="px-8 py-6 text-sm font-medium">{order.id}</td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-display">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </td>
                        <td className="px-8 py-6 text-sm text-muted-foreground">{order.date}</td>
                        <td className="px-8 py-6 text-sm">{order.items.length} items</td>
                        <td className="px-8 py-6 text-sm font-medium">${order.total.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order["status"])}
                            className={`px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold outline-none border-none cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-ink transition-transform group-hover:translate-x-1 inline" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <footer className="px-8 py-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <div>Showing 5 of 142 orders</div>
              <div className="flex items-center gap-4">
                <button className="hover:text-ink transition">Previous</button>
                <div className="flex items-center gap-2">
                  <span className="size-6 bg-ink text-white flex items-center justify-center rounded-lg">1</span>
                  <span className="size-6 flex items-center justify-center rounded-lg hover:bg-secondary transition">2</span>
                  <span className="size-6 flex items-center justify-center rounded-lg hover:bg-secondary transition">3</span>
                </div>
                <button className="hover:text-ink transition">Next</button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
