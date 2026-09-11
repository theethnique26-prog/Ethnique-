import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  PhoneCall,
  Crown,
  Send,
  CheckCircle2,
  Store,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const CONCIERGE_WHATSAPP = "917387020612";
const CONCIERGE_DISPLAY_PHONE = "+91 73870 20612";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Saree Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      toast.error("Please provide your name and contact info.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our concierge team.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-400 pb-24">
      {/* 1. Hero Header */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Crown size={14} className="text-[#B8860B]" />
            <span>Private Client Concierge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Contact &amp; Personal Concierge
          </h1>

          <p className="mt-3.5 text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Connect directly with our master saree consultants at Jayant Saree Center &amp; Ethnique for custom recommendations, drape inquiries, and assistance.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Direct Concierge & Atelier Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Quick Connect Card */}
            <div className="rounded-3xl p-6 sm:p-7 border border-[#D4B483]/40 bg-gradient-to-br from-[#FAF5ED] via-[#F4E8D7] to-[#ECE0CD] dark:from-[#241320] dark:via-[#2F172B] dark:to-[#1A0C17] shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2 rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <MessageCircle size={20} />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
                    Direct WhatsApp Concierge
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Live Saree Consultants</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                Need immediate styling advice or high-resolution drape videos? Connect with us on WhatsApp for rapid assistance.
              </p>

              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <PhoneCall size={12} />
                <span>{CONCIERGE_DISPLAY_PHONE}</span>
              </div>

              <a
                href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(
                  "Hello Ethnique Concierge! I would like to inquire about sarees, collections, and custom orders."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Start WhatsApp Conversation</span>
              </a>
            </div>

            {/* Atelier Info Cards (Without working hours) */}
            <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Concierge Hotline
                  </h4>
                  <a
                    href={`tel:${CONCIERGE_DISPLAY_PHONE.replace(/\s+/g, "")}`}
                    className="text-sm font-medium text-[var(--text-primary)] hover:text-[#8C2F4D] dark:hover:text-[#E8C58D] transition mt-0.5 block font-serif"
                  >
                    {CONCIERGE_DISPLAY_PHONE}
                  </a>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-light">
                    Direct boutique phone &amp; WhatsApp support
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#D4B483]/20" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Email Liaison
                  </h4>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
                    support@ethniquebyjayant.com
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-light">
                    Guaranteed response from our styling concierge
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#D4B483]/20" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Store size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Jayant Saree Center Flagship Store
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Jayant Saree Center, Main Saree Market &amp; Bridal Wear Hub, India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message to Concierge */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#D4B483]/40 bg-[var(--card-bg)] p-6 sm:p-9 shadow-xl relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-12 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
                    Message Received
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Ethnique By Jayant Saree Center. Our concierge team has received your message and will get in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", subject: "Saree Inquiry", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#6D1830] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[2px] uppercase text-[#8C2F4D] dark:text-[#E8C58D] mb-2">
                      <Sparkles size={13} />
                      <span>Direct Atelier Message</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
                      How Can Our Stylists Assist You?
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-light">
                      Submit your inquiry regarding drapes, wedding curations, or order assistance below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[#D4B483]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[#D4B483]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[#D4B483]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Topic of Inquiry
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[#D4B483]"
                        >
                          <option value="Saree Inquiry">Saree Recommendation</option>
                          <option value="Bridal & Wedding Trousseau">Bridal &amp; Wedding Trousseau</option>
                          <option value="Pure Banarasi & Kanjivaram">Banarasi &amp; Silk Inquiry</option>
                          <option value="Order & Delivery Status">Order &amp; Delivery Inquiry</option>
                          <option value="Bulk & Festive Gifting">Bulk &amp; Festive Curation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Your Message / Questions
                      </label>
                      <textarea
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about the sarees or drape styles you are interested in..."
                        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[#D4B483] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>{loading ? "Sending..." : "Submit Inquiry to Concierge"}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;