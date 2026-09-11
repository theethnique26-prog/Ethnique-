import React, { useState, useEffect } from "react";
import "./carousel.css";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Play, Award, CheckCircle2 } from "lucide-react";

import img1 from "../assets/model1.png";
import img2 from "../assets/model2.png";
import img3 from "../assets/model3.png";
import img4 from "../assets/model4.png";
import img5 from "../assets/model5.png";
import img6 from "../assets/model6.png";

const leftImages = [img1, img2];
const centerImages = [img3, img4];
const rightImages = [img5, img6];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDrape, setSelectedDrape] = useState("all"); // 'all', 'banarasi', 'signature', 'mulmul'
  const [activeMobileCard, setActiveMobileCard] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 2);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("featured-sarees")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-8 lg:pb-16 transition-colors duration-400">

      {/* Layered Golden Amber & Velvet Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] lg:w-[1000px] h-[550px] bg-[radial-gradient(ellipse,_rgba(212,180,131,0.22)_0%,_rgba(109,24,48,0.08)_45%,_transparent_75%)] dark:bg-[radial-gradient(ellipse,_rgba(229,197,131,0.18)_0%,_rgba(140,47,77,0.12)_45%,_transparent_75%)] blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Top Editorial Header (Compact & Regal to avoid pushing cards down) --- */}
        <div className="text-center max-w-3xl mx-auto mb-6 lg:mb-8">

          {/* Royal Atelier Seal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#D4B483]/60 bg-[#FAF6F0]/90 dark:bg-[#18101C]/90 backdrop-blur-md text-[#8C2F4D] dark:text-[#E5C583] text-[11px] font-semibold tracking-[3px] uppercase mb-3 shadow-[0_2px_10px_rgba(212,180,131,0.15)]">
            <span className="text-[#C8A261]">✦</span>
            <span>By Jayant Saree Center &bull; Curated Ethnic Wear</span>
            <span className="text-[#C8A261]">✦</span>
          </div>

          {/* Grand Haute Couture Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2B2523] dark:text-[#F7F2EC] leading-[1.12] tracking-tight">
            A Symphony of{" "}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#6D1830] via-[#942644] to-[#B8860B] dark:from-[#F3D39B] dark:via-[#E5C583] dark:to-[#D4AF37]">
              Heritage
            </span>{" "}
            & Grace
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Curated designer sarees, festive silks, and elegant cotton drapes from the trusted house of Jayant Saree Center.
          </p>

          {/* Interactive Fabric & Drape Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {[
              { id: "all", label: "✨ The Full Collection" },
              { id: "banarasi", label: "👑 Banarasi Saree" },
              { id: "signature", label: "🌸 Signature Sarees" },
              { id: "mulmul", label: "🌿 Breathable Mulmul" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDrape(tab.id)}
                className={`
                  px-3.5 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer
                  ${
                    selectedDrape === tab.id
                      ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md scale-[1.03]"
                      : "bg-white/80 dark:bg-[#1A111E]/80 text-gray-700 dark:text-gray-300 border border-[#E8DFD3] dark:border-[#2C1F32] hover:border-[#D4B483]"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* --- ROYAL JHAROKHA (PALACE ARCHWAY) 3-CARDS GALLERY --- */}
        {/* Visible on Desktop & Tablet */}
        <div className="hidden md:flex justify-center items-end gap-3 md:gap-4 lg:gap-8 xl:gap-10 pb-4 pt-1">

          {/* Left Archway: Clickable Banarasi Saree */}
          <Link
            to="/products?search=banarasi"
            title="Explore Authentic Banarasi Sarees"
            className={`
              jharokha-frame jharokha-arch left-arch block cursor-pointer group/banarasi
              w-[210px] md:w-[220px] lg:w-[280px] xl:w-[320px]
              h-[350px] md:h-[390px] lg:h-[450px] xl:h-[490px]
              border-2 transition-all duration-500
              ${
                selectedDrape === "banarasi" || selectedDrape === "all"
                  ? "border-[#D4B483] dark:border-[#E5C583] opacity-100 scale-100 shadow-xl"
                  : "border-[#D4B483]/30 dark:border-[#E5C583]/20 opacity-60 scale-95"
              }
            `}
          >
            <div className="image-container jharokha-arch">
              {leftImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Banarasi Saree Drape Model"
                  className={`fade-image ${index === currentIndex ? "active" : ""}`}
                />
              ))}

              {/* Architectural Arch Line Overlay */}
              <div className="absolute inset-0 jharokha-arch pointer-events-none border border-white/30 dark:border-[#E5C583]/20 m-2" />

              {/* Royal Badge - Clickable to Banarasi Sarees */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-black/65 backdrop-blur-md border border-[#D4B483]/70 text-[#FAF6F0] text-[10px] font-semibold tracking-[2px] uppercase px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap group-hover/banarasi:bg-[#6D1830] group-hover/banarasi:border-[#E5C583] transition-all">
                👑 Banarasi Saree
              </div>

              {/* Bottom Subtle Gradient */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4">
                <p className="text-white text-xs font-serif font-medium tracking-wide">
                  Pure Zari Weave &bull; Heritage Red
                </p>
                <span className="text-[10px] text-[#E5C583] tracking-wider uppercase font-semibold mt-0.5 group-hover/banarasi:underline">
                  Shop Banarasi &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Center Archway: Masterpiece Signature (Taller with Crown Styling) */}
          <div
            className={`
              jharokha-frame jharokha-arch-center center-arch
              w-[240px] md:w-[260px] lg:w-[330px] xl:w-[370px]
              h-[400px] md:h-[450px] lg:h-[510px] xl:h-[570px]
              border-2 transition-all duration-500 z-10
              ${
                selectedDrape === "signature" || selectedDrape === "all"
                  ? "border-[#D4B483] dark:border-[#E5C583] shadow-[0_25px_60px_rgba(109,24,48,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] opacity-100 scale-100"
                  : "border-[#D4B483]/40 dark:border-[#E5C583]/30 opacity-70 scale-95"
              }
            `}
          >
            <div className="image-container jharokha-arch-center">
              {centerImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Ethnique Signature Model"
                  className={`fade-image ${index === currentIndex ? "active" : ""}`}
                />
              ))}

              {/* Architectural Arch Line Overlay */}
              <div className="absolute inset-0 jharokha-arch-center pointer-events-none border-2 border-[#D4B483]/40 dark:border-[#E5C583]/30 m-2.5" />

              {/* Grand Center Crown Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#6D1830]/95 to-[#8C2F4D]/95 dark:from-[#1D1222]/95 dark:to-[#311838]/95 backdrop-blur-md border border-[#D4B483] text-[#FAF6F0] text-[11px] font-bold tracking-[2.5px] uppercase px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles size={12} className="text-[#E5C583]" />
                <span>The Atelier Signature</span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-5">
                <span className="text-[#E5C583] text-[10px] uppercase tracking-widest font-semibold">Exclusive Saree Edit</span>
                <p className="text-white text-sm font-serif font-semibold">
                  Curated Chanderi &amp; Festive Silk
                </p>
              </div>
            </div>
          </div>

          {/* Right Archway: Mulmul Cotton */}
          <div
            className={`
              jharokha-frame jharokha-arch right-arch
              w-[210px] md:w-[220px] lg:w-[280px] xl:w-[320px]
              h-[350px] md:h-[390px] lg:h-[450px] xl:h-[490px]
              border-2 transition-all duration-500
              ${
                selectedDrape === "mulmul" || selectedDrape === "all"
                  ? "border-[#D4B483] dark:border-[#E5C583] opacity-100 scale-100"
                  : "border-[#D4B483]/30 dark:border-[#E5C583]/20 opacity-60 scale-95"
              }
            `}
          >
            <div className="image-container jharokha-arch">
              {rightImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Mulmul Cotton Drape"
                  className={`fade-image ${index === currentIndex ? "active" : ""}`}
                />
              ))}

              {/* Architectural Arch Line Overlay */}
              <div className="absolute inset-0 jharokha-arch pointer-events-none border border-white/30 dark:border-[#E5C583]/20 m-2" />

              {/* Royal Badge */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-black/55 backdrop-blur-md border border-[#D4B483]/50 text-[#F7F2EC] text-[10px] font-semibold tracking-[2px] uppercase px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap">
                Mulmul Cotton
              </div>

              {/* Bottom Subtle Gradient */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                <p className="text-white text-xs font-serif font-medium tracking-wide">
                  Breathable Weave &bull; Emerald Drape
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* --- MOBILE VIEW: Single Jharokha Archway with Look Switcher --- */}
        <div className="block md:hidden py-3">
          <div className="relative mx-auto w-[88vw] max-w-[320px] h-[400px] sm:h-[460px] jharokha-frame jharokha-arch border-2 border-[#D4B483] dark:border-[#E5C583] shadow-2xl">
            <div className="image-container jharokha-arch">
              {(activeMobileCard === 0
                ? leftImages
                : activeMobileCard === 1
                ? centerImages
                : rightImages
              ).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Mobile Hero Look"
                  className={`fade-image ${index === currentIndex ? "active" : ""}`}
                />
              ))}

              <Link
                to={activeMobileCard === 0 ? "/products?search=banarasi" : "/products"}
                className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md border border-[#D4B483] text-[#FAF6F0] text-[10px] font-semibold tracking-[2px] uppercase px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap"
              >
                {activeMobileCard === 0 ? "👑 Banarasi Saree" : activeMobileCard === 1 ? "Signature Atelier" : "Mulmul Cotton"}
              </Link>

              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <p className="text-white text-xs font-serif font-medium">
                  {activeMobileCard === 0 ? "Pure Zari Weave • Tap to Shop" : activeMobileCard === 1 ? "Designer Festive Drape" : "Breathable Everyday Comfort"}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {["Banarasi Saree", "Signature", "Mulmul"].map((title, i) => (
              <button
                key={i}
                onClick={() => setActiveMobileCard(i)}
                className={`
                  px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-300
                  ${
                    activeMobileCard === i
                      ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md scale-105"
                      : "bg-[#EFE6DA] dark:bg-[#201426] text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Crossfade Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-500
                ${
                  currentIndex === idx
                    ? "w-8 bg-[#6D1830] dark:bg-[#E5C583]"
                    : "w-2 bg-[#D4B483]/40 dark:bg-gray-600"
                }
              `}
            />
          ))}
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={scrollToProducts}
            className="
              w-full sm:w-auto px-8 py-3.5
              rounded-full
              text-white font-medium text-xs sm:text-sm tracking-wider uppercase
              bg-gradient-to-r from-[#8C2F4D] via-[#6D1830] to-[#541224]
              hover:from-[#9E3557] hover:to-[#7E1D39]
              border border-[#D4B483]/50
              shadow-[0_4px_25px_rgba(109,24,48,0.3)]
              hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            <span>Explore Collection</span>
            <ArrowRight size={15} />
          </button>

          <Link
            to="/reels"
            className="
              w-full sm:w-auto px-7 py-3.5
              rounded-full
              border border-[#D4B483] dark:border-[#E5C583]/60
              bg-white/85 dark:bg-[#18101C]/85 backdrop-blur-sm
              text-[#6D1830] dark:text-[#E5C583]
              hover:bg-[#FAF6F0] dark:hover:bg-[#251729]
              font-medium text-xs sm:text-sm tracking-wider uppercase
              shadow-sm hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            <Play size={13} className="fill-current" />
            <span>Watch Draping Reels</span>
          </Link>
        </div>

        {/* --- PROOF & HERITAGE ACCREDITATION BAR --- */}
        <div className="mt-10 pt-6 border-t border-[#E8DFD3]/80 dark:border-[#2C1F32]/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <p className="font-serif text-lg font-bold text-[#6D1830] dark:text-[#E5C583]">5,000+</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Patrons Draped Worldwide</p>
            </div>
            <div className="p-2">
              <p className="font-serif text-lg font-bold text-[#6D1830] dark:text-[#E5C583]">100% Inspected</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Curated Designer Sarees</p>
            </div>
            <div className="p-2">
              <p className="font-serif text-lg font-bold text-[#6D1830] dark:text-[#E5C583]">Jayant Saree Center</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Retail Trust &amp; Heritage</p>
            </div>
            <div className="p-2">
              <p className="font-serif text-lg font-bold text-[#6D1830] dark:text-[#E5C583]">Complimentary</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Pan-India Express Shipping</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Carousel;