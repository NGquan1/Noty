const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {/* Geometric patterns */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `float ${2 + Math.random() * 2}s infinite ease-in-out ${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Subtle glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gray-500/20 rounded-full blur-3xl"/>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gray-600/20 rounded-full blur-3xl"/>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm text-center relative z-10">
        {/* Main icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 blur-xl"/>
          <div className="relative bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 transform hover:scale-105 transition-all duration-300">
            <svg className="w-12 h-12 mx-auto text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="relative">
          <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">{title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{subtitle}</p>

          {/* Feature list */}
          <div className="space-y-3 text-left">
            {[
              'Smart task management',
              'Real-time collaboration',
              'Progress tracking'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
