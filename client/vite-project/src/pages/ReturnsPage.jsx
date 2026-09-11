import React from "react";
import { ShieldCheck, Truck, MessageCircle, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-6">
          <Store size={14} className="text-[#B8860B]" />
          <span>Jayant Saree Center • Store Policy</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#6D1830] dark:text-[#E8C58D] mb-4">
          No Returns & Exchanges Policy
        </h1>

        <div className="rounded-3xl border border-[#D4B483]/35 bg-[var(--card-bg)] p-8 sm:p-10 shadow-xl text-left space-y-5 my-8">
          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-light">
            At <strong>Ethnique by Jayant Saree Center</strong>, each saree is carefully selected, steam-pressed, and thoroughly inspected by our master craftsmen before dispatch.
          </p>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
            To guarantee pristine hygiene and assure every client that they receive a brand-new, unworn drape, <strong>our sarees are strictly non-returnable and non-exchangeable once safely delivered</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-[#D4B483]/10 border border-[#D4B483]/30 space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#8C2F4D] dark:text-[#E8C58D] flex items-center gap-1.5">
              <ShieldCheck size={16} /> 100% Pre-Dispatch Quality Guarantee
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every drape undergoes a triple-point inspection for fabric quality, zari finishing, and clean stitching before packaging in rigid luxury keepsake boxes with tamper-evident seals.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/shipping"
              className="px-6 py-3 rounded-full bg-[#6D1830] hover:bg-[#8C2F4D] text-white text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 shadow-md"
            >
              <Truck size={14} />
              <span>View Shipping Policy</span>
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-[#D4B483]/60 hover:bg-[#D4B483]/15 text-[var(--text-primary)] text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
            >
              <MessageCircle size={14} />
              <span>Connect with Boutique</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;