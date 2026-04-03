import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Bell, Calendar, Search,
  ChevronLeft, ChevronRight,
  MapPin, Clock, ArrowRight, CalendarDays, Lock,
} from "lucide-react";
import { Baseurl } from '../main';
import Navbar from './Navbar';
import ClubCard from "./ClubCard";
import { ClubsData } from '../util/constant';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import './Home.css';

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
  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 12 } },
      "(max-width: 640px)":  { slides: { perView: 1, spacing: 8  } },
    },
  });

  useEffect(() => { checkLoginStatus(); }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${Baseurl}/checklogged`, {
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
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
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
  );

  return (
    <>
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
              </div>
            ))}
          </div>
        </section>

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
        </footer>
      </div>
    </>
  );
};

export default Home;