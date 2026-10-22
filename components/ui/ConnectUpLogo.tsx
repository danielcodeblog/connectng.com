import React from 'react';

export const ConnectUpIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-7 h-7", 
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={`select-none shrink-0 drop-shadow-xs ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="culogo-left-node" cx="32%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </radialGradient>
        <radialGradient id="culogo-right-node" cx="32%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="55%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#854D0E" />
        </radialGradient>
        <linearGradient id="culogo-connector" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="25%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>
      <path d="M 60 140 Q 100 60 140 60" fill="none" stroke="url(#culogo-connector)" strokeWidth="18" strokeLinecap="round" />
      <circle cx="60" cy="140" r="36" fill="url(#culogo-left-node)" />
      <circle cx="140" cy="60" r="36" fill="url(#culogo-right-node)" />
    </svg>
  );
};

export interface ConnectUpLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  lightMode?: boolean;
  withPeriod?: boolean;
  iconSize?: number;
}

export const ConnectUpLogo: React.FC<ConnectUpLogoProps> = ({
  className = "",
  iconClassName = "w-7 h-7",
  textClassName = "text-2xl font-[800] tracking-tighter",
  lightMode = false,
  withPeriod = false,
  iconSize
}) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <ConnectUpIcon className={iconClassName} size={iconSize} />
      <span className={textClassName}>
        <span className={lightMode ? "text-zinc-950 inline" : "text-white dark:text-white inline"}>connect</span>
        <span className="text-[#FFBF00] inline">up{withPeriod ? "." : ""}</span>
      </span>
    </div>
  );
};

export default ConnectUpLogo;
