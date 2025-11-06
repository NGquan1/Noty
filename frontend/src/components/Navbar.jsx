import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, StickyNote, User } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      setIsDark(window.scrollY > 10);
    };
    setIsDark(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-md bg-base-100/80 shadow-md">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-all"
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center shadow-md transition-colors duration-200 ${
                  isDark ? "bg-gray-800" : "bg-primary/10"
                }`}
              >
                <StickyNote
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isDark ? "text-white" : "text-primary"
                  }`}
                />
              </div>
              <span
                className={`text-2xl font-extrabold tracking-tight drop-shadow-sm transition-colors duration-200 ${
                  isDark ? "text-white" : "text-primary"
                }`}
              >
                Noty
              </span>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 hover:bg-primary/10 transition-all shadow-sm border border-base-300"
              >
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
                <span className="font-semibold text-base-content">
                  {authUser.fullName || "Profile"}
                </span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-base-200 hover:bg-red-100 transition-all shadow-sm border border-base-300 text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
