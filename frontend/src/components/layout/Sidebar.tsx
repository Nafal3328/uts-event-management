import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Tag,
  Mic2,
  CalendarDays,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/categories", icon: Tag, label: "Kategori" },
  { to: "/speakers", icon: Mic2, label: "Pembicara" },
  { to: "/events", icon: CalendarDays, label: "Event" },
  { to: "/biodata", icon: User, label: "Biodata" },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sampai jumpa! 👋");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-surface-900 flex flex-col fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-white font-bold text-lg leading-tight">
              EventSphere
            </h1>
            <p className="text-xs text-white/40 font-body">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-body font-medium text-sm group ${
                isActive
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 bg-brand-500/20 border border-brand-500/30 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-brand-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold font-display truncate">
              {user?.name ?? "Mahasiswa"}
            </p>
            <p className="text-white/40 text-xs font-mono truncate">
              {user?.nim ?? "—"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
