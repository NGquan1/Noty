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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="animate-fadeIn w-[340px] rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gray-100 p-2">
              <div className="flex justify-between items-center">
                <h2 className="text-5xl font-extrabold italic text-black tracking-wider">
                  LUCKY
                </h2>
                <div className="w-8 h-8 rounded-full border-4 border-black flex items-center justify-center">
                  <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[9px] border-b-black transform translate-y-0.5"></div>
                </div>
              </div>
            </div>

            <div
              className="p-4 text-center"
              style={{ backgroundColor: "#63d44e" }}
            >
              <div className=" rounded-lg p-1 my-1 flex items-center justify-center">
                <SimpleScratchCard
                  onReveal={() => setIsRevealed(true)}
                  prizeImage={selectedPrize.image}
                />
              </div>

              {isRevealed && (
                <div className="mt-4 text-black font-semibold animate-bounce">
                  {selectedPrize.icon && (
                    <img
                      src={selectedPrize.icon}
                      alt=""
                      className="inline-block h-[1em] w-[1em]"
                    />
                  )}
                  {selectedPrize.text}
                </div>
              )}

              <div className="flex justify-between items-center mt-1 pt-1">
                <span className="text-xs text-black/80 font-medium font-sans-serif">
                  Only one scratch card per day!
                </span>
                <div className="flex ">
                  <Star />
                  <Star />
                  <Star />
                </div>
              </div>

              <button
                onClick={() => setShowGame(false)}
                className="mt-3 px-4 py-1 bg-white hover:bg-gray-200 text-black font-bold rounded-lg shadow transition-all"
              >
                Close
              </button>
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
