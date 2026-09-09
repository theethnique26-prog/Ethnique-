import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Sparkles } from "lucide-react";

const ThemeToggle = ({ className = "", compact = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Daylight" : "Velvet Noir"} mode`}
      className={`
        relative inline-flex items-center
        ${compact ? "w-[68px] h-[32px] p-1" : "w-[124px] h-[40px] px-2 py-1"}
        rounded-full cursor-pointer
        transition-all duration-500 ease-out
        border
        ${
          isDark
            ? "bg-[#1B1420] border-[#D4B483]/40 shadow-[0_2px_14px_rgba(212,180,131,0.2)]"
            : "bg-[#F5EFEB] border-[#D4B483]/50 shadow-[0_2px_12px_rgba(109,24,48,0.08)]"
        }
        hover:border-[#D4B483]
        hover:scale-[1.03]
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-[#D4B483]/60
        group
        ${className}
      `}
      title={isDark ? "Switch to Daylight Mode" : "Switch to Royal Velvet Noir"}
    >
      {/* Background Star / Sun Glow Ambience */}
      <div
        className={`
          absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none
          ${
            isDark
              ? "opacity-100 bg-[radial-gradient(ellipse_at_right,_rgba(212,180,131,0.15),_transparent_70%)]"
              : "opacity-100 bg-[radial-gradient(ellipse_at_left,_rgba(245,158,11,0.12),_transparent_70%)]"
          }
        `}
      />

      {/* Sliding Knob */}
      <div
        className={`
          relative z-10 flex items-center justify-center
          ${compact ? "w-[24px] h-[24px]" : "w-[30px] h-[30px]"}
          rounded-full
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          shadow-md
          ${
            isDark
              ? `${compact ? "translate-x-[36px]" : "translate-x-[76px]"} bg-gradient-to-tr from-[#2A1E30] to-[#3B2944] text-[#E5C583] border border-[#E5C583]/50 shadow-[0_0_10px_rgba(229,197,131,0.35)]`
              : "translate-x-0 bg-gradient-to-tr from-[#FFFDF9] to-[#FAF3E5] text-[#B8860B] border border-[#D4B483]/60 shadow-[0_2px_8px_rgba(184,134,11,0.25)]"
          }
        `}
      >
        {isDark ? (
          <Moon
            size={compact ? 13 : 15}
            className="transition-transform duration-500 rotate-0 group-hover:-rotate-12 fill-[#E5C583]/20"
          />
        ) : (
          <Sun
            size={compact ? 13 : 16}
            className="transition-transform duration-500 rotate-0 group-hover:rotate-45"
          />
        )}
      </div>

      {/* Non-compact Label & Secondary Glyph */}
      {!compact && (
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none select-none text-[11px] font-medium tracking-wide">
          {/* Light Label */}
          <span
            className={`
              flex items-center gap-1 transition-all duration-500
              ${
                !isDark
                  ? "opacity-0 translate-x-1"
                  : "opacity-80 text-[#A89FA8] translate-x-0"
              }
            `}
          >
            <Sun size={12} className="text-[#A89FA8]" />
          </span>

          {/* Dark Label */}
          <span
            className={`
              flex items-center gap-1 transition-all duration-500
              ${
                isDark
                  ? "opacity-0 -translate-x-1"
                  : "opacity-80 text-[#7A6B5B] translate-x-0"
              }
            `}
          >
            <Sparkles size={11} className="text-[#C8A261]" />
            <span className="font-serif italic text-[10px] text-[#8C2F4D]">Noir</span>
          </span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
