import React, { useMemo } from "react";

const AnimatedRoyalBackdrop = () => {
  // Generate 32 floating golden zari particles & ember dots across the entire page
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      isStar: i % 4 === 0, // Delicate ✦ sparkle star for variety
      size: (i % 3) * 2 + 3, // 3px to 7px
      left: `${(i * 3.1 + 2) % 96}%`,
      top: `${(i * 5.7 + 3) % 94}%`,
      duration: 9 + (i % 7) * 2.2, // 9s to 24s smooth floating speed
      delay: (i * 0.35) % 6,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">

      {/* --- Ambient Billowing Silk Light Waves --- */}
      <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(212,180,131,0.22)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(229,197,131,0.14)_0%,_transparent_70%)] blur-3xl animate-floatOrb1" />
      <div className="absolute top-[35%] -left-[10%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,_rgba(140,47,77,0.08)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(140,47,77,0.15)_0%,_transparent_70%)] blur-3xl animate-floatOrb2" />
      <div className="absolute top-[65%] -right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(184,134,11,0.12)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(109,24,48,0.16)_0%,_transparent_70%)] blur-3xl animate-floatOrb3" />

      {/* --- Floating Golden Zari Particles & Star Dots (CIRCLES REMOVED) --- */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-floatGoldDust flex items-center justify-center pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.isStar ? (
            <span
              className="text-[#B8860B] dark:text-[#E5C583] font-serif select-none"
              style={{
                fontSize: `${p.size + 5}px`,
                filter: "drop-shadow(0 0 5px rgba(184,134,11,0.6))",
              }}
            >
              ✦
            </span>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: "radial-gradient(circle, #D4AF37 0%, #A87412 80%, #6D1830 100%)",
                boxShadow: "0 0 7px rgba(184, 134, 11, 0.65), 0 0 2px rgba(109, 24, 48, 0.4)",
              }}
            />
          )}
        </div>
      ))}

    </div>
  );
};

export default AnimatedRoyalBackdrop;
