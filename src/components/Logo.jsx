import { Link } from "react-router-dom";

const Logo = ({
  className = "",
  showText = true,
  size = "default",
  variant = "default",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    default: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <Link to="/" className={`flex items-center space-x-3 group ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
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
            className="group-hover:opacity-90 transition-opacity duration-300"
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
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-bold ${
              variant === "white"
                ? "text-white group-hover:text-primary-200"
                : "text-neutral-900 group-hover:text-primary-600"
            } transition-colors ${textSizeClasses[size]}`}
          >
            AXIOLINK
          </span>
          <span
            className={`font-display font-medium ${
              variant === "white"
                ? "text-neutral-200 group-hover:text-primary-300"
                : "text-neutral-700 group-hover:text-primary-500"
            } transition-colors ${textSizeClasses[size]} text-sm leading-none`}
          >
            SYSTEMS
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
