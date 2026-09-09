import React, { useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Our concierge will connect with you within 4 hours.", {
        icon: "✨",
        duration: 4000,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "General Inquiry",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-400 pb-24">
      {/* 1. Hero Header */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Crown size={14} className="text-[#B8860B]" />
            <span>Private Client Liaison</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Bespoke Inquiries & Concierge
          </h1>

          <p className="mt-3.5 text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Whether you seek custom drape styling, bridal trousseau consultations, or order assistance, our dedicated atelier concierge is at your service.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Atelier Contacts (5 cols) */}
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
                  <p className="text-[11px] text-[var(--text-muted)]">Jayant Saree Center Concierge</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                Chat live with our saree consultants for real-time high-resolution drape videos, color matching, and custom blouse stitching.
              </p>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
              >
                <PhoneCall size={14} />
                <span>Start WhatsApp Conversation</span>
              </a>
            </div>

            {/* Atelier Info Cards */}
            <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-7 shadow-sm space-y-5">
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
                    Guaranteed reply within 4 business hours
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#D4B483]/20" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Concierge Hotline
                  </h4>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
                    +91 98765 43210 / 022 2847 9000
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-light">
                    Toll-free customer priority line
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#D4B483]/20" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Atelier Working Hours
                  </h4>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
                    Monday to Saturday: 10:00 AM – 7:00 PM IST
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-light">
                    Sunday: By private virtual appointment only
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#D4B483]/20" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                    Jayant Saree Center Flagship Store
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Jayant Saree Center, Main Market, Saree & Ethnic Wear Hub, India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bespoke Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-7 sm:p-9 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs text-[#8C2F4D] dark:text-[#E8C58D] font-semibold uppercase tracking-wider mb-1">
                  <Sparkles size={13} />
                  <span>Send a Message</span>
                </div>
                <h2 className="text-2xl font-serif font-medium text-[var(--text-primary)]">
                  Personal Consultation Form
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Fill out the details below and our Jayant Saree Center consultants will respond promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Radhika Sharma"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D] focus:ring-1 focus:ring-[#8C2F4D] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="radhika@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D] focus:ring-1 focus:ring-[#8C2F4D] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                      Mobile Number (with WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D] focus:ring-1 focus:ring-[#8C2F4D] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D] focus:ring-1 focus:ring-[#8C2F4D] transition"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bespoke Custom Drape">Saree Selection & Video Consultation</option>
                      <option value="Bridal Trousseau">Bridal & Festive Trousseau</option>
                      <option value="Order & Shipping Status">Order & Shipping Status</option>
                      <option value="Bulk Order">Wholesale & Wedding Party Bulk Orders</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                    Your Message / Specific Saree Requirements *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the drape, fabric, color palette, or occasion you have in mind..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D] focus:ring-1 focus:ring-[#8C2F4D] transition resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message to Concierge</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[var(--text-muted)]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Your privacy is protected. We never share contact details.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;