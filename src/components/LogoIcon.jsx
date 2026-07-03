const LogoIcon = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    default: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main curved shape */}
        <path
          d="M20 20 Q20 10 30 10 L70 10 Q80 10 80 20 L80 40 Q80 50 70 50 L30 50 Q20 50 20 40 Z"
          fill="url(#logoGradient)"
        />

        {/* Network nodes and connections */}
        {/* Top-left node */}
        <circle cx="30" cy="25" r="4" fill="url(#logoGradient)" />

        {/* Bottom-left node */}
        <circle cx="30" cy="45" r="4" fill="url(#logoGradient)" />

        {/* Top-right node */}
        <circle cx="70" cy="25" r="4" fill="url(#logoGradient)" />

        {/* Connection lines */}
        <line
          x1="30"
          y1="25"
          x2="70"
          y2="25"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="25"
          x2="30"
          y2="45"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="45"
          x2="70"
          y2="25"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LogoIcon;


