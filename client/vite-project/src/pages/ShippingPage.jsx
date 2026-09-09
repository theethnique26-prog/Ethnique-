import React, { useState } from "react";
import {
  Truck,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  Mail,
  ArrowRight,
  Award,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

const SHIPPING_FAQS = [
  {
    q: "How long does delivery take across India?",
    a: "All orders are dispatched from our Jayant Saree Center boutique within 24 to 48 hours. Express transit takes 3 to 5 business days for major metropolitan cities and 5 to 7 business days for regional destinations.",
  },
  {
    q: "Are shipping and insurance charges included?",
    a: "Yes! We provide 100% complimentary express shipping on all prepaid orders across India. Every parcel is insured against in-transit damage or loss at zero extra charge to you.",
  },
  {
    q: "What is your store's No-Returns policy?",
    a: "At Ethnique by Jayant Saree Center, all our sarees are curated festive, bridal, and designer ethnic wear that arrive steam-pressed with pre-stitched fall and pico. To guarantee highest standards of hygiene and pristine product quality for every shopper, we do not accept returns or exchanges once delivered.",
  },
  {
    q: "What if my parcel is damaged during transit?",
    a: "In the rare event of transit damage or package tampering, please photograph the parcel and contact our boutique concierge within 24 hours at support@ethniquebyjayant.com or via WhatsApp at +91 98765 43210. Our team will resolve it with top priority.",
  },
];

const ShippingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-400 pb-24">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Store size={14} className="text-[#B8860B]" />
            <span>Jayant Saree Center • Insured Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Insured Shipping & Store Policy
          </h1>

          <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Every designer saree from Ethnique by Jayant Saree Center is prepared with utmost care, packed in luxury keepsake boxes, and hand-delivered directly to your doorstep with full transit insurance.
          </p>
        </div>
      </section>

      {/* 2. Four Pillars of White-Glove Logistics */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 shadow-sm hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <Truck size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Pan-India Express
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Fast 3–5 business day delivery via premium air express couriers (BlueDart, Delhivery) across all PIN codes in India.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 shadow-sm hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              100% In-Transit Insurance
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Every parcel is fully insured against theft, loss, or transit damage from our boutique doors right up to yours.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 shadow-sm hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <Package size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Luxury Keepsake Box
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Encased in rigid archival saree boxes wrapped in moisture-resistant butter paper and herbal lavender protection.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 shadow-sm hover:border-[#8C2F4D] hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center mb-4">
              <Award size={22} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Fall & Pico Pre-Stitched
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Ready-to-drape out of the box. Complimentary fall, pico edging, and quality inspection seals included on every saree.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Quality & Non-Returnable Policy */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl border border-[#D4B483]/40 bg-gradient-to-br from-[#FAF5ED] via-[#F5EADB] to-[#F1E0CD] dark:from-[#21121E] dark:via-[#2A1526] dark:to-[#1A0C17] p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D1830] text-[#E8C58D] text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Jayant Saree Center Quality Guarantee</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E8C58D]">
              Our No-Returns & Exchange Policy
            </h2>

            <p className="text-sm sm:text-base text-[#3A2A2F] dark:text-[#EADFD5] leading-relaxed font-light">
              At Ethnique by Jayant Saree Center, each saree is an exclusive designer piece, carefully steam-pressed, inspected, and pre-finished before dispatch. To guarantee pristine hygiene and quality for every customer, our sarees are strictly non-returnable and non-exchangeable once delivered.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#3A2A2F] dark:text-[#EADFD5]">
                <CheckCircle2 size={18} className="text-[#8C2F4D] dark:text-[#E8C58D] mt-0.5 flex-shrink-0" />
                <span><strong>Pristine Product Promise:</strong> We never re-circulate pre-worn or returned garments. Every client receives brand-new, untampered drapes with intact pre-stitched fall and pico.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#3A2A2F] dark:text-[#EADFD5]">
                <CheckCircle2 size={18} className="text-[#8C2F4D] dark:text-[#E8C58D] mt-0.5 flex-shrink-0" />
                <span><strong>Triple-Point Quality Inspection:</strong> Every drape is thoroughly inspected for fabric perfection, embroidery, zari finish, and clean stitching before entering our luxury packaging.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#3A2A2F] dark:text-[#EADFD5]">
                <CheckCircle2 size={18} className="text-[#8C2F4D] dark:text-[#E8C58D] mt-0.5 flex-shrink-0" />
                <span><strong>Transit Discrepancy Assistance:</strong> In the rare event of damage during courier transit, contact our concierge within 24 hours with an unboxing video for instant priority resolution.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shipping Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-xl sm:text-2xl font-serif text-[var(--text-primary)] font-semibold mb-6 text-center">
          Delivery Timelines & Charges
        </h2>

        <div className="rounded-2xl border border-[#D4B483]/30 overflow-hidden bg-[var(--card-bg)] shadow-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4 sm:p-5">Order Type</th>
                <th className="p-4 sm:p-5">Transit Time</th>
                <th className="p-4 sm:p-5">Shipping Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4B483]/15 text-[var(--text-primary)]">
              <tr className="hover:bg-[#D4B483]/5 transition">
                <td className="p-4 sm:p-5 font-medium">All Prepaid Orders (UPI, Cards, NetBanking)</td>
                <td className="p-4 sm:p-5 text-[var(--text-muted)]">3–5 Business Days</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-600">FREE</td>
              </tr>
              <tr className="hover:bg-[#D4B483]/5 transition">
                <td className="p-4 sm:p-5 font-medium">VIP Express Air (Glam Clan Members)</td>
                <td className="p-4 sm:p-5 text-[var(--text-muted)]">2 Business Days</td>
                <td className="p-4 sm:p-5 font-bold text-[#B8860B]">Complimentary VIP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-8">
          <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
            Got Questions?
          </span>
          <h2 className="text-2xl font-serif text-[var(--text-primary)] font-medium mt-1">
            Shipping & Delivery FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {SHIPPING_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-medium text-[var(--text-primary)] hover:text-[#8C2F4D] dark:hover:text-[#E8C58D]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[#D4B483]/15">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Concierge Helpline Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-[#6D1830] via-[#8C2F4D] to-[#6D1830] text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-serif font-medium">
              Need Dispatch Assistance?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto">
              Our boutique concierge at Jayant Saree Center is available Monday through Saturday to answer any delivery inquiries.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md inline-flex items-center gap-1.5"
              >
                <PhoneCall size={13} />
                <span>WhatsApp Concierge</span>
              </a>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs tracking-wider uppercase transition inline-flex items-center gap-1.5"
              >
                <Mail size={13} />
                <span>Write to Boutique</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPage;