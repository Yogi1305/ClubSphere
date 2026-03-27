import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Baseurl } from '../main';
import {
  Calendar, MapPin, Clock, ArrowRight,
  Zap, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ── clubs to pull events from ───────────────────── */
const CLUBS = ['hobby', 'dramatic'];

/* ── countdown formatter ─────────────────────────── */
const getCountdown = (start) => {
  const diff = new Date(start) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return { value: d, unit: d === 1 ? 'day' : 'days' };
  if (h > 0) return { value: h, unit: h === 1 ? 'hr' : 'hrs' };
  return { value: m || 1, unit: 'min' };
};

/* ── colour per club ──────────────────────────────── */
const CLUB_ACCENT = {
  hobby:    { grad: 'linear-gradient(135deg,#a855f7,#ec4899)', dim: 'rgba(168,85,247,0.15)' },
  dramatic: { grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)', dim: 'rgba(6,182,212,0.15)'  },
};

/* ── single event card ───────────────────────────── */
const EventCard = ({ event, index }) => {
  const accent    = CLUB_ACCENT[event._club] || CLUB_ACCENT.hobby;
  const countdown = getCountdown(event.start);
  const dateStr   = new Date(event.start).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  const timeStr   = new Date(event.start).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      className="ue-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* top gradient band */}
      <div className="ue-card-band" style={{ background: accent.grad }} />

      <div className="ue-card-inner">
        {/* image or placeholder */}
        <div className="ue-card-img-wrap">
          {event.imageurl ? (
            <img src={event.imageurl} alt={event.title} className="ue-card-img" />
          ) : (
            <div className="ue-card-img-ph" style={{ background: accent.dim }}>
              <Calendar size={26} color="#a855f7" />
            </div>
          )}
          {/* club chip */}
          <span className="ue-club-chip" style={{ background: accent.grad }}>
            {event._club.charAt(0).toUpperCase() + event._club.slice(1)}
          </span>
        </div>

        {/* content */}
        <div className="ue-card-content">
          <h3 className="ue-card-title">{event.title}</h3>

          {event.description && (
            <p className="ue-card-desc">{event.description}</p>
          )}

          <div className="ue-card-meta">
            <span className="ue-meta-item">
              <Calendar size={12} /> {dateStr}
            </span>
            <span className="ue-meta-item">
              <Clock size={12} /> {timeStr}
            </span>
            {event.location && (
              <span className="ue-meta-item">
                <MapPin size={12} /> {event.location}
              </span>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="ue-card-footer">
          {countdown && (
            <div className="ue-countdown">
              <Zap size={12} color="#facc15" />
              <span className="ue-countdown-val">{countdown.value}</span>
              <span className="ue-countdown-unit">{countdown.unit} away</span>
            </div>
          )}
          <Link
            to={`/club/${event._club}`}
            className="ue-view-btn"
            style={{ background: accent.grad }}
          >
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── main component ──────────────────────────────── */
const RightBox = () => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const trackRef = useRef(null);

  const PER_PAGE = 3; // visible cards at once (on desktop)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          CLUBS.map(club =>
            axios.get(`${Baseurl}/event/allevent/${club}`, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }).then(r => (r.data.events || []).map(e => ({ ...e, _club: club })))
          )
        );

        const now = Date.now();
        const allEvents = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .filter(e => new Date(e.start) > now)          // only future
          .sort((a, b) => new Date(a.start) - new Date(b.start)); // soonest first

        setEvents(allEvents);
      } catch (err) {
        console.error('UpcomingEvents fetch error:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalPages = Math.max(1, Math.ceil(events.length / PER_PAGE));
  const visible    = events.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <>
      <style>{`
        /* ── tokens ── */
        .ue-root {
          padding: 72px 60px;
          background: #111118;
          position: relative;
          overflow: hidden;
        }

        /* ambient orbs */
        .ue-root::before {
          content:''; position:absolute; top:-100px; right:-100px;
          width:400px; height:400px;
          background:radial-gradient(circle,rgba(168,85,247,0.08) 0%,transparent 70%);
          pointer-events:none;
        }
        .ue-root::after {
          content:''; position:absolute; bottom:-80px; left:-60px;
          width:320px; height:320px;
          background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%);
          pointer-events:none;
        }

        /* ── header ── */
        .ue-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:36px; flex-wrap:wrap; gap:16px;
        }
        .ue-header-left { display:flex; align-items:center; gap:14px; }

        .ue-pulse {
          position:relative; width:10px; height:10px;
        }
        .ue-pulse-dot {
          width:10px; height:10px; border-radius:50%;
          background: linear-gradient(135deg,#a855f7,#ec4899);
        }
        .ue-pulse-ring {
          position:absolute; inset:-4px; border-radius:50%;
          border:2px solid rgba(168,85,247,0.5);
          animation: ue-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes ue-ping {
          0%   { transform:scale(1);   opacity:1; }
          75%, 100% { transform:scale(2.2); opacity:0; }
        }

        .ue-title {
          font-size: 1.6rem; font-weight:800; letter-spacing:-0.02em;
          background:linear-gradient(135deg,#f0e8ff,#c084fc 50%,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; margin:0;
        }
        .ue-subtitle {
          font-size:0.78rem; color:#5c5478; margin:5px 0 0;
          font-weight:500;
        }

        .ue-header-right { display:flex; align-items:center; gap:10px; }

        .ue-nav-btn {
          width:34px; height:34px; border-radius:50%;
          background:#16161e; border:1px solid rgba(168,85,247,0.2);
          color:#9d8fc0; display:flex; align-items:center; justify-content:center;
          transition:background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .ue-nav-btn:hover:not(:disabled) {
          background:rgba(168,85,247,0.14); border-color:rgba(168,85,247,0.5);
          color:#c084fc; box-shadow:0 0 14px rgba(168,85,247,0.25);
        }
        .ue-nav-btn:disabled { opacity:0.3; pointer-events:none; }

        .ue-page-info {
          font-size:0.75rem; color:#5c5478; font-weight:600;
          min-width:40px; text-align:center;
        }

        .ue-all-link {
          display:inline-flex; align-items:center; gap:6px;
          font-size:0.8rem; font-weight:700; color:#c084fc;
          text-decoration:none; padding:7px 14px;
          border:1px solid rgba(168,85,247,0.25); border-radius:10px;
          transition:background 0.2s, border-color 0.2s;
        }
        .ue-all-link:hover {
          background:rgba(168,85,247,0.1); border-color:rgba(168,85,247,0.5);
        }

        /* ── card grid ── */
        .ue-grid {
          display:grid;
          grid-template-columns: repeat(3,1fr);
          gap:18px;
        }

        @keyframes ue-slide-in {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .ue-card {
          background:#1a1727;
          border:1px solid rgba(168,85,247,0.13);
          border-radius:18px; overflow:hidden;
          display:flex; flex-direction:column;
          animation:ue-slide-in 0.45s cubic-bezier(.4,0,.2,1) both;
          transition:border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .ue-card:hover {
          border-color:rgba(168,85,247,0.38);
          transform:translateY(-4px);
          box-shadow:0 8px 30px rgba(168,85,247,0.15);
        }

        .ue-card-band { height:3px; flex-shrink:0; }

        .ue-card-inner { padding:16px; display:flex; flex-direction:column; flex:1; gap:12px; }

        /* image */
        .ue-card-img-wrap { position:relative; height:130px; border-radius:12px; overflow:hidden; flex-shrink:0; }
        .ue-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.4s; }
        .ue-card:hover .ue-card-img { transform:scale(1.05); }
        .ue-card-img-ph {
          width:100%; height:100%; display:flex; align-items:center; justify-content:center;
          border-radius:12px;
        }

        .ue-club-chip {
          position:absolute; top:8px; right:8px;
          font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em;
          color:#fff; padding:3px 9px; border-radius:999px;
        }

        /* content */
        .ue-card-content { flex:1; }
        .ue-card-title {
          font-size:0.97rem; font-weight:700; color:#ede8ff;
          margin:0 0 6px; line-height:1.3;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
        }
        .ue-card-desc {
          font-size:0.78rem; color:#6b5f8c; line-height:1.55; margin:0;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
        }

        /* meta */
        .ue-card-meta { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
        .ue-meta-item {
          display:inline-flex; align-items:center; gap:4px;
          font-size:0.7rem; color:#7c6fa0; font-weight:500;
          background:rgba(0,0,0,0.2); border:1px solid rgba(168,85,247,0.1);
          padding:3px 8px; border-radius:7px;
        }

        /* footer */
        .ue-card-footer {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:10px; border-top:1px solid rgba(168,85,247,0.1);
        }

        .ue-countdown {
          display:inline-flex; align-items:center; gap:4px;
          background:rgba(250,204,21,0.08); border:1px solid rgba(250,204,21,0.2);
          border-radius:8px; padding:4px 9px;
        }
        .ue-countdown-val  { font-size:0.82rem; font-weight:800; color:#facc15; }
        .ue-countdown-unit { font-size:0.68rem; font-weight:600; color:#a08b3a; }

        .ue-view-btn {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.73rem; font-weight:700; color:#fff;
          padding:5px 12px; border-radius:8px; text-decoration:none;
          transition:opacity 0.2s, transform 0.2s;
        }
        .ue-view-btn:hover { opacity:0.85; transform:translateX(2px); }

        /* ── empty ── */
        .ue-empty {
          text-align:center; padding:48px 24px;
          background:#16161e; border:1px dashed rgba(168,85,247,0.2);
          border-radius:18px;
        }
        .ue-empty-icon {
          width:56px; height:56px; border-radius:16px; margin:0 auto 16px;
          background:rgba(168,85,247,0.07); border:1px solid rgba(168,85,247,0.18);
          display:flex; align-items:center; justify-content:center;
        }
        .ue-empty h3 { font-size:0.98rem; font-weight:700; color:#ede8ff; margin:0 0 6px; }
        .ue-empty p  { font-size:0.8rem; color:#5c5478; margin:0; }

        /* ── skeleton ── */
        @keyframes ue-shimmer {
          0%   { background-position:-500px 0; }
          100% { background-position:500px 0; }
        }
        .ue-skel {
          background:linear-gradient(90deg,#16161e 25%,#1e1b2e 50%,#16161e 75%);
          background-size:500px 100%;
          animation:ue-shimmer 1.3s infinite linear;
          border-radius:8px;
        }
        .ue-skel-card {
          background:#1a1727; border:1px solid rgba(168,85,247,0.1);
          border-radius:18px; overflow:hidden; padding:16px;
          display:flex; flex-direction:column; gap:12px;
        }

        /* ── responsive ── */
        @media (max-width:1024px) {
          .ue-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:640px) {
          .ue-root  { padding:48px 20px; }
          .ue-grid  { grid-template-columns:1fr; }
          .ue-title { font-size:1.2rem; }
        }
      `}</style>

      <section className="ue-root rounded-2xl">
        {/* ── header ── */}
        <div className="ue-header">
          <div className="ue-header-left">
            <div className="ue-pulse">
              <div className="ue-pulse-dot" />
              <div className="ue-pulse-ring" />
            </div>
            <div>
              <h2 className="ue-title">Upcoming Events</h2>
              <p className="ue-subtitle">
                {loading ? 'Fetching events…' : `${events.length} event${events.length !== 1 ? 's' : ''} scheduled across all clubs`}
              </p>
            </div>
          </div>

          {!loading && events.length > 0 && (
            <div className="ue-header-right">
              {/* pagination */}
              {totalPages > 1 && (
                <>
                  <button className="ue-nav-btn" onClick={prev} disabled={page === 0}>
                    <ChevronLeft size={15} />
                  </button>
                  <span className="ue-page-info">{page + 1} / {totalPages}</span>
                  <button className="ue-nav-btn" onClick={next} disabled={page >= totalPages - 1}>
                    <ChevronRight size={15} />
                  </button>
                </>
              )}
              <Link to="/club/hobby" className="ue-all-link">
                All Events <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* ── content ── */}
        {loading ? (
          <div className="ue-grid">
            {[0,1,2].map(i => (
              <div key={i} className="ue-skel-card">
                <div className="ue-skel" style={{ height:130 }} />
                <div className="ue-skel" style={{ height:16, width:'70%' }} />
                <div className="ue-skel" style={{ height:12, width:'90%' }} />
                <div className="ue-skel" style={{ height:12, width:'55%' }} />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="ue-empty rounded-2xl text-center">
            <div className="ue-empty-icon"><Calendar size={24} color="#6b4fa0" /></div>
            <h3>No upcoming events</h3>
            <p>Check back soon — something exciting is being planned!</p>
          </div>
        ) : (
          <div className="ue-grid">
            {visible.map((ev, i) => (
              <EventCard key={ev._id} event={ev} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default RightBox;