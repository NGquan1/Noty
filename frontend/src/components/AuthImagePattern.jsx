const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-black p-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg,
              #000000 0%,
              #1a1a1a 25%,
              #333333 50%,
              #666666 75%,
              #808080 100%
            )`,
          backgroundSize: '200% 200%',
          animation: 'gradient 10s ease infinite'
        }}
      />

      {/* Overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-40"/>
      
      {/* Content container */}
      <div className="max-w-sm text-center relative z-10">
        {/* Main icon with glass effect */}
        <div className="mb-6">
          <div className="inline-block p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow-lg hover:scale-105 transition-all duration-300">
            <svg className="w-10 h-10 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
        </div>

        {/* Text content with better contrast */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{subtitle}</p>

          {/* Feature list with improved visibility */}
          <div className="mt-6 space-y-3 text-left">
            {[
              'Smart task management',
              'Real-time collaboration',
              'Progress tracking'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
