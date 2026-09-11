import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  ArrowRight,
  Crown,
  Store,
  ShoppingBag,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "../services/apiConfig";

const AboutPage = () => {
  const [heritage, setHeritage] = useState({
    title: "Jayant Saree Center & Ethnique",
    subtitle: "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration.",
    story: "Founded as Jayant Saree Center, our journey began with a simple yet enduring promise: to offer women the most exquisite ethnic wear, bridal drapes, and festive sarees under one roof with uncompromised quality and heartfelt personal service.",
    philosophy: "Over the years, our brick-and-mortar boutique earned the trust of thousands of families for weddings, festivals, and milestone occasions. To take this legacy forward into the modern era, we created Ethnique By Jayant — our contemporary digital destination delivering our finest curated sarees across India.",
    foundingYear: "1978",
  });

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const res = await fetch(`${API_BASE}/homepage/heritage`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.heritage) {
            setHeritage((prev) => ({ ...prev, ...data.heritage }));
          }
        }
      } catch (err) {
        console.log("Using default heritage:", err);
      }
    };
    fetchHeritage();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-400 pb-28">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Store size={14} className="text-[#B8860B]" />
            <span>From The House of Jayant Saree Center (Est. {heritage.foundingYear || "1978"})</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Our Heritage & Story
          </h1>

          <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            {heritage.subtitle || "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration."}
          </p>
        </div>
      </section>

      {/* 2. Editorial Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4B483]/50 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c"
              alt="Ethnique by Jayant Saree Center"
              className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <p className="text-xs text-white/95 font-serif italic">
                "Draping generations in grace — bringing the signature Jayant Saree Center collection to your doorstep."
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-[#B8860B] uppercase tracking-widest font-bold">
              Our Retail Roots
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E8C58D]">
              {heritage.title || "The Jayant Saree Center Legacy"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-light">
              {heritage.story}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-light">
              {heritage.philosophy}
            </p>

            <div className="pt-3 grid grid-cols-3 gap-4 text-center border-t border-[#D4B483]/20 pt-4">
              <div>
                <span className="block text-2xl font-serif font-bold text-[#8C2F4D] dark:text-[#E8C58D]">10,000+</span>
                <span className="text-[11px] text-[var(--text-muted)]">Happy Customers</span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#8C2F4D] dark:text-[#E8C58D]">100%</span>
                <span className="text-[11px] text-[var(--text-muted)]">Quality Inspected</span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#8C2F4D] dark:text-[#E8C58D]">Handloom</span>
                <span className="text-[11px] text-[var(--text-muted)]">Artisanal Weaves</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What Sets Jayant Saree Center & Ethnique Apart */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
            Why Shop With Us
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[var(--text-primary)] font-medium mt-1">
            The Ethnique Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-7 hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <Crown size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Bridal & Wedding Edits
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-light">
              Spectacular zari drapes, rich silk palettes, and royal bridal sarees curated personally for brides, bridesmaids, and festive celebrations.
            </p>
          </div>

          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-7 hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <ShoppingBag size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Everyday & Festive Elegance
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-light">
              Comfortable cotton drapes, lightweight chiffons, and trending festive designs carefully selected for effortless everyday wear and special dinners.
            </p>
          </div>

          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-7 hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Artisanal Handloom Quality
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-light">
              Every saree arrives steam-pressed, hand-inspected by master artisans, and carefully packed, ready for you to drape right out of the box.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-[#6D1830] via-[#8C2F4D] to-[#6D1830] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8C58D] text-[11px] font-semibold uppercase tracking-wider">
              <Heart size={13} />
              <span>Jayant Saree Center Promise</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-medium">
              Explore Our Saree Collection
            </h3>

            <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
              Discover curated ethnic wear and wedding drapes designed to make you stand out at every celebration.
            </p>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E8C58D] to-[#D4B483] text-[#6D1830] font-bold text-xs uppercase tracking-widest hover:brightness-105 transition shadow-lg"
              >
                <span>Shop All Sarees</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;