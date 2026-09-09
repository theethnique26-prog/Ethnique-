import React from "react";
import { Star, Quote, CheckCircle2, Sparkles } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Bangalore",
    occasion: "Festive Drape",
    short: "Soft and breathable all day long.",
    full: "The cotton is incredibly soft and breathable. It feels light in tropical weather and still looks regal even after long hours.",
    rating: 5,
  },
  {
    name: "Ananya Deshmukh",
    location: "Mumbai",
    occasion: "Daily Festive",
    short: "Minimal, classy & comfortable.",
    full: "Minimal, classy, and perfect for everyday elegance. I’ve already ordered another saree because the fabric quality is unmatched.",
    rating: 5,
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    occasion: "Temple Celebration",
    short: "Craftsmanship in every thread.",
    full: "You can really feel the exquisite craftsmanship in every thread. The saree drapes like a dream and earned me countless compliments.",
    rating: 5,
  },
  {
    name: "Radhika Sen",
    location: "Kolkata",
    occasion: "Festive Connoisseur",
    short: "Authentic Jayant Saree Center quality.",
    full: "Finding genuine pure cotton with rich borders online used to be rare. Ethnique by Jayant Saree Center has become my trusted boutique for authentic drapes.",
    rating: 5,
  },
];

const ReviewsSlider = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-[#F4EFEA]/60 to-transparent dark:via-[#140F18]/70 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 text-[#8C2F4D] dark:text-[#E5C583] text-xs font-semibold tracking-[3px] uppercase mb-3">
          <Sparkles size={14} className="text-[#C8A261]" />
          <span>Voices of Patrons</span>
          <Sparkles size={14} className="text-[#C8A261]" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2B2B2B] dark:text-[#FAF5EF]">
          What Our Customers Say
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light max-w-lg mx-auto">
          Cherished memories styled into every drape, shared by discerning women across the globe.
        </p>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="overflow-hidden relative py-4">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF7F2] dark:from-[#0E0B0F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF7F2] dark:from-[#0E0B0F] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 sm:gap-8 animate-scroll hover:[animation-play-state:paused] w-max">
          {[...reviews, ...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="
                w-[300px] sm:w-[360px]
                p-6 sm:p-7
                bg-white dark:bg-[#1A141E]
                rounded-3xl
                border border-[#E8E2DC] dark:border-[#2C2030]
                hover:border-[#D4B483] dark:hover:border-[#E5C583]/50
                shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
                hover:shadow-[0_20px_40px_rgba(109,24,48,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]
                hover:-translate-y-1.5
                transition-all duration-400 flex flex-col justify-between
              "
            >
              <div>
                {/* Top Row: Stars and Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#D4AF37]" />
                    ))}
                  </div>
                  <Quote size={24} className="text-[#D4B483]/40 dark:text-[#E5C583]/30" />
                </div>

                {/* Short Highlight */}
                <h4 className="font-serif text-lg font-semibold text-[#2B2B2B] dark:text-[#FAF5EF]">
                  “{review.short}”
                </h4>

                {/* Full Review Text */}
                <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  {review.full}
                </p>
              </div>

              {/* Bottom Row: Customer Details */}
              <div className="mt-6 pt-4 border-t border-[#F0EAE1] dark:border-[#261D2A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6D1830] dark:bg-[#2A1D30] text-[#E5C583] font-serif font-bold text-sm flex items-center justify-center border border-[#D4B483]/40">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-semibold text-[#2B2B2B] dark:text-[#FAF5EF]">
                        {review.name}
                      </p>
                      <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-500/20" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {review.location} &bull; <span className="text-[#8C2F4D] dark:text-[#E5C583]">{review.occasion}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;