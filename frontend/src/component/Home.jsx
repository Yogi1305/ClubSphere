import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Bell,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Baseurl } from '../main';
import Navbar from './Navbar';
import ClubCard from "./ClubCard";
import { ClubsData } from '../util/constant';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

/* ─────────────────────────────────────────
   Magnetic Cursor
───────────────────────────────────────── */
const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = useCallback(() => {
    posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.12);
    posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.12);
    if (cursorRef.current)
      cursorRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
    if (dotRef.current)
      dotRef.current.style.transform = `translate(${targetRef.current.x - 4}px, ${targetRef.current.y - 4}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMove = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    window.addEventListener('mousemove', onMove);
    const els = document.querySelectorAll('a, button, [data-magnetic]');
    els.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed', top: 0, left: 0, width: 40, height: 40, borderRadius: '50%',
        border: `1.5px solid ${hovered ? '#ec4899' : '#a855f7'}`,
        pointerEvents: 'none', zIndex: 99999,
        transition: 'border-color 0.3s, width 0.3s, height 0.3s, background 0.3s',
        background: hovered ? 'rgba(168,85,247,0.10)' : 'transparent',
        willChange: 'transform', transform: 'translate(-100px,-100px)',
      }} />
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, width: 8, height: 8, borderRadius: '50%',
        background: hovered ? '#ec4899' : '#a855f7',
        pointerEvents: 'none', zIndex: 100000,
        transition: 'background 0.3s', willChange: 'transform',
        transform: 'translate(-100px,-100px)',
      }} />
    </>
  );
};

/* ─────────────────────────────────────────
   useReveal
───────────────────────────────────────── */
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

/* ─────────────────────────────────────────
   Reveal wrapper
───────────────────────────────────────── */
const Reveal = ({ children, delay = 0, direction = 'up' }) => {
  const [ref, visible] = useReveal();

  const hidden = {
    up: 'translateY(44px)',
    down: 'translateY(-44px)',
    left: 'translateX(-44px)',
    right: 'translateX(44px)',
    scale: 'scale(0.92)',
  }[direction] || 'translateY(44px)';

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? (direction === 'scale' ? 'scale(1)' : 'translate(0,0)') : hidden,
        transition: `opacity 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────
   Gradient Separator
───────────────────────────────────────── */
const Separator = () => (
  <div style={{
    width: '100%', height: 1, position: 'relative', overflow: 'visible',
    background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 30%, rgba(236,72,153,0.5) 60%, transparent 100%)',
  }}>
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%) rotate(45deg)',
      width: 6, height: 6, borderRadius: 1,
      background: 'linear-gradient(135deg,#a855f7,#ec4899)',
      boxShadow: '0 0 12px rgba(168,85,247,0.9)',
    }} />
  </div>
);

/* ─────────────────────────────────────────
   Back-to-Top button
───────────────────────────────────────── */
const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed', bottom: 32, right: 32,
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg,#a855f7,#ec4899)',
        border: 'none', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9990,
        boxShadow: '0 4px 24px rgba(168,85,247,0.55)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
        transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
};

/* ─────────────────────────────────────────
   Hero Events Widget (Replaces RightBox)
───────────────────────────────────────── */
const HeroEventsWidget = ({ events }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getGradient = (i) => {
    const g = [
      'linear-gradient(135deg, #a855f7, #7c3aed)',
      'linear-gradient(135deg, #ec4899, #db2777)',
      'linear-gradient(135deg, #6366f1, #4f46e5)',
      'linear-gradient(135deg, #8b5cf6, #a855f7)',
      'linear-gradient(135deg, #f472b6, #ec4899)',
    ];
    return g[i % g.length];
  };

  return (
    <div className="hero-events-widget">
      {/* Header */}
      <div className="hew-header">
        <h3 className="hew-title">Upcoming Events</h3>
        <span className="hew-count">
          {events.length} event{events.length !== 1 ? 's' : ''} scheduled across all clubs
        </span>
      </div>

      {/* Events List */}
      <div className="hew-list">
        {events.length > 0 ? (
          events.slice(0, 4).map((event, index) => (
            <Link
              key={event._id || index}
              to={`/club/${event.club || 'General'}`}
              className="hew-event-item"
            >
              {/* Left: Date Circle */}
              <div className="hew-date-circle" style={{ background: getGradient(index) }}>
                <span className="hew-date-month">
                  {event.start ? new Date(event.start).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : ''}
                </span>
                <span className="hew-date-day">
                  {event.start ? new Date(event.start).getDate() : '?'}
                </span>
              </div>

              {/* Middle: Info */}
              <div className="hew-event-info">
                <h4 className="hew-event-title">{event.title || 'Untitled Event'}</h4>
                <div className="hew-event-meta">
                  <span className="hew-event-club-badge">{event.club || 'General'}</span>
                  {event.start && (
                    <span className="hew-event-time">
                      <Clock size={10} />
                      {formatTime(event.start)}
                    </span>
                  )}
                </div>
                {event.location && (
                  <span className="hew-event-location">
                    <MapPin size={10} />
                    {event.location}
                  </span>
                )}
              </div>

              {/* Right: Arrow */}
              <div className="hew-event-arrow">
                <ChevronRight size={16} />
              </div>
            </Link>
          ))
        ) : (
          <div className="hew-empty">
            <div className="hew-empty-icon">
              <Calendar size={36} />
            </div>
            <p className="hew-empty-title">No upcoming events</p>
            <p className="hew-empty-desc">Check back soon — something exciting is being planned!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {events.length > 4 && (
        <div className="hew-footer">
          <span className="hew-footer-text">
            +{events.length - 4} more event{events.length - 4 !== 1 ? 's' : ''}
          </span>
          <ChevronDown size={14} />
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Home
───────────────────────────────────────── */
const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 640px)": { slides: { perView: 1, spacing: 5 } },
    },
  });

  useEffect(() => {
    checkLoginStatus();
    fetchEvents();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${Baseurl}/checklogged`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setIsLoggedIn(res.data?.success || false);
      if (res.data?.user?.fullName) setUserName(res.data.user.fullName);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${Baseurl}/event/getallevent/club`, {
        withCredentials: true,
      });
      if (res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (error) {
      console.log("Error fetching events", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${Baseurl}/logout`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false);
      setUserName('');
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBA';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#a855f7', borderRightColor: '#ec4899',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        :root {
          --bg-primary:    #0a0a0f;
          --bg-secondary:  #111118;
          --bg-card:       #16161e;
          --bg-card-hover: #1c1c27;
          --border:        rgba(168,85,247,0.15);
          --border-hover:  rgba(168,85,247,0.4);
          --text-primary:  #f0e8ff;
          --text-secondary:#9d8fc0;
          --text-muted:    #5c5478;
          --purple:        #a855f7;
          --pink:          #ec4899;
          --glow-purple:   0 0 30px rgba(168,85,247,0.25);
          --glow-pink:     0 0 30px rgba(236,72,153,0.2);
        }

        * { cursor: none !important; box-sizing: border-box; }

        .cs-home {
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .cs-home::before {
          content:''; position:fixed; inset:0; opacity:0.018;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px; pointer-events:none; z-index:0;
        }

        /* ── Hero ── */
        .cs-hero {
          display:flex; flex-direction:row; align-items:center;
          justify-content:space-between;
          padding:80px 60px;
          background:linear-gradient(135deg,#0e0b18 0%,#0a0a0f 50%,#130a1a 100%);
          position:relative; overflow:hidden; gap:48px;
        }
        .cs-hero::before {
          content:''; position:absolute; top:-120px; left:-120px;
          width:500px; height:500px;
          background:radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%);
          pointer-events:none;
        }
        .cs-hero::after {
          content:''; position:absolute; bottom:-80px; right:-80px;
          width:400px; height:400px;
          background:radial-gradient(circle,rgba(236,72,153,0.10) 0%,transparent 70%);
          pointer-events:none;
        }

        .cs-hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 14px;
          background:rgba(168,85,247,0.12);
          border:1px solid rgba(168,85,247,0.3);
          border-radius:999px; color:#c084fc;
          font-size:0.82rem; font-weight:600; letter-spacing:0.02em;
          margin-bottom:24px;
        }
        .cs-hero-badge::before { content:'✦'; color:var(--pink); }

        .cs-hero h2 {
          font-size:clamp(2rem,4.5vw,3.4rem); font-weight:800;
          line-height:1.15; margin:0 0 20px;
          color:var(--text-primary); letter-spacing:-0.02em;
        }
        .cs-hero h2 span {
          background:linear-gradient(135deg,#a855f7,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .cs-hero p {
          color:var(--text-secondary); font-size:1.05rem;
          line-height:1.7; margin:0 0 32px; max-width:480px;
        }

        .cs-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 28px;
          background:linear-gradient(135deg,#a855f7,#ec4899);
          color:#fff; font-weight:700; font-size:0.9rem;
          border-radius:12px; text-decoration:none; border:none;
          transition:opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow:0 4px 20px rgba(168,85,247,0.35);
        }
        .cs-btn-primary:hover {
          opacity:0.9; transform:translateY(-2px);
          box-shadow:0 8px 30px rgba(168,85,247,0.5);
        }

        .cs-btn-secondary {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 28px;
          background:transparent; color:var(--text-secondary);
          font-weight:600; font-size:0.9rem;
          border-radius:12px; text-decoration:none;
          border:1px solid rgba(168,85,247,0.25);
          transition:border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cs-btn-secondary:hover {
          border-color:rgba(168,85,247,0.6); color:#c084fc;
          background:rgba(168,85,247,0.06);
        }

        .cs-hero-btns { display:flex; gap:14px; flex-wrap:wrap; }

        /* ── Hero Events Widget ── */
        .hero-events-widget {
          width:clamp(320px, 30vw, 440px);
          background:rgba(22,22,30,0.8);
          backdrop-filter:blur(20px);
          border:1px solid var(--border);
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 20px 60px rgba(0,0,0,0.5), var(--glow-purple);
        }

        .hew-header {
          padding:24px 24px 16px;
          border-bottom:1px solid var(--border);
        }
        .hew-title {
          font-size:1.3rem;
          font-weight:800;
          margin:0 0 6px;
          background:linear-gradient(135deg,#c084fc,#ec4899);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .hew-count {
          font-size:0.78rem;
          color:var(--text-muted);
          font-weight:500;
        }

        .hew-list {
          padding:8px 12px;
          max-height:340px;
          overflow-y:auto;
          scrollbar-width:thin;
          scrollbar-color:rgba(168,85,247,0.3) transparent;
        }
        .hew-list::-webkit-scrollbar {
          width:4px;
        }
        .hew-list::-webkit-scrollbar-track {
          background:transparent;
        }
        .hew-list::-webkit-scrollbar-thumb {
          background:rgba(168,85,247,0.3);
          border-radius:4px;
        }

        /* Event Item */
        .hew-event-item {
          display:flex;
          align-items:center;
          gap:14px;
          padding:14px 12px;
          border-radius:14px;
          text-decoration:none;
          color:inherit;
          transition:background 0.2s, transform 0.2s;
          border:1px solid transparent;
        }
        .hew-event-item:hover {
          background:rgba(168,85,247,0.08);
          border-color:rgba(168,85,247,0.15);
          transform:translateX(4px);
        }
        .hew-event-item:hover .hew-event-arrow {
          opacity:1;
          transform:translateX(0);
        }
        .hew-event-item:hover .hew-date-circle {
          transform:scale(1.08);
          box-shadow:0 4px 16px rgba(168,85,247,0.3);
        }

        /* Date Circle */
        .hew-date-circle {
          width:52px;
          height:52px;
          border-radius:50%;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .hew-date-month {
          font-size:0.55rem;
          font-weight:700;
          color:rgba(255,255,255,0.85);
          letter-spacing:0.05em;
          line-height:1;
        }
        .hew-date-day {
          font-size:1.15rem;
          font-weight:800;
          color:#fff;
          line-height:1.2;
        }

        /* Event Info */
        .hew-event-info {
          flex:1;
          min-width:0;
          display:flex;
          flex-direction:column;
          gap:4px;
        }
        .hew-event-title {
          font-size:0.88rem;
          font-weight:700;
          color:var(--text-primary);
          margin:0;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .hew-event-meta {
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }
        .hew-event-club-badge {
          font-size:0.65rem;
          font-weight:700;
          padding:2px 8px;
          border-radius:999px;
          background:rgba(168,85,247,0.15);
          color:#c084fc;
          border:1px solid rgba(168,85,247,0.25);
          text-transform:uppercase;
          letter-spacing:0.03em;
        }
        .hew-event-time {
          display:flex;
          align-items:center;
          gap:3px;
          font-size:0.68rem;
          color:var(--text-muted);
        }
        .hew-event-location {
          display:flex;
          align-items:center;
          gap:3px;
          font-size:0.68rem;
          color:var(--text-muted);
        }

        /* Arrow */
        .hew-event-arrow {
          color:#c084fc;
          opacity:0;
          transform:translateX(-8px);
          transition:opacity 0.2s, transform 0.2s;
          flex-shrink:0;
        }

        /* Empty State */
        .hew-empty {
          text-align:center;
          padding:40px 20px;
        }
        .hew-empty-icon {
          width:64px;
          height:64px;
          border-radius:16px;
          background:rgba(168,85,247,0.1);
          border:1px solid rgba(168,85,247,0.2);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 16px;
          color:#c084fc;
        }
        .hew-empty-title {
          font-size:0.95rem;
          font-weight:700;
          color:var(--text-primary);
          margin:0 0 6px;
        }
        .hew-empty-desc {
          font-size:0.8rem;
          color:var(--text-muted);
          margin:0;
          line-height:1.5;
        }

        /* Footer */
        .hew-footer {
          display:flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          padding:12px;
          border-top:1px solid var(--border);
          color:var(--text-muted);
          font-size:0.75rem;
          font-weight:600;
        }

        /* ── Features ── */
        .cs-features { padding:80px 60px; background:var(--bg-secondary); }

        .cs-section-title {
          text-align:center;
          font-size:clamp(1.4rem,3vw,2rem); font-weight:800;
          margin:0 0 56px; color:var(--text-primary); letter-spacing:-0.02em;
        }
        .cs-section-subtitle {
          text-align:center;
          font-size:0.95rem;
          color:var(--text-secondary);
          margin:-40px 0 48px;
          max-width:500px;
          margin-left:auto;
          margin-right:auto;
          line-height:1.6;
        }

        .cs-features-grid {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:20px; max-width:1100px; margin:0 auto;
        }

        .cs-feature-card {
          background:var(--bg-card); border:1px solid var(--border);
          border-radius:18px; padding:32px 24px; text-align:center;
          transition:border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .cs-feature-card:hover {
          border-color:var(--border-hover); background:var(--bg-card-hover);
          transform:translateY(-4px); box-shadow:var(--glow-purple);
        }

        .cs-feature-icon {
          width:52px; height:52px; border-radius:14px;
          background:linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.10));
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 20px; border:1px solid rgba(168,85,247,0.2);
        }
        .cs-feature-card h3 { font-size:1rem; font-weight:700; margin:0 0 10px; color:var(--text-primary); }
        .cs-feature-card p  { font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin:0; }

        /* ── Events Section (below) ── */
        .cs-events {
          padding:80px 60px;
          background:var(--bg-secondary);
        }

        .cs-events-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:24px;
          max-width:1100px;
          margin:0 auto;
        }

        .cs-event-card {
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:18px;
          overflow:hidden;
          transition:border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
          text-decoration:none;
          color:inherit;
          display:flex;
          flex-direction:column;
        }
        .cs-event-card:hover {
          border-color:var(--border-hover);
          background:var(--bg-card-hover);
          transform:translateY(-6px);
          box-shadow:var(--glow-purple);
        }
        .cs-event-card:hover .cs-event-arrow {
          transform:translateX(4px);
        }

        .cs-event-img-wrapper {
          width:100%; height:180px;
          position:relative; overflow:hidden;
          border-bottom:1px solid var(--border);
        }
        .cs-event-img {
          width:100%; height:100%; object-fit:cover;
          transition:transform 0.4s ease;
        }
        .cs-event-card:hover .cs-event-img { transform:scale(1.05); }

        .cs-event-img-placeholder {
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1));
        }

        .cs-event-date-badge {
          position:absolute; top:12px; right:12px;
          background:rgba(10,10,15,0.85);
          backdrop-filter:blur(8px);
          border:1px solid rgba(168,85,247,0.3);
          border-radius:12px; padding:8px 12px;
          text-align:center; min-width:54px;
        }
        .cs-event-date-badge .month {
          font-size:0.65rem; font-weight:700;
          text-transform:uppercase; color:#c084fc;
          letter-spacing:0.05em; display:block;
        }
        .cs-event-date-badge .day {
          font-size:1.2rem; font-weight:800;
          color:var(--text-primary); display:block; line-height:1.2;
        }

        .cs-event-body {
          padding:20px; display:flex; flex-direction:column;
          gap:10px; flex:1;
        }
        .cs-event-meta {
          display:flex; align-items:center; gap:12px; flex-wrap:wrap;
        }
        .cs-event-meta-item {
          display:inline-flex; align-items:center; gap:4px;
          font-size:0.75rem; color:var(--text-muted); font-weight:500;
        }
        .cs-event-title {
          font-size:1.05rem; font-weight:700; color:var(--text-primary);
          margin:0; line-height:1.4;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .cs-event-desc {
          font-size:0.83rem; color:var(--text-secondary);
          line-height:1.6; margin:0;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .cs-event-footer {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 20px; border-top:1px solid var(--border); margin-top:auto;
        }
        .cs-event-club {
          display:inline-flex; align-items:center; gap:6px;
          font-size:0.8rem; color:var(--text-muted); font-weight:600;
        }
        .cs-event-club-name {
          background:linear-gradient(135deg,#a855f7,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .cs-event-arrow {
          color:#c084fc; transition:transform 0.2s;
        }
        .cs-no-events {
          text-align:center; color:var(--text-muted);
          font-size:0.95rem; padding:60px 0;
        }
        .cs-view-all {
          display:flex; justify-content:center; margin-top:40px;
        }

        /* ── Clubs ── */
        .cs-clubs { padding:80px 60px; background:var(--bg-primary); }

        .cs-slider-wrapper { position:relative; max-width:1100px; margin:0 auto; }

        .cs-slider-btn {
          position:absolute; top:50%; transform:translateY(-50%);
          width:42px; height:42px; border-radius:50%;
          background:var(--bg-card); border:1px solid var(--border);
          color:#c084fc; display:flex; align-items:center; justify-content:center;
          z-index:10;
          transition:background 0.2s, border-color 0.2s, box-shadow 0.2s;
          box-shadow:0 4px 16px rgba(0,0,0,0.4);
        }
        .cs-slider-btn:hover {
          background:rgba(168,85,247,0.15); border-color:rgba(168,85,247,0.5);
          box-shadow:var(--glow-purple);
        }
        .cs-slider-btn.left  { left:-22px; }
        .cs-slider-btn.right { right:-22px; }

        /* ── CTA ── */
        .cs-cta {
          text-align:center; padding:100px 40px;
          background:linear-gradient(135deg,#0e0b18 0%,#100a15 50%,#0a0a0f 100%);
          position:relative; overflow:hidden;
        }
        .cs-cta::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse at center,rgba(168,85,247,0.10) 0%,transparent 65%);
          pointer-events:none;
        }
        .cs-cta h2 {
          font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0 0 16px;
          background:linear-gradient(135deg,#f0e8ff,#c084fc,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; letter-spacing:-0.02em;
        }
        .cs-cta p { color:var(--text-secondary); font-size:1.05rem; margin:0 0 40px; }

        /* ── Footer ── */
        .cs-footer {
          background:#07070c; padding:60px;
          border-top:1px solid rgba(168,85,247,0.1);
        }
        .cs-footer-inner {
          display:flex; flex-direction:row; justify-content:space-between;
          gap:40px; flex-wrap:wrap; max-width:1100px; margin:0 auto;
        }
        .cs-footer-brand h3 {
          display:flex; align-items:center; gap:8px;
          font-size:1.1rem; font-weight:800;
          background:linear-gradient(135deg,#a855f7,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; margin:0 0 12px;
        }
        .cs-footer-brand p {
          color:var(--text-muted); font-size:0.85rem;
          line-height:1.6; max-width:240px; margin:0;
        }
        .cs-footer-links h4 {
          font-size:0.8rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.1em; color:var(--text-muted); margin:0 0 16px;
        }
        .cs-footer-links ul {
          list-style:none; padding:0; margin:0;
          display:flex; flex-direction:column; gap:10px;
        }
        .cs-footer-links a {
          color:var(--text-secondary); text-decoration:none;
          font-size:0.88rem; transition:color 0.2s;
        }
        .cs-footer-links a:hover { color:#c084fc; }
        .cs-footer-copy {
          text-align:center; color:var(--text-muted); font-size:0.78rem;
          margin:48px auto 0; max-width:1100px;
          border-top:1px solid rgba(168,85,247,0.08); padding-top:24px;
        }

        /* dark overrides for ClubCard */
        .cs-home .bg-white         { background:var(--bg-card) !important; border:1px solid var(--border) !important; }
        .cs-home .shadow-lg        { box-shadow:0 4px 24px rgba(0,0,0,0.5) !important; }
        .cs-home .text-gray-600,
        .cs-home .text-gray-700    { color:var(--text-secondary) !important; }
        .cs-home .text-gray-800    { color:var(--text-primary)   !important; }
        .cs-home .text-gray-400,
        .cs-home .text-gray-500    { color:var(--text-muted)     !important; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .cs-hero { flex-direction:column; padding:60px 28px; text-align:center; }
          .cs-hero p  { margin-left:auto; margin-right:auto; }
          .cs-hero-btns { justify-content:center; }
          .hero-events-widget { width:100% !important; max-width:440px; margin:0 auto; }
          .cs-features  { padding:60px 28px; }
          .cs-features-grid { grid-template-columns:repeat(2,1fr); }
          .cs-events { padding:60px 28px; }
          .cs-events-grid { grid-template-columns:repeat(2, 1fr); }
          .cs-clubs  { padding:60px 28px; }
          .cs-cta    { padding:70px 28px; }
          .cs-footer { padding:40px 28px; }
        }
        @media (max-width: 480px) {
          .cs-features-grid { grid-template-columns:1fr; }
          .cs-events-grid { grid-template-columns:1fr; }
        }

        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <MagneticCursor />
      <BackToTop />

      <div className="cs-home">
        <Navbar />

        {/* ═══ HERO ═══ */}
        <section className="cs-hero">
          <Reveal direction="left">
            <div style={{ flex: 1, zIndex: 1, position: 'relative' }}>
              <div className="cs-hero-badge">Join 50,000+ Students Worldwide</div>
              <h2>
                Connect. <br />
                Collaborate. <br />
                <span>Grow Together.</span>
              </h2>
              <p>Building vibrant student communities through collaboration and shared growth experiences.</p>
              <div className="cs-hero-btns">
                {isLoggedIn ? (
                  <>
                    <Link to="/club/HOBBY" className="cs-btn-primary">Go to Dashboard</Link>
                    <Link to="/clubs" className="cs-btn-secondary">Browse Clubs</Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="cs-btn-primary">Join Your Club Today</Link>
                    <button className="cs-btn-secondary">Watch Demo</button>
                  </>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={120}>
            <div style={{ zIndex: 1 }}>
              {/* ✅ Events Widget replaces RightBox */}
              <HeroEventsWidget events={events} />
            </div>
          </Reveal>
        </section>

        <Separator />

        {/* ═══ FEATURES ═══ */}
        <section className="cs-features">
          <Reveal direction="up">
            <h2 className="cs-section-title">Everything You Need to Connect</h2>
          </Reveal>

          <div className="cs-features-grid">
            {[
              { icon: <Search size={22} color="#c084fc" />, title: 'Discover Clubs', desc: 'Find clubs that match your interests and passions.', delay: 0 },
              { icon: <Calendar size={22} color="#ec4899" />, title: 'Join Events', desc: 'Participate in workshops, meetups, and activities.', delay: 100 },
              { icon: <Bell size={22} color="#a855f7" />, title: 'Stay Updated', desc: 'Get instant notifications about club activities.', delay: 200 },
              { icon: <Users size={22} color="#f472b6" />, title: 'Connect', desc: 'Build meaningful relationships with peers.', delay: 300 },
            ].map((f, i) => (
              <Reveal key={i} direction="up" delay={f.delay}>
                <div className="cs-feature-card">
                  <div className="cs-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Separator />

        {/* ═══ ALL EVENTS SECTION ═══ */}
        <section className="cs-events">
          <Reveal direction="up">
            <h2 className="cs-section-title">All Events</h2>
            <p className="cs-section-subtitle">
              Explore all events happening across clubs
            </p>
          </Reveal>

          {events.length > 0 ? (
            <>
              <div className="cs-events-grid">
                {events.map((event, index) => {
                  const startDate = event.start ? new Date(event.start) : null;
                  const monthStr = startDate
                    ? startDate.toLocaleDateString('en-US', { month: 'short' })
                    : '';
                  const dayStr = startDate ? startDate.getDate() : '';
                  const clubName = event.club || 'General';

                  return (
                    <Reveal key={event._id || index} direction="up" delay={index * 80}>
                      <Link to={`/club/${clubName}`} className="cs-event-card">
                        {/* Image */}
                        <div className="cs-event-img-wrapper">
                          {event.imageurl ? (
                            <img
                              src={event.imageurl}
                              alt={event.title || 'Event'}
                              className="cs-event-img"
                            />
                          ) : (
                            <div className="cs-event-img-placeholder">
                              <Calendar size={44} color="#c084fc" style={{ opacity: 0.6 }} />
                            </div>
                          )}
                          {startDate && (
                            <div className="cs-event-date-badge">
                              <span className="month">{monthStr}</span>
                              <span className="day">{dayStr}</span>
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="cs-event-body">
                          <div className="cs-event-meta">
                            {event.start && (
                              <span className="cs-event-meta-item">
                                <Clock size={12} />
                                {formatTime(event.start)}
                              </span>
                            )}
                            {event.location && (
                              <span className="cs-event-meta-item">
                                <MapPin size={12} />
                                {event.location}
                              </span>
                            )}
                          </div>

                          <h3 className="cs-event-title">
                            {event.title || 'Untitled Event'}
                          </h3>

                          {event.description && (
                            <p className="cs-event-desc">{event.description}</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="cs-event-footer">
                          <div className="cs-event-club">
                            <Users size={14} />
                            <span className="cs-event-club-name">{clubName}</span>
                          </div>
                          <ChevronRight size={16} className="cs-event-arrow" />
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </>
          ) : (
            <Reveal direction="up">
              <p className="cs-no-events">
                No upcoming events at the moment. Check back soon!
              </p>
            </Reveal>
          )}
        </section>

        <Separator />

        {/* ═══ CLUBS CAROUSEL ═══ */}
        <section className="cs-clubs">
          <Reveal direction="up">
            <h2 className="cs-section-title">Featured Clubs</h2>
          </Reveal>

          <Reveal direction="up" delay={120}>
            <div className="cs-slider-wrapper">
              <div ref={sliderRef} className="keen-slider">
                {ClubsData.map((club, index) => (
                  <div key={index} className="keen-slider__slide" style={{ padding: '0 8px' }}>
                    <ClubCard {...club} />
                  </div>
                ))}
              </div>
              <button className="cs-slider-btn left" onClick={() => instanceRef.current?.prev()}>
                <ChevronLeft size={18} />
              </button>
              <button className="cs-slider-btn right" onClick={() => instanceRef.current?.next()}>
                <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        </section>

        <Separator />

        {/* ═══ CTA ═══ */}
        <section className="cs-cta">
          <Reveal direction="scale">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2>Ready to Find Your Community?</h2>
              <p>Join thousands of students already building connections.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                {isLoggedIn ? (
                  <>
                    <Link to="/clubs" className="cs-btn-primary">Browse Clubs</Link>
                    <Link to="/events" className="cs-btn-secondary">View Events</Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="cs-btn-primary">Join Your Club Today</Link>
                    <button className="cs-btn-secondary">Learn More</button>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </section>

        <Separator />

        {/* ═══ FOOTER ═══ */}
        <footer className="cs-footer">
          <Reveal direction="up">
            <div className="cs-footer-inner">
              <div className="cs-footer-brand">
                <h3><Users size={16} />ClubSphere</h3>
                <p>Building vibrant student communities through collaboration and growth.</p>
              </div>

              <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
                <div className="cs-footer-links">
                  <h4>Platform</h4>
                  <ul>
                    <li><a href="#clubs">Clubs</a></li>
                    <li><a href="#events">Events</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                  </ul>
                </div>
                <div className="cs-footer-links">
                  <h4>Support</h4>
                  <ul>
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="/contactus">Contact Us</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <p className="cs-footer-copy">© 2025 ClubSphere. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;