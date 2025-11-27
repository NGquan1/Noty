import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, StickyNote, User, Dog, Star } from "lucide-react";
import SimpleScratchCard from "./SimpleScratch.jsx";

const prizePool = [
  {
    id: "meat_1",
    image: "/meat.png",
    text: "Polychrome x60",
    icon: "/polychrome.png",
  },
  {
    id: "meat_2",
    image: "/meat.png",
    text: "Polychrome x10",
    icon: "/polychrome.png",
  },
  {
    id: "meat_3",
    image: "/meat.png",
    text: "Denny x12888",
    icon: "/denny.png",
  },
  { id: "meat_4", image: "/meat.png", text: "Denny x8888", icon: "/denny.png" },
  { id: "bone_1", image: "/bone.png", text: "Denny x2888", icon: "/denny.png" },
  {
    id: "howl_1",
    image: "/howl.png",
    text: "Polychrome x40",
    icon: "/polychrome.png",
  },
  {
    id: "howl_2",
    image: "/howl.png",
    text: "Polychrome x20",
    icon: "/polychrome.png",
  },
  { id: "food_1", image: "/food.png", text: "Denny x5888", icon: "/denny.png" },
];

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsDark(window.scrollY > 10);
    };
    setIsDark(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
                  onClick={() => {
                    const randomIndex = Math.floor(
                      Math.random() * prizePool.length
                    );
                    setSelectedPrize(prizePool[randomIndex]);

                    setIsRevealed(false);
                    setShowGame(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-all shadow-sm border border-gray-300 text-gray-700 font-semibold"
                >
                  <Dog className="w-5 h-5" />
                </button>
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

      {showGame && selectedPrize && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
          onClick={() => setShowGame(false)}
        >
          <div
            className="animate-scaleIn w-[360px] rounded-3xl shadow-2xl overflow-hidden relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="bg-white p-4 pb-6 relative">
              <div className="flex justify-between items-start">
                <h2 className="text-6xl font-black italic text-black tracking-tighter transform -skew-x-6">
                  LUCKY
                </h2>
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full border-[3px] border-black flex items-center justify-center">
                    <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[10px] border-b-black mb-1"></div>
                  </div>
                  <div className="text-[0.5rem] font-bold text-center mt-0.5 tracking-tighter">
                    Lucky-One.Corp
                  </div>
                </div>
              </div>
              
              {/* Ticket Notches */}
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gray-900 z-10"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gray-900 z-10"></div>
              
              {/* Dashed Line */}
              <div className="absolute bottom-0 left-0 w-full flex justify-center">
                 <div className="w-[90%] border-b-2 border-dashed border-black/20"></div>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-6 pt-8 bg-gradient-to-br from-[#84e458] to-[#f2e74e] relative overflow-hidden">
              {/* Grunge/Splatter Effects (Simulated with absolute shapes) */}
              <div className="absolute top-10 left-[-20px] w-20 h-20 bg-yellow-300/40 rotate-45 transform skew-x-12"></div>
              <div className="absolute bottom-10 right-[-10px] w-32 h-32 bg-green-400/30 rounded-full blur-xl"></div>

              {/* Scratch Area */}
              <div className="relative z-10 mx-auto w-full max-w-[280px] h-[100px] bg-black transform -rotate-1 shadow-lg border-2 border-black/10">
                 <div className="w-full h-full p-1">
                    <SimpleScratchCard
                      onReveal={() => setIsRevealed(true)}
                      prizeImage={selectedPrize.image}
                    />
                 </div>
              </div>

              {/* Result Text */}
              {isRevealed && (
                <div className="mt-4 text-center">
                  <div className="inline-block bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border-2 border-black animate-bounce">
                    <div className="font-black text-xl text-black flex items-center gap-2">
                       {selectedPrize.icon && (
                        <img src={selectedPrize.icon} className="w-6 h-6" alt="" />
                       )}
                       {selectedPrize.text}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 flex justify-between items-end">
                <div className="text-xs font-bold text-black/80 tracking-tight">
                  スクラッチは1日1回まで
                </div>
                <div className="flex gap-0.5 text-black">
                  <Star size={14} fill="black" />
                  <Star size={14} fill="black" />
                  <Star size={14} fill="black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn { from {opacity: 0} to {opacity: 1} }
          @keyframes scaleIn { from {transform: scale(0.8); opacity:0} to {transform: scale(1); opacity:1} }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        `}
      </style>
    </>
  );
};

export default Navbar;
