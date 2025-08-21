
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, StickyNote, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 shadow-md">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-all"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-md">
                <StickyNote className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-primary drop-shadow-sm">Noty</h1>
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
                <span className="font-semibold text-base-content">{authUser.fullName || "Profile"}</span>
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
