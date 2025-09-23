import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, StickyNote } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-4 group">
              <div
                className="size-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center 
              group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <StickyNote className="size-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-lg">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="text-gray-700 font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-gray-700 font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-800 hover:text-gray-600 font-medium underline underline-offset-4 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to track your project progress."}
      />
    </div>
  );
};
export default LoginPage;
