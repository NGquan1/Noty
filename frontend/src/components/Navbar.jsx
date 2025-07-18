import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, StickyNote, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-gray" />
              </div>
              <h1 className="text-lg font-bold">Noty</h1>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="btn btn-sm btn-ghost flex items-center gap-1 px-3"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={logout}
                className="btn btn-sm btn-ghost flex items-center gap-1 px-3"
              >
                <LogOut className="w-4 h-4" />
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
