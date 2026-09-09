import React from "react";
import { Sparkles, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoyalty } from "../context/LoyaltyContext";

function LoyaltyFloating() {
  const { points } = useLoyalty();

  return (
    <Link
      to="/loyalty"
      aria-label="Ethnique Privilege Rewards"
      className="
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40
        bg-gradient-to-r from-[#6D1830] to-[#8C2F4D]
        dark:from-[#26152B] dark:to-[#431F4A]
        text-[#FAF7F2] dark:text-[#E5C583]
        border border-[#D4B483]/60 dark:border-[#E5C583]/50
        px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full
        shadow-[0_8px_25px_rgba(109,24,48,0.3)]
        dark:shadow-[0_8px_25px_rgba(0,0,0,0.8)]
        flex items-center gap-2
        hover:scale-105 active:scale-95
        transition-all duration-300
        group backdrop-blur-md
      "
    >
      <Gift size={18} className="text-[#E5C583] group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-xs font-semibold tracking-wider font-serif">
        {points || 0} pts
      </span>
      <Sparkles size={12} className="text-[#E5C583] animate-pulse" />
    </Link>
  );
}

export default LoyaltyFloating;