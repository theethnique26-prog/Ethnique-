import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "917387020612";
const DISPLAY_PHONE = "+91 73870 20612";

function WhatsAppFloating() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello Ethnique Concierge! ✨ I would like to inquire about sarees, custom styling, and consultations."
      )}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with Concierge on WhatsApp (${DISPLAY_PHONE})`}
      className="
        fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40
        bg-emerald-600 hover:bg-emerald-700
        text-white
        border border-emerald-400/40
        px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full
        shadow-[0_8px_25px_rgba(5,150,105,0.35)]
        flex items-center gap-2
        hover:scale-105 active:scale-95
        transition-all duration-300
        group cursor-pointer backdrop-blur-md
      "
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
      </span>
      <MessageCircle size={17} className="text-white group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-xs font-semibold tracking-wide hidden sm:inline">
        WhatsApp Concierge
      </span>
    </a>
  );
}

export default WhatsAppFloating;
