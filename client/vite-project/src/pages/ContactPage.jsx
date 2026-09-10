import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
  Crown,
  Video,
  Calendar as CalendarIcon,
  CalendarCheck2,
  Share2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const CONCIERGE_WHATSAPP = "917387020612";
const CONCIERGE_DISPLAY_PHONE = "+91 73870 20612";

const TIME_SLOTS = [
  "11:00 AM",
  "01:30 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

const CONSULTATION_FOCUSES = [
  "Bridal & Wedding Trousseau",
  "Pure Kanjeevaram & Banarasi Silk",
  "Ready-to-Wear Pre-Stitched Drapes",
  "Custom Blouse Stitching & Color Match",
  "Wholesale & Festive Bulk Curation",
];

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const ContactPage = () => {
  const [sessionType, setSessionType] = useState("Virtual Video Drape");
  const [consultationFocus, setConsultationFocus] = useState("Bridal & Wedding Trousseau");
  const [date, setDate] = useState(getTodayDateString());
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || `${cleanPhone}@ethnique.client`,
          clientPhone: clientPhone.trim(),
          sessionType,
          consultationFocus,
          date,
          timeSlot,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.appointment) {
        setConfirmedBooking({
          ...data.appointment,
          googleCalendarUrl: data.googleCalendarUrl,
        });
        toast.success("Luxury consultation reserved successfully! ✨", {
          icon: "👑",
          duration: 5000,
        });
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      toast.error("Server error while reserving appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setNotes("");
    setDate(getTodayDateString());
    setTimeSlot(TIME_SLOTS[0]);
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
            VIP Consultation & Live Saree Drapes
          </h1>

          <p className="mt-3.5 text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Experience our master drapes via 1-on-1 private HD video or reserve a VIP fitting suite at Jayant Saree Center flagship atelier.
          </p>
        </div>
      </section>

      {/* 2. Main Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Concierge & Atelier Essentials (5 cols) */}
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
                  <p className="text-[11px] text-[var(--text-muted)]">Ethnique Boutique Concierge</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                Need instant assistance? Chat live with our saree consultants for drape videos, color matching, and custom queries.
              </p>

              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <PhoneCall size={12} />
                <span>{CONCIERGE_DISPLAY_PHONE}</span>
              </div>

              <a
                href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(
                  "Hello Ethnique Concierge! I would like to inquire about sarees, custom styling, and consultations."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <PhoneCall size={14} />
                <span>Start WhatsApp Conversation</span>
              </a>
            </div>

            {/* Atelier Info Cards */}
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
                    Direct customer priority & WhatsApp line
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
                    Guaranteed reply within 4 business hours
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
                    Sunday: Private virtual appointments only
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

          {/* Right Column: VIP Consultation & Drape Scheduler (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#D4B483]/40 bg-[var(--card-bg)] p-6 sm:p-9 shadow-xl relative overflow-hidden">
              {confirmedBooking ? (
                /* Booking Success Royal View */
                <div className="text-center py-6 sm:py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6D1830] to-[#8C2F4D] text-[#E8C58D] flex items-center justify-center mx-auto shadow-lg border-2 border-[#D4B483]">
                    <CalendarCheck2 size={32} />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                      <CheckCircle2 size={13} />
                      <span>Appointment Confirmed</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
                      Your VIP Consultation is Reserved!
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-md mx-auto">
                      Thank you, <span className="font-semibold text-[var(--text-primary)]">{confirmedBooking.clientName}</span>. Our master saree consultant is preparing for your session.
                    </p>
                  </div>

                  {/* Booking Receipt Card */}
                  <div className="rounded-2xl border border-[#D4B483]/40 bg-[#D4B483]/10 p-5 max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#D4B483]/20">
                      <span className="text-[var(--text-muted)]">Booking Reference:</span>
                      <span className="font-mono font-bold text-[#8C2F4D] dark:text-[#E8C58D]">
                        {confirmedBooking.bookingRef}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)]">Session Format:</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {confirmedBooking.sessionType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)]">Scheduled Date:</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {confirmedBooking.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)]">Time Slot:</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {confirmedBooking.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)]">Consultation Focus:</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {confirmedBooking.consultationFocus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <a
                      href={
                        confirmedBooking.googleCalendarUrl ||
                        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          `👑 VIP Saree Consultation: ${confirmedBooking.clientName} (${confirmedBooking.bookingRef})`
                        )}&details=${encodeURIComponent(
                          `Ethnique VIP Saree Consultation\nRef: ${confirmedBooking.bookingRef}\nClient: ${confirmedBooking.clientName} (+91 ${confirmedBooking.clientPhone})\nFocus: ${confirmedBooking.consultationFocus}\nNotes: "${confirmedBooking.notes || "None"}"\nConcierge: +91 73870 20612`
                        )}&location=${encodeURIComponent(
                          confirmedBooking.sessionType?.includes("Store")
                            ? "Jayant Saree Center Flagship Store, Main Market, India"
                            : "WhatsApp Video Call (+91 73870 20612)"
                        )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl bg-[#6D1830] hover:bg-[#8C2F4D] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarIcon size={15} />
                      <span>Block in Google Calendar</span>
                    </a>

                    <a
                      href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(
                        `Hello Ethnique Concierge! I have reserved a VIP Consultation (${confirmedBooking.bookingRef}) for ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. Looking forward to our session!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>Confirm via WhatsApp Concierge</span>
                    </a>

                    <button
                      onClick={handleResetForm}
                      className="px-6 py-3 rounded-xl border border-[#D4B483]/40 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-[var(--text-primary)] transition cursor-pointer"
                    >
                      Book Another Session
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form View */
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-1.5 text-xs text-[#8C2F4D] dark:text-[#E8C58D] font-semibold uppercase tracking-wider mb-1">
                      <Sparkles size={13} />
                      <span>Bespoke Appointment Scheduler</span>
                    </div>
                    <h2 className="text-2xl font-serif font-medium text-[var(--text-primary)]">
                      Reserve Your Private Saree Drape Session
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Schedule a 1-on-1 private video drape session or in-store styling appointment with our master consultants.
                    </p>
                  </div>

                  <form onSubmit={handleBookAppointment} className="space-y-5">
                    {/* Session Type Switcher */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                        1. Select Experience Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSessionType("Virtual Video Drape")}
                          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                            sessionType === "Virtual Video Drape"
                              ? "border-[#8C2F4D] bg-[#8C2F4D]/10 dark:border-[#E8C58D] dark:bg-[#E8C58D]/10 shadow-sm"
                              : "border-[#D4B483]/30 bg-[var(--bg-primary)] hover:border-[#D4B483]"
                          }`}
                        >
                          <div className={`p-2 rounded-xl mt-0.5 ${sessionType === "Virtual Video Drape" ? "bg-[#8C2F4D] text-white dark:bg-[#E8C58D] dark:text-black" : "bg-[#D4B483]/20 text-[var(--text-primary)]"}`}>
                            <Video size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[var(--text-primary)]">
                              Virtual HD Video Drape
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                              Live video drape demonstration on WhatsApp/Meet from comfort of home.
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSessionType("In-Store Private Styling")}
                          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                            sessionType === "In-Store Private Styling"
                              ? "border-[#8C2F4D] bg-[#8C2F4D]/10 dark:border-[#E8C58D] dark:bg-[#E8C58D]/10 shadow-sm"
                              : "border-[#D4B483]/30 bg-[var(--bg-primary)] hover:border-[#D4B483]"
                          }`}
                        >
                          <div className={`p-2 rounded-xl mt-0.5 ${sessionType === "In-Store Private Styling" ? "bg-[#8C2F4D] text-white dark:bg-[#E8C58D] dark:text-black" : "bg-[#D4B483]/20 text-[var(--text-primary)]"}`}>
                            <MapPin size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[var(--text-primary)]">
                              Private In-Store Atelier Visit
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                              VIP fitting suite at Jayant Saree Center with dedicated bridal stylist.
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Consultation Focus */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                        2. Consultation Focus
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CONSULTATION_FOCUSES.map((focus) => (
                          <button
                            key={focus}
                            type="button"
                            onClick={() => setConsultationFocus(focus)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
                              consultationFocus === focus
                                ? "bg-[#8C2F4D] text-white dark:bg-[#E8C58D] dark:text-black border-[#8C2F4D] dark:border-[#E8C58D] shadow-sm"
                                : "border-[#D4B483]/30 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[#D4B483]"
                            }`}
                          >
                            {focus}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                          3. Preferred Date
                        </label>
                        <div className="flex gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setDate(getTodayDateString())}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                              date === getTodayDateString()
                                ? "bg-[#8C2F4D] text-white border-[#8C2F4D]"
                                : "border-[#D4B483]/30 bg-[var(--bg-primary)]"
                            }`}
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => setDate(getTomorrowDateString())}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                              date === getTomorrowDateString()
                                ? "bg-[#8C2F4D] text-white border-[#8C2F4D]"
                                : "border-[#D4B483]/30 bg-[var(--bg-primary)]"
                            }`}
                          >
                            Tomorrow
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="date"
                            value={date}
                            min={getTodayDateString()}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                          4. Time Slot (IST)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`py-2 px-2 rounded-lg text-xs font-medium transition text-center cursor-pointer border ${
                                timeSlot === slot
                                  ? "bg-[#8C2F4D] text-white border-[#8C2F4D] shadow-sm font-semibold"
                                  : "border-[#D4B483]/30 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[#D4B483]"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Client Contact Fields */}
                    <div className="pt-2 border-t border-[#D4B483]/20 space-y-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                        5. Client Contact Information
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Radhika Sharma"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                            Mobile Number (with WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 7387020612"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="radhika@example.com"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                            Occasion / Saree Requirements
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Reception saree, pastel colors, bride..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reserve Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6D1830] via-[#8C2F4D] to-[#6D1830] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {bookingLoading ? (
                          <span>Reserving Your Consultation...</span>
                        ) : (
                          <>
                            <Crown size={15} className="text-[#E8C58D]" />
                            <span>Confirm & Reserve VIP Consultation</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Complimentary VIP Service • Instant Confirmation & Session Prep</span>
                    </div>
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