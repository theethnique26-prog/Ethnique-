import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  CheckCircle,
  XCircle,
  Clock3,
  MessageCircle,
  Phone,
  Filter,
  Sparkles,
  Crown,
} from "lucide-react";
import customerApi from "../../services/customerApi";
import toast from "react-hot-toast";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await customerApi.get("/appointments", true);
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        setAppointments((prev) =>
          prev.map((apt) => (apt._id === id ? { ...apt, status: newStatus } : apt))
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error("Network error while updating appointment");
    }
  };

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      (apt.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.clientPhone || "").includes(search) ||
      (apt.clientEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.bookingRef || "").toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "video" && apt.sessionType?.toLowerCase().includes("video")) ||
      (typeFilter === "store" && apt.sessionType?.toLowerCase().includes("store"));

    const matchesStatus =
      statusFilter === "all" || apt.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C2F4D] dark:text-[#E8C58D] uppercase tracking-wider mb-1">
            <Crown size={14} className="text-[#B8860B]" />
            <span>VIP Client Liaison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
            Consultation & Video Drape Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage 1-on-1 virtual video saree drape sessions & private in-store atelier visits.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="px-4 py-2 rounded-xl bg-[#6D1830] hover:bg-[#8C2F4D] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm self-start md:self-auto cursor-pointer"
        >
          Refresh List
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] shadow-sm">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl font-bold font-serif text-[var(--text-primary)] mt-1">
            {appointments.length}
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Virtual Video Drapes
          </p>
          <p className="text-2xl font-bold font-serif text-emerald-800 dark:text-emerald-300 mt-1">
            {appointments.filter((a) => a.sessionType?.toLowerCase().includes("video")).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
          <p className="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            In-Store Atelier Visits
          </p>
          <p className="text-2xl font-bold font-serif text-amber-800 dark:text-amber-300 mt-1">
            {appointments.filter((a) => a.sessionType?.toLowerCase().includes("store")).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm">
          <p className="text-xs text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            Confirmed / Active
          </p>
          <p className="text-2xl font-bold font-serif text-rose-800 dark:text-rose-300 mt-1">
            {appointments.filter((a) => a.status === "Confirmed").length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client, phone, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#8C2F4D]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Filter size={13} />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="video">Virtual Video Drapes</option>
            <option value="store">In-Store Visits</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#D4B483]/40 bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--text-muted)]">
            Loading consultations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={36} className="mx-auto text-gray-400 mb-2 opacity-50" />
            <p className="text-sm font-medium text-[var(--text-primary)]">No bookings found</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              New video drape appointments will appear here as clients book online.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#D4B483]/10 border-b border-[#D4B483]/20 uppercase tracking-wider text-[11px] text-[var(--text-muted)]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Booking Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Client Name & Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Session Type</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-3.5 px-4 font-semibold">Focus & Notes</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4B483]/15">
                {filtered.map((apt) => {
                  const isVideo = apt.sessionType?.toLowerCase().includes("video");
                  const cleanPhone = (apt.clientPhone || "").replace(/\D/g, "").slice(-10);

                  return (
                    <tr key={apt._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-4 px-4 font-mono font-bold text-[#8C2F4D] dark:text-[#E8C58D]">
                        {apt.bookingRef}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-sm text-[var(--text-primary)]">
                          {apt.clientName}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                          <Phone size={11} />
                          <span>+91 {apt.clientPhone}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {apt.clientEmail}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-[11px] ${
                            isVideo
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50"
                          }`}
                        >
                          {isVideo ? <Video size={12} /> : <MapPin size={12} />}
                          <span>{apt.sessionType}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#8C2F4D] dark:text-[#E8C58D]" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-[var(--text-primary)]">
                          {apt.consultationFocus || "General Styling"}
                        </div>
                        {apt.notes && (
                          <div className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px]" title={apt.notes}>
                            "{apt.notes}"
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none border ${
                            apt.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700"
                              : apt.status === "Completed"
                              ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700"
                              : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${apt.clientName}! Greetings from Ethnique Concierge regarding your upcoming consultation (${apt.bookingRef}) scheduled for ${apt.date} at ${apt.timeSlot}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shadow-sm cursor-pointer"
                            title="Open WhatsApp Video / Chat"
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
