import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import Logo from "../../assets/LogoSimple.png";
import { usePageMeta } from "../../hooks/usePageMeta";

const DEFAULT_ADMIN_EMAIL = "admin@axiolinksystems.com";

const AdminLogin = () => {
  usePageMeta({
    title: "Admin Login | Axiolink Systems",
    noindex: true,
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email.trim(), password, remember);
      toast.success(`Welcome back, ${user?.name || "Admin"}`);
      navigate("/admin");
    } catch (err) {
      if (!err.response) {
        toast.error("Cannot reach API server. Run: npm run dev:backend (port 4000)");
      } else if (err.response?.data?.errors?.length) {
        toast.error(err.response.data.errors.map((e) => e.message).join(". "));
      } else {
        toast.error(err.response?.data?.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
        <div className="relative">
          <img src={Logo} alt="Axiolink" className="h-10 brightness-0 invert mb-8" />
          <h1 className="text-4xl font-semibold text-white leading-tight">
            Enterprise Content
            <br />
            Management System
          </h1>
          <p className="mt-4 text-blue-100 text-lg max-w-md leading-relaxed">
            Manage internships, applications, courses, certificates, and all website content from one unified platform.
          </p>
        </div>
        <div className="relative flex items-center gap-6 text-blue-200 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Secure authentication
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Super Admin only
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="lg:hidden mb-8">
            <img src={Logo} alt="Axiolink" className="h-12 sm:h-11 mb-4" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Sign in to Admin</h2>
          <p className="mt-2 text-sm text-slate-500">
            Super Admin access only.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            Axiolink Systems (Pvt) Ltd. · Admin Portal
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
