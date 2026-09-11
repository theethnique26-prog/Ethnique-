import React, { useState } from "react";
import { Sparkles, Gift, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoyalty } from "../context/LoyaltyContext";
import { useAuth } from "../context/AuthContext";

function LoyaltyFloating() {
  const { points } = useLoyalty();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("ethnique_loyalty_badge_dismissed") === "true"
  );

  if (dismissed) return null;

  const handleClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/loyalty" } });
    } else {
      navigate("/loyalty");
    }
  };

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem("ethnique_loyalty_badge_dismissed", "true");
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
      aria-label="Ethnique Privilege Club Rewards"
      className="
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40
        bg-gradient-to-r from-[#6D1830] to-[#8C2F4D]
        dark:from-[#26152B] dark:to-[#431F4A]
        text-[#FAF7F2] dark:text-[#E5C583]
        border border-[#D4B483]/60 dark:border-[#E5C583]/50
        pl-3.5 pr-2 py-2 sm:pl-4 sm:pr-2.5 sm:py-2 rounded-full
        shadow-[0_8px_25px_rgba(109,24,48,0.3)]
        dark:shadow-[0_8px_25px_rgba(0,0,0,0.8)]
        flex items-center gap-2
        hover:scale-105 active:scale-95
        transition-all duration-300
        group backdrop-blur-md cursor-pointer select-none
      "
    >
      <Gift size={17} className="text-[#E5C583] group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-xs font-semibold tracking-wider font-serif">
        {user ? `${points || 0} pts` : "Club Points"}
      </span>
      <Sparkles size={12} className="text-[#E5C583] animate-pulse" />
      
      <button
        onClick={handleDismiss}
        title="Dismiss notification"
        aria-label="Close Club Points badge"
        className="ml-1 p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-black/30 text-white/70 hover:text-white transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default LoyaltyFloating;