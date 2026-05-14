import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { Baseurl } from "../main";
import Navbar from "./Navbar";

/* ── helpers ── */
const formatTime = (str) => {
  if (!str) return "";
  return new Date(str).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};
const formatDate = (str) => {
  if (!str) return "TBA";
  return new Date(str).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};
const getMonth = (str) =>
  str ? new Date(str).toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "?";
const getDay = (str) => (str ? new Date(str).getDate() : "?");

const GRADIENTS = [
  "from-violet-700 to-purple-800",
  "from-pink-700 to-rose-800",
  "from-indigo-700 to-violet-800",
  "from-fuchsia-700 to-pink-800",
  "from-purple-700 to-indigo-800",
];

/* ── Skeleton Row ── */
const SkeletonRow = () => (
  <div className="bg-[#16161e] border border-violet-500/10 rounded-2xl overflow-hidden animate-pulse flex h-36">
    <div className="w-40 shrink-0 bg-violet-500/10" />
    <div className="flex-1 p-5 flex flex-col justify-center gap-3">
      <div className="h-3 w-1/4 bg-violet-500/10 rounded-full" />
      <div className="h-5 w-2/3 bg-violet-500/10 rounded-full" />
      <div className="h-3 w-1/2 bg-violet-500/10 rounded-full" />
    </div>
  </div>
);

/* ── Event Row Card ── */
const EventRow = ({ event, index }) => {
  const [hovered, setHovered] = useState(false);
  const clubName = event.club || "General";
  const isPast = event.start && new Date(event.start) < new Date();

  return (
    <Link
      to={`/club/${clubName}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-stretch rounded-2xl overflow-hidden border
        no-underline text-inherit transition-all duration-300
        ${isPast ? "opacity-55" : ""}
        ${hovered
          ? "border-violet-500/45 shadow-[0_8px_32px_rgba(139,92,246,0.18)] -translate-y-0.5"
          : "border-violet-500/10 shadow-[0_2px_8px_rgba(0,0,0,0.35)]"}
      `}
      style={{ background: hovered ? "#1a1828" : "#16161e" }}
    >
      {/* Left: image or gradient date block */}
      <div className="relative w-40 shrink-0 overflow-hidden">
        {event.imageurl ? (
          <>
            <img
              src={event.imageurl}
              alt={event.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
            />
            {event.start && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-3 text-center">
                <span className="block text-xl font-extrabold text-white leading-none">{getDay(event.start)}</span>
                <span className="block text-[9px] font-bold text-white/60 tracking-widest uppercase">{getMonth(event.start)}</span>
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex flex-col items-center justify-center gap-1`}>
            <span className="text-3xl font-extrabold text-white/90 leading-none">{getDay(event.start)}</span>
            <span className="text-[10px] font-bold text-white/55 tracking-widest uppercase">{getMonth(event.start)}</span>
          </div>
        )}
      </div>

      {/* Middle: content */}
      <div className="flex flex-col justify-center flex-1 px-5 py-4 gap-2 min-w-0">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/15 text-violet-300 border border-violet-500/25 rounded-full px-2.5 py-0.5">
            {clubName}
          </span>
          {isPast && (
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-white/5 text-white/25 border border-white/10 rounded-full px-2.5 py-0.5">
              Past
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[#f0eeff] text-base font-bold m-0 leading-snug truncate">
          {event.title || "Untitled Event"}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-[#7a6e9a] text-xs leading-relaxed m-0 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Date · time · location */}
        <div className="flex items-center gap-4 flex-wrap mt-0.5">
          {event.start && (
            <span className="flex items-center gap-1.5 text-[11px] text-violet-400/55 font-medium">
              <Clock size={11} className="shrink-0" />
              {formatDate(event.start)}
              {formatTime(event.start) ? ` · ${formatTime(event.start)}` : ""}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5 text-[11px] text-violet-400/55 font-medium">
              <MapPin size={11} className="shrink-0" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Right: arrow */}
      <div className="flex items-center pr-5 pl-2 shrink-0">
        <ChevronRight
          size={18}
          className={`transition-all duration-200 ${hovered ? "text-violet-400 translate-x-1" : "text-violet-500/30"}`}
        />
      </div>
    </Link>
  );
};

/* ── Main Page ── */
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
 // const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${Baseurl}/event/getallevent/club`, {
        withCredentials: true,
      });
      if (res.data?.events) setEvents(res.data.events);
    } catch (error) {
      console.log("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  };

  const clubs = ["All", ...new Set(events.map((e) => e.club).filter(Boolean))];

  const filtered = events.filter((e) => clubFilter === "All" || e.club === clubFilter);

  const now = new Date();
  const upcoming = filtered.filter((e) => !e.start || new Date(e.start) >= now);
  const past     = filtered.filter((e) =>  e.start && new Date(e.start) <  now);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0e8ff] font-sans">
      <Navbar />

      {/* ambient glows */}
      <div className="fixed -top-32 left-[20%] w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.09)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="fixed top-[50%] right-0 w-[360px] h-[360px] bg-[radial-gradient(ellipse,rgba(236,72,153,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24">

        {/* ── Header ── */}
        <div className="pt-14 pb-8">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-4 py-1.5 mb-5">
            <span className="text-violet-400 text-xs font-semibold">
              ✦ {events.length} event{events.length !== 1 ? "s" : ""} across all clubs
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text">
            All Events
          </h1>
          <p className="text-violet-500/60 text-sm mt-3">
            Workshops, meetups, competitions and more — happening right now on campus.
          </p>
        </div>

        {/* ── Club filter buttons ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {clubs.map((club) => {
            const active = clubFilter === club;
            const count  = club === "All"
              ? events.length
              : events.filter((e) => e.club === club).length;
            return (
              <button
                key={club}
                onClick={() => setClubFilter(club)}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold
                  whitespace-nowrap transition-all duration-200 cursor-pointer
                  ${active
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]"
                    : "bg-[#16161e] border border-violet-500/15 text-violet-400/60 hover:border-violet-500/35 hover:text-violet-300"}
                `}
              >
                {club}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-violet-500/15 text-violet-400/70"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-8" />

        {/* ── Skeletons ── */}
        {loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* ── Upcoming ── */}
        {!loading && upcoming.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400/70">Upcoming</span>
              <span className="text-[10px] bg-violet-500/12 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5 font-bold">{upcoming.length}</span>
              <div className="flex-1 h-px bg-violet-500/10" />
            </div>
            <div className="flex flex-col gap-3">
              {upcoming.map((event, i) => (
                <EventRow key={event._id || i} event={event} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Past ── */}
        {!loading && past.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-white/20">Past</span>
              <span className="text-[10px] bg-white/5 text-white/20 border border-white/8 rounded-full px-2.5 py-0.5 font-bold">{past.length}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="flex flex-col gap-3">
              {past.map((event, i) => (
                <EventRow key={event._id || i} event={event} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <Calendar size={28} className="text-violet-400/40" />
            </div>
            <p className="text-sm font-semibold text-violet-400/50 mb-1">No events found</p>
            <p className="text-xs text-violet-500/30 mb-5">
              {search ? `Nothing matched "${search}"` : "Check back soon — something is being planned!"}
            </p>
            {(search || clubFilter !== "All") && (
              <button
                onClick={() => { setSearch(""); setClubFilter("All"); }}
                className="text-violet-400 border border-violet-400/25 rounded-lg px-5 py-2 text-xs cursor-pointer bg-transparent hover:border-violet-400/50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}