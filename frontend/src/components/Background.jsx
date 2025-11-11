import React from "react";

const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #6b7280 0px,
            #6b7280 1px,
            transparent 1px,
            transparent 60px
          ),
          repeating-linear-gradient(
            -45deg,
            #6b7280 0px,
            #6b7280 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      ></div>

      {/* Floating shapes */}
      <div className="absolute top-32 left-20 w-64 h-64 border-2 border-violet-200/30 rounded-full"></div>
      <div className="absolute top-48 right-32 w-48 h-48 border-2 border-blue-200/30 rounded-3xl rotate-12"></div>
      <div className="absolute bottom-40 left-1/3 w-56 h-56 border-2 border-indigo-200/30 rounded-full"></div>
      <div className="absolute bottom-32 right-1/4 w-40 h-40 border-2 border-purple-200/30 rounded-2xl -rotate-12"></div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-300/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-indigo-300/15 to-transparent rounded-full blur-3xl"></div>

      {/* Small accent dots */}
      <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-violet-400/40 rounded-full"></div>
      <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full"></div>
      <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-indigo-400/40 rounded-full"></div>
    </div>
  );
};

export default Background;
