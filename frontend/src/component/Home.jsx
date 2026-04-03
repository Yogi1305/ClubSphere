import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
<<<<<<< HEAD
  Users, Bell, Calendar, Search,
  ChevronLeft, ChevronRight,
  MapPin, Clock, ArrowRight, CalendarDays, Lock,
=======
  Users,
  Bell,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
} from "lucide-react";
import { Baseurl } from '../main';
import Navbar from './Navbar';
import ClubCard from "./ClubCard";
import { ClubsData } from '../util/constant';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
<<<<<<< HEAD

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const STYLES = `

  *, *::before, *::after { cursor: none !important; }

  :root {
    --bg:        #07070f;
    --bg-raised: #0d0d1c;
    --bg-card:   #111122;
    --purple:    #7c3aed;
    --indigo:    #4f46e5;
    --purple-s:  #a78bfa;
    --indigo-s:  #818cf8;
    --txt:       #eeeeff;
    --txt-m:     #7272a0;
    --txt-f:     #3d3d62;
    --bdr:       rgba(255,255,255,0.06);
    --bdr-p:     rgba(139,92,246,0.22);
  }

  /* ── Magnetic cursor ── */
  #cs-cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    background: #a78bfa;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%,-50%);
    transition: width .2s, height .2s, background .2s, opacity .2s;
    mix-blend-mode: screen;
  }
  #cs-cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(167,139,250,0.55);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%,-50%);
    transition: width .35s cubic-bezier(.23,1,.32,1),
                height .35s cubic-bezier(.23,1,.32,1),
                border-color .3s, opacity .3s;
  }
  #cs-cursor.hovering      { width: 20px; height: 20px; background: #c4b5fd; }
  #cs-cursor-ring.hovering { width: 56px; height: 56px; border-color: rgba(167,139,250,0.85); }

  /* ── Page shell ── */
  .cs-page { background: var(--bg); color: var(--txt); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .cs-h    { font-family: 'Syne', sans-serif; }

  /* ── Hero: logged-out ── */
  .cs-lo-hero {
    background:
      radial-gradient(ellipse 80% 65% at 50% -10%, rgba(124,58,237,.22) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 90% 90%,  rgba(99,102,241,.13) 0%, transparent 60%),
      var(--bg);
    min-height: 88vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 4rem;
    position: relative; overflow: hidden;
  }
  .cs-lo-hero::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 35% 30% at 50% 105%, rgba(124,58,237,.18) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Hero: logged-in (events) ── */
  .cs-li-hero {
    background:
      radial-gradient(ellipse 70% 55% at 50% -5%, rgba(124,58,237,.18) 0%, transparent 60%),
      var(--bg);
    padding: 7rem 2rem 5rem;
    position: relative; overflow: hidden;
  }

  /* ── Events list ── */
  .cs-event-row {
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    border-radius: 16px;
    transition: border-color .3s, transform .3s, box-shadow .3s;
    position: relative; overflow: hidden;
  }
  .cs-event-row::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, var(--purple), var(--indigo));
    border-radius: 3px 0 0 3px;
    opacity: 0;
    transition: opacity .3s;
  }
  .cs-event-row:hover {
    border-color: rgba(139,92,246,.4);
    transform: translateX(6px);
    box-shadow: 0 8px 40px rgba(124,58,237,.12);
  }
  .cs-event-row:hover::before { opacity: 1; }

  .cs-date-box {
    background: linear-gradient(135deg, rgba(124,58,237,.22), rgba(79,70,229,.15));
    border: 1px solid rgba(124,58,237,.3);
    border-radius: 12px;
    min-width: 64px; padding: 10px 14px;
    text-align: center;
    flex-shrink: 0;
  }

  .cs-tag {
    font-size: .7rem; font-weight: 500; letter-spacing: .04em;
    padding: 3px 10px; border-radius: 99px;
    background: rgba(139,92,246,.15);
    border: 1px solid rgba(139,92,246,.3);
    color: #c4b5fd;
  }

  /* ── Skeleton loader ── */
  @keyframes cs-shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .cs-skeleton {
    background: linear-gradient(90deg, #111122 25%, #1a1a35 50%, #111122 75%);
    background-size: 700px 100%;
    animation: cs-shimmer 1.4s infinite linear;
    border-radius: 10px;
  }

  /* ── Feature cards ── */
  .cs-card {
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    transition: border-color .3s, transform .3s, box-shadow .3s;
    border-radius: 18px;
  }
  .cs-card:hover {
    border-color: rgba(139,92,246,.42);
    transform: translateY(-5px);
    box-shadow: 0 10px 46px rgba(124,58,237,.14);
  }
  .cs-icon-bubble {
    display: inline-flex; padding: 13px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(139,92,246,.2), rgba(99,102,241,.14));
    border: 1px solid rgba(139,92,246,.3);
  }

  /* ── Buttons ── */
  .cs-btn-p {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff; font-weight: 500;
    box-shadow: 0 4px 22px rgba(124,58,237,.38), inset 0 1px 0 rgba(255,255,255,.1);
    transition: opacity .2s, box-shadow .2s, transform .15s;
    border-radius: 14px; padding: 14px 28px;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .cs-btn-p:hover { opacity:.9; box-shadow: 0 6px 32px rgba(124,58,237,.55); transform: translateY(-1px); }

  .cs-btn-g {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.11); color: #b0b0d0;
    transition: background .2s, border-color .2s;
    border-radius: 14px; padding: 14px 28px;
  }
  .cs-btn-g:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.2); }

  /* ── Badge ── */
  .cs-badge {
    background: linear-gradient(90deg, rgba(139,92,246,.18), rgba(99,102,241,.13));
    border: 1px solid rgba(139,92,246,.38); color: #c4b5fd;
    padding: 6px 16px; border-radius: 99px; font-size: .83rem; font-weight: 500;
    display: inline-block; margin-bottom: 1.5rem;
  }

  /* ── Gradient text ── */
  .cs-g-txt {
    background: linear-gradient(130deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ── Divider ── */
  .cs-div {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,.28), transparent);
    margin: 0 2.5rem;
  }

  /* ── Slider nav ── */
  .cs-snav {
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
    transition: background .2s, box-shadow .2s, border-color .2s; border-radius: 99px; padding: 10px;
  }
  .cs-snav:hover {
    background: rgba(124,58,237,.25); border-color: rgba(139,92,246,.55);
    box-shadow: 0 0 14px rgba(139,92,246,.3);
  }

  /* ── CTA ── */
  .cs-cta {
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #5b21b6 100%);
    position: relative; overflow: hidden;
  }
  .cs-cta::before {
    content: '';  position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 90% at 15% 50%, rgba(255,255,255,.08) 0%, transparent 55%),
      radial-gradient(ellipse 45% 55% at 85% 10%, rgba(255,255,255,.06) 0%, transparent 50%);
  }
  .cs-cta > * { position: relative; }

  /* ── Footer ── */
  .cs-footer {
    background: linear-gradient(to top, rgba(99,102,241,.05) 0%, transparent 80%), #050508;
    border-top: 1px solid rgba(99,102,241,.13);
  }
  .cs-fl { color: var(--txt-f); transition: color .2s; font-size: .85rem; }
  .cs-fl:hover { color: #a78bfa; }

  /* ── Empty state ── */
  .cs-empty {
    border: 1px dashed rgba(139,92,246,.25);
    background: rgba(139,92,246,.04);
    border-radius: 18px;
    padding: 4rem 2rem;
    text-align: center;
  }

  /* ── Pulse dot ── */
  @keyframes cs-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(1.5); }
  }
  .cs-pulse { animation: cs-pulse 2s infinite; }

  /* ── Stagger reveal ── */
  @keyframes cs-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .cs-anim { animation: cs-fade-up .55s cubic-bezier(.23,1,.32,1) both; }
`;

/* ══════════════════════════════════════════════════
   MAGNETIC CURSOR
══════════════════════════════════════════════════ */
function MagneticCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring    = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf     = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };

    const onEnter = () => {
      dotRef.current?.classList.add('hovering');
      ringRef.current?.classList.add('hovering');
    };
    const onLeave = () => {
      dotRef.current?.classList.remove('hovering');
      ringRef.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMove);

    const addListeners = () => {
      document.querySelectorAll('a,button,[data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addListeners();
    const obs = new MutationObserver(addListeners);
    obs.observe(document.body, { childList: true, subtree: true });

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top  = pos.current.y + 'px';
      }
      if (ringRef.current) {
        ring.current.x += (pos.current.x - ring.current.x) * 0.12;
        ring.current.y += (pos.current.y - ring.current.y) * 0.12;
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cs-cursor"      ref={dotRef}  />
      <div id="cs-cursor-ring" ref={ringRef} />
    </>
  );
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return { day: '--', month: '---', time: '' };
  return {
    day:   d.getDate(),
    month: MONTH[d.getMonth()],
    year:  d.getFullYear(),
    time:  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    full:  d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

function isUpcoming(str) {
  return new Date(str) >= new Date();
}

/* ══════════════════════════════════════════════════
   EVENT ROW
══════════════════════════════════════════════════ */
function EventRow({ event, index }) {
  const dt = fmtDate(event.date || event.startDate || event.eventDate);
  return (
    <div
      className="cs-event-row cs-anim flex flex-col md:flex-row items-start md:items-center gap-4 p-5"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Date box */}
      <div className="cs-date-box">
        <p className="cs-h text-2xl font-extrabold" style={{ color: '#c4b5fd' }}>{dt.day}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: '#7272a0' }}>{dt.month}</p>
        <p className="text-xs" style={{ color: '#3d3d62' }}>{dt.year}</p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {event.category && <span className="cs-tag">{event.category}</span>}
          {isUpcoming(event.date || event.startDate || event.eventDate) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6ee7b7' }}>
              <span className="cs-pulse inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Upcoming
            </span>
          )}
        </div>
        <h3 className="cs-h font-bold text-lg truncate" style={{ color: '#eeeeff' }}>
          {event.title || event.name || 'Untitled Event'}
        </h3>
        <p className="mt-1 text-sm line-clamp-1" style={{ color: '#7272a0' }}>
          {event.description || event.desc || ''}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-4">
          {(event.location || event.venue) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <MapPin className="h-3.5 w-3.5 text-purple-400" />
              {event.location || event.venue}
            </span>
          )}
          {dt.time && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              {dt.time}
            </span>
          )}
          {(event.clubName || event.club) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#5a5a80' }}>
              <Users className="h-3.5 w-3.5 text-purple-400" />
              {event.clubName || event.club}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <Link
        to={`/events/${event._id || event.id}`}
        className="flex-shrink-0 p-2.5 rounded-xl transition-colors"
        style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.22)' }}
      >
        <ArrowRight className="h-4 w-4 text-purple-400" />
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════ */
function EventSkeleton() {
  return (
    <div className="cs-event-row flex items-center gap-4 p-5">
      <div className="cs-skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="cs-skeleton h-3 w-24 rounded" />
        <div className="cs-skeleton h-5 w-64 rounded" />
        <div className="cs-skeleton h-3 w-40 rounded" />
      </div>
      <div className="cs-skeleton w-9 h-9 rounded-xl flex-shrink-0" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════ */
const Home = () => {
  const [isLoggedIn,    setIsLoggedIn]    = useState(false);
  const [userName,      setUserName]      = useState('');
  const [loading,       setLoading]       = useState(true);
  const [events,        setEvents]        = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
=======
import RightBox from "./RightBox";

/* ─────────────────────────────────────────
   Magnetic Cursor
───────────────────────────────────────── */
const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const dotRef    = useRef(null);
  const posRef    = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef    = useRef(null);
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
    const onMove  = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
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
        position:'fixed', top:0, left:0, width:40, height:40, borderRadius:'50%',
        border:`1.5px solid ${hovered ? '#ec4899' : '#a855f7'}`,
        pointerEvents:'none', zIndex:99999,
        transition:'border-color 0.3s, width 0.3s, height 0.3s, background 0.3s',
        background: hovered ? 'rgba(168,85,247,0.10)' : 'transparent',
        willChange:'transform', transform:'translate(-100px,-100px)',
      }} />
      <div ref={dotRef} style={{
        position:'fixed', top:0, left:0, width:8, height:8, borderRadius:'50%',
        background: hovered ? '#ec4899' : '#a855f7',
        pointerEvents:'none', zIndex:100000,
        transition:'background 0.3s', willChange:'transform',
        transform:'translate(-100px,-100px)',
      }} />
    </>
  );
};

/* ─────────────────────────────────────────
   useReveal – IntersectionObserver hook
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
    up:    'translateY(44px)',
    down:  'translateY(-44px)',
    left:  'translateX(-44px)',
    right: 'translateX(44px)',
    scale: 'scale(0.92)',
  }[direction] || 'translateY(44px)';

  return (
    <div
      ref={ref}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? (direction === 'scale' ? 'scale(1)' : 'translate(0,0)') : hidden,
        transition:`opacity 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.65s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        willChange:'opacity, transform',
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
  <div style={{ width:'100%', height:1, position:'relative', overflow:'visible',
    background:'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 30%, rgba(236,72,153,0.5) 60%, transparent 100%)',
  }}>
    {/* centre diamond */}
    <div style={{
      position:'absolute', top:'50%', left:'50%',
      transform:'translate(-50%,-50%) rotate(45deg)',
      width:6, height:6, borderRadius:1,
      background:'linear-gradient(135deg,#a855f7,#ec4899)',
      boxShadow:'0 0 12px rgba(168,85,247,0.9)',
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
        position:'fixed', bottom:32, right:32,
        width:48, height:48, borderRadius:'50%',
        background:'linear-gradient(135deg,#a855f7,#ec4899)',
        border:'none', color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:9990,
        boxShadow:'0 4px 24px rgba(168,85,247,0.55)',
        opacity:   show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
        transition:'opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
};

/* ─────────────────────────────────────────
   Home
───────────────────────────────────────── */
const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName]     = useState('');
  const [loading, setLoading]       = useState(true);
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
<<<<<<< HEAD
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 12 } },
      "(max-width: 640px)":  { slides: { perView: 1, spacing: 8  } },
=======
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 640px)":  { slides: { perView: 1, spacing: 5  } },
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
    },
  });

  useEffect(() => { checkLoginStatus(); }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${Baseurl}/checklogged`, {
<<<<<<< HEAD
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const loggedIn = res.data?.success || false;
      setIsLoggedIn(loggedIn);
      if (res.data?.user?.fullName) setUserName(res.data.user.fullName);
      if (loggedIn) fetchEvents();
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
=======
        headers: { 'Content-Type': 'application/json' }, withCredentials: true,
      });
      setIsLoggedIn(res.data?.success || false);
      if (res.data?.user?.fullName) setUserName(res.data.user.fullName);
    } catch { setIsLoggedIn(false); }
    finally  { setLoading(false); }
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
<<<<<<< HEAD
      // Try multiple common endpoints — adapt to whichever your backend uses
      const res = await axios.get(`${Baseurl}/events`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const raw = res.data?.events || res.data?.data || res.data || [];
      const arr = Array.isArray(raw) ? raw : [];
      // Sort upcoming first
      const sorted = arr.sort((a, b) => {
        const da = new Date(a.date || a.startDate || a.eventDate || 0);
        const db = new Date(b.date || b.startDate || b.eventDate || 0);
        return da - db;
      });
      setEvents(sorted);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${Baseurl}/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false); setUserName('');
      navigate('/');
    } catch {}
  };

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <MagneticCursor />
      <div className="min-h-screen cs-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-500" />
      </div>
    </>
=======
      await axios.get(`${Baseurl}/logout`, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true,
      });
      localStorage.removeItem("userId1");
      setIsLoggedIn(false); setUserName(''); navigate('/');
    } catch (e) { console.log(e); }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid transparent',
        borderTopColor:'#a855f7', borderRightColor:'#ec4899', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
  );

  return (
    <>
<<<<<<< HEAD
      <style>{STYLES}</style>
      <MagneticCursor />

      <div className="cs-page page-transition">
        <Navbar />

        {/* ══ HERO ══════════════════════════════════════════════ */}
        {isLoggedIn ? (

          /* ── LOGGED IN: Events list ─────────────────────── */
          <section className="cs-li-hero">
            <div className="max-w-3xl mx-auto">

              {/* Header */}
              <div className="text-center mb-12 cs-anim">
                <span className="cs-badge">
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                  Upcoming Events
                </span>
                <h1 className="cs-h text-4xl md:text-5xl font-extrabold mt-2 mb-3" style={{ color: '#eeeeff' }}>
                  What's <span className="cs-g-txt">Happening Next</span>
                </h1>
                <p style={{ color: 'var(--txt-m)' }}>
                  Events from clubs you're part of — curated just for you{userName ? `, ${userName.split(' ')[0]}` : ''}.
                </p>
              </div>

              {/* Events */}
              {eventsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <EventSkeleton key={i} />)}
                </div>
              ) : events.length === 0 ? (
                <div className="cs-empty">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-purple-500 opacity-50" />
                  <p className="cs-h text-lg font-semibold" style={{ color: '#7272a0' }}>No upcoming events yet</p>
                  <p className="mt-1 text-sm" style={{ color: '#3d3d62' }}>
                    Join more clubs to see their events here.
                  </p>
                  <Link to="/clubs" className="cs-btn-p inline-flex mt-6 text-sm">
                    Browse Clubs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev, i) => <EventRow key={ev._id || ev.id || i} event={ev} index={i} />)}
                </div>
              )}

              {/* Footer link */}
              {events.length > 0 && (
                <div className="text-center mt-8">
                  <Link to="/events" className="cs-btn-p inline-flex text-sm">
                    View All Events <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>

        ) : (

          /* ── LOGGED OUT: Gate ──────────────────────────── */
          <section className="cs-lo-hero">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              {[220, 360, 500, 640].map(s => (
                <div
                  key={s}
                  className="absolute rounded-full"
                  style={{
                    width: s, height: s,
                    border: '1px solid rgba(139,92,246,' + (0.06 + (640 - s) * 0.0002) + ')',
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-xl mx-auto cs-anim">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                style={{
                  background: 'linear-gradient(135deg,rgba(124,58,237,.25),rgba(79,70,229,.18))',
                  border: '1px solid rgba(124,58,237,.35)',
                  boxShadow: '0 0 32px rgba(124,58,237,.2)',
                }}
              >
                <Lock className="h-7 w-7 text-purple-400" />
              </div>

              <span className="cs-badge">
                <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                Upcoming Events
              </span>

              <h1 className="cs-h text-4xl md:text-5xl font-extrabold mt-4 mb-5 leading-tight" style={{ color: '#eeeeff' }}>
                See What's <br />
                <span className="cs-g-txt">Happening Around You</span>
              </h1>

              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#7272a0' }}>
                Events from student clubs — workshops, meetups, hackathons &amp; more.<br />
                <strong style={{ color: '#a78bfa' }}>Log in or sign up</strong> to see upcoming events from your clubs.
              </p>

              {/* Preview blur */}
              <div className="relative mb-8 rounded-2xl overflow-hidden" style={{ filter: 'blur(0px)' }}>
                <div className="space-y-2.5 pointer-events-none select-none">
                  {[
                    { t: 'Annual Hackathon 2025',     d: '24 Mar', tag: 'Tech'     },
                    { t: 'Photography Workshop',       d: '28 Mar', tag: 'Arts'     },
                    { t: 'Entrepreneurship Summit',    d: '02 Apr', tag: 'Business' },
                  ].map(({ t, d, tag }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: 'rgba(17,17,34,0.9)',
                        border: '1px solid rgba(255,255,255,.05)',
                        filter: `blur(${i * 1.5}px)`,
                        opacity: 1 - i * 0.25,
                      }}
                    >
                      <div className="cs-date-box py-2 px-3 text-center" style={{ minWidth: 52 }}>
                        <p className="cs-h text-sm font-bold" style={{ color: '#c4b5fd' }}>{d.split(' ')[0]}</p>
                        <p className="text-xs" style={{ color: '#7272a0' }}>{d.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <span className="cs-tag mr-2">{tag}</span>
                        <p className="cs-h font-semibold text-sm mt-1" style={{ color: '#eeeeff' }}>{t}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fade overlay */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(7,7,15,0.85) 70%, rgba(7,7,15,1) 100%)',
                  }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/login"  className="cs-btn-p">Log In <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/signup" className="cs-btn-g">Create Account</Link>
              </div>
            </div>
          </section>
        )}

        <div className="cs-div" />

        {/* ══ FEATURES ══════════════════════════════════════════ */}
        <section className="py-20 px-10" style={{ background: 'var(--bg-raised)' }}>
          <h2 className="cs-h text-3xl font-bold text-center mb-12" style={{ color: '#eeeeff' }}>
            Everything You Need to Connect
          </h2>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { Icon: Search,   title: 'Discover Clubs', desc: 'Find clubs that match your interests and passions.'  },
              { Icon: Calendar, title: 'Join Events',     desc: 'Participate in workshops, meetups, and activities.'  },
              { Icon: Bell,     title: 'Stay Updated',   desc: 'Get instant notifications about club activities.'    },
              { Icon: Users,    title: 'Connect',         desc: 'Build meaningful relationships with peers.'          },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="cs-card p-7 text-center">
                <div className="flex justify-center mb-5">
                  <span className="cs-icon-bubble"><Icon className="h-7 w-7 text-purple-400" /></span>
                </div>
                <h3 className="cs-h font-semibold text-lg" style={{ color: '#eeeeff' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#7272a0' }}>{desc}</p>
=======
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

        /* subtle noise overlay */
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

        .cs-hero-img img {
          border-radius:20px;
          width:clamp(240px,28vw,400px); aspect-ratio:4/3; object-fit:cover;
          box-shadow:0 0 0 1px rgba(168,85,247,0.2),
                     0 20px 60px rgba(0,0,0,0.6),
                     var(--glow-purple);
          display:block;
        }

        /* ── Features ── */
        .cs-features { padding:80px 60px; background:var(--bg-secondary); }

        .cs-section-title {
          text-align:center;
          font-size:clamp(1.4rem,3vw,2rem); font-weight:800;
          margin:0 0 56px; color:var(--text-primary); letter-spacing:-0.02em;
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
          .cs-features  { padding:60px 28px; }
          .cs-features-grid { grid-template-columns:repeat(2,1fr); }
          .cs-clubs  { padding:60px 28px; }
          .cs-cta    { padding:70px 28px; }
          .cs-footer { padding:40px 28px; }
        }
        @media (max-width: 480px) {
          .cs-features-grid { grid-template-columns:1fr; }
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
            <div style={{ flex:1, zIndex:1, position:'relative' }}>
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
                    <Link to="/dashboard" className="cs-btn-primary">Go to Dashboard</Link>
                    <Link to="/clubs"     className="cs-btn-secondary">Browse Clubs</Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="cs-btn-primary">Join Your Club Today</Link>
                    <button className="cs-btn-secondary">Watch Demo</button>
                  </>
                )}
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={120}>
            <div className="cs-hero-img" style={{ zIndex:1 }}>
              {/* <img
                src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
                alt="Students collaborating"
              /> */}
              < RightBox/>
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
              { icon:<Search   size={22} color="#c084fc" />, title:'Discover Clubs', desc:'Find clubs that match your interests and passions.',   delay:0   },
              { icon:<Calendar size={22} color="#ec4899" />, title:'Join Events',    desc:'Participate in workshops, meetups, and activities.',  delay:100 },
              { icon:<Bell     size={22} color="#a855f7" />, title:'Stay Updated',   desc:'Get instant notifications about club activities.',   delay:200 },
              { icon:<Users    size={22} color="#f472b6" />, title:'Connect',        desc:'Build meaningful relationships with peers.',         delay:300 },
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

<<<<<<< HEAD
        <div className="cs-div" />

        {/* ══ CLUBS CAROUSEL ════════════════════════════════════ */}
        <section className="py-15 px-10" style={{ background: 'var(--bg)' }}>
          <h2 className="cs-h text-3xl font-bold text-center mb-12" style={{ color: '#eeeeff' }}>Featured Clubs</h2>
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {ClubsData.map((club, i) => (
                <div key={i} className="keen-slider__slide px-2"><ClubCard {...club} /></div>
              ))}
            </div>
            <button onClick={() => instanceRef.current?.prev()} className="cs-snav absolute top-1/2 -left-5 -translate-y-1/2">
              <ChevronLeft className="h-5 w-5 text-purple-400" />
            </button>
            <button onClick={() => instanceRef.current?.next()} className="cs-snav absolute top-1/2 -right-5 -translate-y-1/2">
              <ChevronRight className="h-5 w-5 text-purple-400" />
            </button>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════ */}
        <footer className="cs-footer px-10 py-14">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <h3 className="cs-h text-lg font-bold flex items-center gap-2.5" style={{ color: '#eeeeff' }}>
                <Users className="h-5 w-5 text-purple-400" />ClubSphere
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--txt-f)' }}>
                Building vibrant student communities through collaboration and growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="cs-h text-xs uppercase tracking-widest mb-4" style={{ color: '#5a5a8a' }}>Platform</p>
                <ul className="space-y-2.5">
                  {[['#clubs','Clubs'],['#events','Events'],['#features','Features'],['#pricing','Pricing']].map(([h,l]) => (
                    <li key={l}><a href={h} className="cs-fl">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="cs-h text-xs uppercase tracking-widest mb-4" style={{ color: '#5a5a8a' }}>Support</p>
                <ul className="space-y-2.5">
                  {[['#help','Help Center'],['/contactus','Contact Us'],['/privacy','Privacy Policy'],['/terms','Terms']].map(([h,l]) => (
                    <li key={l}><a href={h} className="cs-fl">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="cs-div mt-10 mb-6 mx-0" />
          <p className="text-center text-xs" style={{ color: 'var(--txt-f)' }}>© 2025 ClubSphere. All rights reserved.</p>
=======
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
                  <div key={index} className="keen-slider__slide" style={{ padding:'0 8px' }}>
                    <ClubCard {...club} />
                  </div>
                ))}
              </div>
              <button className="cs-slider-btn left"  onClick={() => instanceRef.current?.prev()}>
                <ChevronLeft  size={18} />
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
            <div style={{ position:'relative', zIndex:1 }}>
              <h2>Ready to Find Your Community?</h2>
              <p>Join thousands of students already building connections.</p>
              <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
                {isLoggedIn ? (
                  <>
                    <Link to="/clubs"  className="cs-btn-primary">Browse Clubs</Link>
                    <Link to="/events" className="cs-btn-secondary">View Events</Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="cs-btn-primary">Join Your Club Today</Link>
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

              <div style={{ display:'flex', gap:60, flexWrap:'wrap' }}>
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
>>>>>>> c7678869ca2d74f327a11c0212912627870ecab1
        </footer>
      </div>
    </>
  );
};

export default Home;