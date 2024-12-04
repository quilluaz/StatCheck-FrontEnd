import React from "react";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-maroon">
      <div className="wave-container h-[50px] w-full overflow-hidden relative">
        <svg
          className="absolute bottom-0 w-[200%] h-full animate-wave1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M0,40 C150,200 350,-80 500,40 C650,200 850,-80 1000,40 C1150,200 1350,-80 1500,40 L1500,0 L0,0 Z"
            className="fill-gray-100"></path>
        </svg>
        <svg
          className="absolute bottom-0 w-[200%] h-full animate-wave2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M0,10 C150,160 350,-40 500,10 C650,160 850,-40 1000,10 C1150,160 1350,-40 1500,10 L1500,00 L0,0 Z"
            className="fill-gray-100"
            style={{ opacity: 0.5 }}></path>
        </svg>
        <svg
          className="absolute bottom-0 w-[200%] h-full animate-wave3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M0,60 C150,180 350,-40 500,60 C650,180 850,-40 1000,60 C1150,180 1350,-40 1500,60 L1500,0 L0,0 Z"
            className="fill-gray-100"
            style={{ opacity: 0.3 }}></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-center text-gold">
          © 2024 JISAZ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
