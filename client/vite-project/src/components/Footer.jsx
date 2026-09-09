import React, { useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  Mail,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Welcome to the Ethnique Connoisseur Circle!");
    setNewsletterEmail("");
  };

  return (
    <footer className="mt-16 bg-[#FAF7F2] dark:bg-[#0E0B0F] border-t border-[#E8E2DC] dark:border-[#261D2B] transition-colors duration-400">

      {/* --- Section 1: Our Journey Timeline --- */}
      <section className="py-20 bg-[#F4EFEA]/70 dark:bg-[#130E17]/80 border-b border-[#E8E2DC] dark:border-[#261D2B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[#8C2F4D] dark:text-[#E5C583] text-xs font-semibold tracking-[3px] uppercase mb-3">
              <Sparkles size={14} className="text-[#C8A261]" />
              <span>Living Heritage</span>
              <Sparkles size={14} className="text-[#C8A261]" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2B2B2B] dark:text-[#FAF5EF]">
              Our Journey
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light max-w-lg mx-auto">
              The journey of Jayant Saree Center bringing curated ethnic wear & designer sarees to your wardrobe.
            </p>
          </div>

          <div className="relative">
            {/* Connected Golden Line for Desktop */}
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#D4B483]/30 via-[#C8A261] to-[#D4B483]/30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 relative">

              {/* Step 1 */}
              <div className="text-center group transition-all duration-400">
                <div className="relative w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#6D1830] to-[#8C2F4D] dark:from-[#2A1C2E] dark:to-[#45274A] border-4 border-white dark:border-[#130E17] shadow-lg flex items-center justify-center text-[#E5C583] font-serif font-bold text-base mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="relative z-10">2020</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1A141F]/70 border border-[#E8E2DC]/80 dark:border-[#2C2030] shadow-sm group-hover:shadow-md group-hover:border-[#D4B483] transition-all">
                  <h3 className="font-serif text-lg font-bold text-[#2B2B2B] dark:text-[#FAF5EF]">
                    The Retail Flagship
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-light leading-relaxed">
                    Jayant Saree Center established its retail landmark, trusted by thousands of families for bridal & festive drapes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group transition-all duration-400">
                <div className="relative w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#6D1830] to-[#8C2F4D] dark:from-[#2A1C2E] dark:to-[#45274A] border-4 border-white dark:border-[#130E17] shadow-lg flex items-center justify-center text-[#E5C583] font-serif font-bold text-base mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="relative z-10">2022</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1A141F]/70 border border-[#E8E2DC]/80 dark:border-[#2C2030] shadow-sm group-hover:shadow-md group-hover:border-[#D4B483] transition-all">
                  <h3 className="font-serif text-lg font-bold text-[#2B2B2B] dark:text-[#FAF5EF]">
                    Curated Range
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-light leading-relaxed">
                    Expanded into exclusive wedding collections, banarasi zari edits, and pre-stitched ready-to-drape sarees.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group transition-all duration-400">
                <div className="relative w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#6D1830] to-[#8C2F4D] dark:from-[#2A1C2E] dark:to-[#45274A] border-4 border-white dark:border-[#130E17] shadow-lg flex items-center justify-center text-[#E5C583] font-serif font-bold text-base mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="relative z-10">2024</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1A141F]/70 border border-[#E8E2DC]/80 dark:border-[#2C2030] shadow-sm group-hover:shadow-md group-hover:border-[#D4B483] transition-all">
                  <h3 className="font-serif text-lg font-bold text-[#2B2B2B] dark:text-[#FAF5EF]">
                    Ethnique Online
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-light leading-relaxed">
                    Launched Ethnique By Jayant, bringing our physical boutique's celebrated sarees directly to digital shoppers.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group transition-all duration-400">
                <div className="relative w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] dark:from-[#E5C583] dark:to-[#C8A261] border-4 border-white dark:border-[#130E17] shadow-xl flex items-center justify-center text-[#1E1220] font-serif font-bold text-base mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="relative z-10">Today</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1A141F]/70 border border-[#D4B483] dark:border-[#E5C583]/50 shadow-md group-hover:shadow-xl transition-all">
                  <h3 className="font-serif text-lg font-bold text-[#2B2B2B] dark:text-[#FAF5EF]">
                    Pan-India Community
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-light leading-relaxed">
                    Delivering curated designer ethnic sarees to women nationwide with insured express delivery and concierge care.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Trust & Heritage Pillars --- */}
      <section className="py-12 border-b border-[#E8E2DC] dark:border-[#261D2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#18121D]/60 border border-[#E8E2DC]/70 dark:border-[#281D2D]">
              <div className="p-3 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583]">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B] dark:text-[#FAF5EF]">
                  Pan-India Express
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  Complimentary & Insured
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#18121D]/60 border border-[#E8E2DC]/70 dark:border-[#281D2D]">
              <div className="p-3 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583]">
                <Award size={22} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B] dark:text-[#FAF5EF]">
                  Curated Ethnic Wear
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  Jayant Saree Center Legacy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#18121D]/60 border border-[#E8E2DC]/70 dark:border-[#281D2D]">
              <div className="p-3 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583]">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B] dark:text-[#FAF5EF]">
                  Fall & Pico Included
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  Ready-to-Drape Perfection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#18121D]/60 border border-[#E8E2DC]/70 dark:border-[#281D2D]">
              <div className="p-3 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B] dark:text-[#FAF5EF]">
                  Secure Checkout
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-light">
                  100% Insured Delivery
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Section 3: Main Footer Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Brand & Newsletter (Spans 2 cols) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif text-[#6D1830] dark:text-[#E5C583] tracking-wider font-bold mb-3">
              ETHNIQUE <span className="text-xs tracking-[4px] block font-sans uppercase font-light text-[#B8860B]">By Jayant</span>
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-sm mt-3">
              From the house of Jayant Saree Center, bringing exquisite ethnic wear and curated designer sarees tailored for every special celebration.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#8C2F4D] dark:text-[#E5C583] mb-2 flex items-center gap-1.5">
                <Mail size={14} />
                <span>Join the Connoisseurs Circle</span>
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-full text-xs bg-white dark:bg-[#1A141F] border border-[#E8E2DC] dark:border-[#2C2132] focus:outline-none focus:border-[#D4B483] dark:text-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#6D1830] hover:bg-[#8C2F4D] dark:bg-[#E5C583] dark:hover:bg-[#D4B483] text-white dark:text-black text-xs font-semibold tracking-wider uppercase transition shadow-md"
                >
                  Join
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6 text-gray-600 dark:text-gray-400">
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-full bg-white dark:bg-[#1A141F] border border-[#E8E2DC] dark:border-[#2C2132] hover:text-[#6D1830] dark:hover:text-[#E5C583] hover:scale-110 transition">
                <FaInstagram size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="p-2.5 rounded-full bg-white dark:bg-[#1A141F] border border-[#E8E2DC] dark:border-[#2C2132] hover:text-[#6D1830] dark:hover:text-[#E5C583] hover:scale-110 transition">
                <FaFacebookF size={16} />
              </a>
              <a href="#" aria-label="Pinterest" className="p-2.5 rounded-full bg-white dark:bg-[#1A141F] border border-[#E8E2DC] dark:border-[#2C2132] hover:text-[#6D1830] dark:hover:text-[#E5C583] hover:scale-110 transition">
                <FaPinterestP size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="p-2.5 rounded-full bg-white dark:bg-[#1A141F] border border-[#E8E2DC] dark:border-[#2C2132] hover:text-[#6D1830] dark:hover:text-[#E5C583] hover:scale-110 transition">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="uppercase tracking-[2.5px] text-xs font-bold mb-4 text-[#2B2B2B] dark:text-[#FAF5EF]">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/products" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">New Arrivals</Link></li>
              <li><Link to="/products?cat=cotton" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Pure Cotton Sarees</Link></li>
              <li><Link to="/products?cat=silk" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Designer Silk Edit</Link></li>
              <li><Link to="/products" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Chanderi & Festive</Link></li>
              <li><Link to="/reels" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Video Lookbook</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="uppercase tracking-[2.5px] text-xs font-bold mb-4 text-[#2B2B2B] dark:text-[#FAF5EF]">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Heritage Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Contact & Concierge</Link></li>
              <li><Link to="/shipping" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Insured Shipping & Store Policy</Link></li>
              <li><Link to="/loyalty" className="hover:text-[#6D1830] dark:hover:text-[#E5C583] transition">Privilege Rewards Club</Link></li>
            </ul>
          </div>

          {/* Atelier Contact Info */}
          <div>
            <h3 className="uppercase tracking-[2.5px] text-xs font-bold mb-4 text-[#2B2B2B] dark:text-[#FAF5EF]">
              Atelier
            </h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Boutique Inquiries</p>
              <p>support@ethniquebyjayant.com</p>
              <p>+91 98765 43210</p>
              <p className="pt-2 text-[11px] text-gray-500">
                Mon - Sat: 10:00 AM - 7:00 PM IST
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- Section 4: Bottom Copyright Bar --- */}
      <div className="border-t border-[#E8E2DC] dark:border-[#261D2B] py-6 px-4 text-center text-xs text-gray-500 dark:text-gray-400 font-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Ethnique By Jayant. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/shipping" className="hover:underline">Shipping</Link>
            <span>&bull;</span>
            <Link to="/returns" className="hover:underline">Returns</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:underline">Privacy & Terms</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;