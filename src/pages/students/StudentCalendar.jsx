import { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/private/students/DashboardLayout.jsx";
import axios from "axios";
import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HOUR_START = 5; // 5 AM
const HOUR_END = 17;  // 5 PM
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

export default function StudentCalendar() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://tutorialcenter-back.test";
  const token = localStorage.getItem("student_token");

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);

  // Get the start of the displayed week (Sunday)
  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const start = new Date(now);
    start.setDate(now.getDate() - day + weekOffset * 7);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [weekOffset]);

  // Generate dates for each day column
  const weekDates = useMemo(() => {
    return DAYS_OF_WEEK.map((label, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return { label, date: d };
    });
  }, [weekStart]);

  // Fetch calendar schedule
  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students/calendar/schedule`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      console.log("Calendar API Response:", res.data);
      const data = res.data.sessions || res.data.schedule || res.data.data || res.data || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch calendar schedule:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Map sessions to the grid
  const getSessionsForCell = useCallback((dayDate, hour) => {
    return sessions.filter((s) => {
      const sessionDate = new Date(s.session_date);
      const sameDay =
        sessionDate.getFullYear() === dayDate.getFullYear() &&
        sessionDate.getMonth() === dayDate.getMonth() &&
        sessionDate.getDate() === dayDate.getDate();
      if (!sameDay) return false;
      const startHour = parseInt((s.starts_at || "00:00").split(":")[0], 10);
      return startHour === hour;
    });
  }, [sessions]);

  // Check if a date is today
  const isToday = (d) => {
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };

  // Format helpers
  const formatHour = (h) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr} ${suffix}`;
  };

  const formatModalDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatModalTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hr = hour % 12 === 0 ? 12 : hour % 12;
    return `${hr}:${m} ${suffix}`;
  };

  const getInitials = (title) => {
    if (!title) return "MC";
    return title.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  };

  // GMT offset label
  const gmtOffset = useMemo(() => {
    const offset = -(new Date().getTimezoneOffset() / 60);
    return `GMT${offset >= 0 ? "+" : ""}${offset}`;
  }, []);

  return (
    <DashboardLayout pagetitle="Calendar" hideHeader={true}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full min-h-screen">

        {/* ====== Header ====== */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] md:text-[42px] font-black text-[#0F2843] tracking-tighter leading-none uppercase">
            CALENDAR
          </h1>
          <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all">
            <BellIcon className="w-7 h-7 text-[#0F2843]" />
            <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-[#E83831] rounded-full border-2 border-white shadow-sm"></span>
          </div>
        </div>

        {/* ====== Calendar Grid ====== */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Week Navigation + Day Headers */}
          <div className="grid grid-cols-8 bg-[#C5A97A] text-white">
            {/* Time column header with nav */}
            <div className="p-3 flex flex-col items-center justify-center gap-1 border-r border-[#BB9E7F]/30">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWeekOffset(w => w - 1)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWeekOffset(w => w + 1)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{gmtOffset}</span>
            </div>

            {/* Day columns */}
            {weekDates.map(({ label, date }, i) => {
              const today = isToday(date);
              return (
                <div
                  key={i}
                  className={`p-3 text-center border-r border-[#BB9E7F]/30 last:border-0 transition-all ${today ? "bg-[#0F2843]" : ""}`}
                >
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${today ? "text-white" : "text-white/80"}`}>
                    {label}
                  </div>
                  <div className={`text-xl font-black mt-0.5 ${today ? "text-white" : "text-white/90"}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#0F2843] mx-auto" />
              <p className="mt-4 text-gray-400 font-bold text-sm">Loading schedule...</p>
            </div>
          ) : (
            <div className="max-h-[85vh] overflow-y-auto">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-0">
                  {/* Time Label */}
                  <div className="p-2 md:p-3 text-[11px] md:text-xs font-bold text-gray-400 uppercase flex items-start justify-center pt-3 border-r border-gray-100">
                    {formatHour(hour)}
                  </div>

                  {/* Day Cells */}
                  {weekDates.map(({ date }, dayIdx) => {
                    const cellSessions = getSessionsForCell(date, hour);
                    const today = isToday(date);

                    return (
                      <div
                        key={dayIdx}
                        className={`relative min-h-[90px] md:min-h-[110px] border-r border-gray-100 last:border-0 p-0.5 md:p-1 ${today ? "bg-blue-50/30" : ""}`}
                      >
                        {cellSessions.map((s, sIdx) => (
                          <button
                            key={s.id || sIdx}
                            onClick={() => setSelectedSession(s)}
                            className="w-full text-left bg-gray-200/80 hover:bg-gray-300/90 text-gray-700 text-[9px] md:text-[10px] font-bold rounded-md p-1 md:p-1.5 mb-0.5 truncate transition-all hover:shadow-sm active:scale-[0.97] cursor-pointer leading-tight"
                          >
                            {s.class?.title || s.title || "Class"}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== Session Detail Modal ====== */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSession(null)} />
          <div className="relative bg-white rounded-3xl p-8 md:p-10 w-[90%] max-w-md shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#0F2843] flex items-center justify-center text-white font-black text-sm shrink-0">
                {getInitials(selectedSession.class?.title || selectedSession.title || "MC")}
              </div>
              <h3 className="text-lg font-black text-[#0F2843] leading-tight">
                {selectedSession.class?.title || selectedSession.title || "Master Class"}
              </h3>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-400">Date:</span>
                <span className="text-sm font-black text-[#0F2843]">
                  {formatModalDate(selectedSession.session_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-400">Time:</span>
                <span className="text-sm font-black text-[#0F2843]">
                  {formatModalTime(selectedSession.starts_at)}
                  {selectedSession.ends_at ? ` – ${formatModalTime(selectedSession.ends_at)}` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-gray-400 shrink-0">Class Link:</span>
                {selectedSession.class_link ? (
                  <a
                    href={selectedSession.class_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#3A5ECC] underline decoration-dotted underline-offset-4 hover:text-[#0F2843] transition-colors truncate"
                  >
                    {selectedSession.class_link}
                  </a>
                ) : (
                  <span className="text-sm text-gray-300 italic">No link yet.</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-gray-400 shrink-0">Video Link:</span>
                {selectedSession.recording_link ? (
                  <a
                    href={selectedSession.recording_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#3A5ECC] underline decoration-dotted underline-offset-4 hover:text-[#0F2843] transition-colors truncate"
                  >
                    {selectedSession.recording_link}
                  </a>
                ) : (
                  <span className="text-sm text-gray-300 italic">No video uploaded yet.</span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedSession(null)}
              className="mt-8 w-full py-4 bg-[#0F2843] text-white font-black rounded-2xl hover:bg-[#1a3d5c] transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
