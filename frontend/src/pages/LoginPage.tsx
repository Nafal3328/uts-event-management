import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Sparkles, LogIn, GraduationCap } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(nim, password);

    if (result.success) {
      toast.success(result.message);
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              EventSphere
            </h1>
            <p className="text-white/50 text-sm mt-1 font-body">
              Event Management System
            </p>
          </div>

          {/* Info hint */}
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
            <GraduationCap className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-brand-300 text-xs font-medium">Demo Credentials</p>
              <p className="text-white/60 text-xs font-mono mt-0.5">
                
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2 font-body">
                NIM (Nomor Induk Mahasiswa)
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Masukkan NIM Anda"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all font-body font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2 font-body">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all font-body text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-brand-500/20 mt-2 font-display"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6 font-body">
            Ujian Akhir Semester · D-4 Teknik Informatika
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
