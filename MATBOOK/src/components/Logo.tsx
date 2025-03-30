
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-3xl font-bold text-white">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <circle cx="25" cy="25" r="24" fill="white" stroke="white" strokeWidth="2"/>
        <path d="M15 20V35" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 15V35" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 25V35" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      HighBridge
    </div>
  );
};

export default Logo;
