import React from "react";
import logoLight from "../assets/ethnique_logo.png";
import logoDark from "../assets/ethnique_logo_dark.png";

const BrandLogo = ({ className = "", size = "normal", forceDark = false }) => {
  const isSmall = size === "small";

  return (
    <div
      className={`inline-flex items-center justify-center select-none group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Light Mode: Hidden if forceDark is enabled */}
      {!forceDark && (
        <img
          src={logoLight}
          alt="Ethnique By Jayant"
          className={`
            dark:hidden object-contain
            ${isSmall ? "h-8 sm:h-9" : "h-10 sm:h-11 md:h-12"}
          `}
        />
      )}

      {/* Dark Mode / Golden Luxury Logo */}
      <img
        src={logoDark}
        alt="Ethnique By Jayant"
        className={`
          ${forceDark ? "block" : "hidden dark:block"} object-contain
          ${isSmall ? "h-8 sm:h-9" : "h-10 sm:h-11 md:h-12"}
          drop-shadow-[0_0_12px_rgba(229,197,131,0.35)]
        `}
      />
    </div>
  );
};

export default BrandLogo;
