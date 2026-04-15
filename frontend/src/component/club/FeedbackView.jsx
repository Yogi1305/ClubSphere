import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Baseurl } from '../../main';
import {
  MessageSquare, Calendar, Heart, AlertTriangle, Lightbulb,
  ThumbsUp, RefreshCw, Inbox, Search, SlidersHorizontal,
  ChevronDown, ChevronUp, Sparkles, TrendingUp, Clock,
  Filter, X, LayoutGrid, LayoutList, ArrowUpDown, Star,
} from 'lucide-react';

/* ─── type config ───────────────────────────────── */
const TYPE_CONFIG = {
  Appreciation: {
    icon: <Heart size={16} />,
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)',
    label: 'Appreciation',
    emoji: '💚',
  },
  Complaint: {
    icon: <AlertTriangle size={16} />,
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
    gradient: 'linear-gradient(135deg,#f87171,#fb923c)',
    label: 'Complaint',
    emoji: '🔴',
  },
  Suggestion: {
    icon: <Lightbulb size={16} />,
    color: '#facc15',
    bg: 'rgba(250,204,21,0.08)',
    border: 'rgba(250,204,21,0.2)',
    gradient: 'linear-gradient(135deg,#facc15,#fb923c)',
    label: 'Suggestion',
    emoji: '💡',
  },
  General: {
    icon: <MessageSquare size={16} />,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    gradient: 'linear-gradient(135deg,#a78bfa,#c084fc)',
    label: 'General',
    emoji: '💬',
  },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || TYPE_CONFIG.General;

/* ─── stable random rating (4 or 5) from _id ────── */
const getStableRating = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return (Math.abs(hash) % 2) + 4; // always 4 or 5
};

/* ─── star renderer ──────────────────────────────── */
const Stars = ({ value, size = 14, showValue = false }) => (
  <span className="fv-stars-wrap">
    <span className="fv-stars-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= value ? '#facc15' : 'transparent'}
          color={n <= value ? '#facc15' : '#3d3550'}
          strokeWidth={1.5}
        />
      ))}
    </span>
    {showValue && (
      <span className="fv-stars-value">{value}.0</span>
    )}
  </span>
);

/* ─── time ago helper ────────────────────────────── */
const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 0) return 'Upcoming';
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* ─── single feedback card ───────────────────────── */
const FeedbackCard = ({ fb, index, view, rating }) => {
  const [expanded, setExpanded] = useState(false);
  const config = getTypeConfig(fb.type);
  const dateStr = new Date(fb.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const isLong = fb.description && fb.description.length > 150;
  const displayText =
    isLong && !expanded
      ? fb.description.slice(0, 150) + '…'
      : fb.description;

  /* ── grid card ── */
  if (view === 'grid') {
    return (
      <div
        className="fv-grid-card"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div
          className="fv-grid-stripe"
          style={{ background: config.gradient }}
        />
        <div className="fv-grid-body">
          <div className="fv-grid-top">
            <span
              className="fv-type-badge"
              style={{
                color: config.color,
                background: config.bg,
                borderColor: config.border,
              }}
            >
              {config.icon}
              {config.label}
            </span>
            <Stars value={rating} size={13} />
          </div>
          <h3 className="fv-grid-title">{fb.title}</h3>
          <p className="fv-grid-desc">
            {displayText || 'No description provided.'}
          </p>
          {isLong && (
            <button
              className="fv-expand-btn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp size={12} />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={12} />
                </>
              )}
            </button>
          )}
          <div className="fv-grid-footer">
            <span className="fv-date-text">
              <Calendar size={12} />
              {dateStr}
            </span>
            <span className="fv-time-badge">
              <Clock size={11} />
              {timeAgo(fb.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ── list card ── */
  return (
    <div className="fv-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div
        className="fv-card-stripe"
        style={{ background: config.gradient }}
      />
      <div className="fv-card-body">
        <div className="fv-card-top">
          <div className="fv-card-left">
            <div
              className="fv-type-icon-wrap"
              style={{ background: config.bg, borderColor: config.border }}
            >
              {React.cloneElement(config.icon, {
                size: 20,
                color: config.color,
              })}
            </div>
            <div className="fv-card-info">
              <h3 className="fv-card-title">{fb.title}</h3>
              <div className="fv-card-meta-row">
                <span
                  className="fv-type-badge"
                  style={{
                    color: config.color,
                    background: config.bg,
                    borderColor: config.border,
                  }}
                >
                  {config.icon}
                  {config.label}
                </span>
                <span className="fv-dot">·</span>
                <span className="fv-time-badge">
                  <Clock size={11} />
                  {timeAgo(fb.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* right side: stars + date */}
          <div className="fv-card-right-col">
            <Stars value={rating} size={14} showValue />
            <span className="fv-date-pill">
              <Calendar size={12} />
              {dateStr}
            </span>
          </div>
        </div>

        <div className="fv-card-content">
          <p className="fv-card-text">
            {displayText || 'No description provided.'}
          </p>
          {isLong && (
            <button
              className="fv-expand-btn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp size={12} />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={12} />
                </>
              )}
            </button>
          )}
        </div>

        {/* rating bar visual */}
        <div className="fv-rating-bar-wrap">
          <div className="fv-rating-bar-track">
            <div
              className="fv-rating-bar-fill"
              style={{
                width: `${(rating / 5) * 100}%`,
                background:
                  rating === 5
                    ? 'linear-gradient(90deg,#4ade80,#22d3ee)'
                    : 'linear-gradient(90deg,#facc15,#fb923c)',
              }}
            />
          </div>
          <span className="fv-rating-bar-label">
            {rating === 5 ? 'Excellent' : 'Very Good'}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── stat card ──────────────────────────────────── */
const StatCard = ({ icon, label, value, accent, sub }) => (
  <div className="fv-stat-card">
    <div
      className="fv-stat-icon"
      style={{
        background: accent + '12',
        border: `1.5px solid ${accent}30`,
      }}
    >
      {React.cloneElement(icon, { size: 20, color: accent })}
    </div>
    <div className="fv-stat-info">
      <p className="fv-stat-value">{value}</p>
      <p className="fv-stat-label">{label}</p>
      {sub && <p className="fv-stat-sub">{sub}</p>}
    </div>
  </div>
);

/* ─── filter pill ────────────────────────────────── */
const FilterPill = ({ active, label, count, onClick, color }) => (
  <button
    className={`fv-filter-pill ${active ? 'fv-filter-active' : ''}`}
    onClick={onClick}
    style={
      active
        ? {
            background: (color || '#a855f7') + '18',
            borderColor: (color || '#a855f7') + '50',
            color: color || '#c084fc',
          }
        : {}
    }
  >
    {label}
    {count !== undefined && (
      <span className="fv-pill-count">{count}</span>
    )}
  </button>
);

/* ─── main component ─────────────────────────────── */
const FeedbackView = ({ club }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('list');
  const [showFilters, setShowFilters] = useState(false);

  /* fetch */
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Baseurl}/event/feedback/${club}`, {
        withCredentials: true,
      });
      setFeedbacks(res.data.data || []);
    } catch {
      console.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [club]);

  /* build a stable rating map: _id → 4 or 5 */
  const ratingMap = useMemo(() => {
    const map = {};
    feedbacks.forEach((fb) => {
      map[fb._id] = getStableRating(fb._id);
    });
    return map;
  }, [feedbacks]);

  /* derived stats */
  const typeCounts = feedbacks.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + 1;
    return acc;
  }, {});

  const avgRating = feedbacks.length
    ? (
        feedbacks.reduce((s, f) => s + (ratingMap[f._id] || 4), 0) /
        feedbacks.length
      ).toFixed(1)
    : '0.0';

  const fiveStarCount = feedbacks.filter(
    (f) => ratingMap[f._id] === 5
  ).length;

  /* filtering + sorting */
  const visible = feedbacks
    .filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        f.title?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q);
      const matchType = filterType === 'all' || f.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating-hi')
        return (ratingMap[b._id] || 4) - (ratingMap[a._id] || 4);
      if (sortBy === 'rating-lo')
        return (ratingMap[a._id] || 4) - (ratingMap[b._id] || 4);
      return 0;
    });

  return (
    <>
      <style>{`
        /* ── root ── */
        .fv-root {
          --bg:      #0b0a12;
          --surface: #111019;
          --card:    #16141f;
          --card-h:  #1c1a28;
          --border:  rgba(168,85,247,0.10);
          --b-hover: rgba(168,85,247,0.30);
          --purple:  #a855f7;
          --pink:    #ec4899;
          --text:    #ede8ff;
          --sub:     #8b7fac;
          --muted:   #4e4669;
          --yellow:  #facc15;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100%;
          padding: 28px 24px 60px;
        }

        /* ── header ── */
        .fv-header { margin-bottom: 28px; }
        .fv-header-row {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap;
          gap: 16px; margin-bottom: 24px;
        }
        .fv-title-group { display: flex; align-items: center; gap: 14px; }
        .fv-title-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.12));
          border: 1.5px solid rgba(168,85,247,0.25);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .fv-title-icon-wrap::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(168,85,247,0.1), transparent);
          animation: fv-pulse 3s ease-in-out infinite;
        }
        @keyframes fv-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .fv-title {
          font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f0e8ff 0%, #c084fc 40%, #ec4899 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin: 0; line-height: 1.1;
        }
        .fv-subtitle { color: var(--sub); font-size: 0.82rem; margin: 4px 0 0; font-weight: 400; }
        .fv-actions { display: flex; gap: 8px; align-items: center; }
        .fv-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--sub); cursor: pointer; transition: all 0.2s;
        }
        .fv-icon-btn:hover { border-color: var(--b-hover); color: #c084fc; background: rgba(168,85,247,0.06); }
        .fv-icon-btn.active { background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.35); color: #c084fc; }
        .fv-refresh-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08));
          border: 1px solid rgba(168,85,247,0.22);
          border-radius: 10px; color: #c084fc;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.25s;
        }
        .fv-refresh-btn:hover {
          background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.14));
          border-color: rgba(168,85,247,0.45); transform: translateY(-1px);
        }
        .fv-refresh-btn .fv-spin { animation: fv-rotate 0.8s linear infinite; }
        @keyframes fv-rotate { to { transform: rotate(360deg); } }

        /* ── stat cards ── */
        .fv-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 12px; margin-bottom: 28px;
        }
        .fv-stat-card {
          display: flex; align-items: center; gap: 14px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 16px 18px; transition: all 0.25s;
        }
        .fv-stat-card:hover { border-color: var(--b-hover); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .fv-stat-icon { width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .fv-stat-info { min-width:0; }
        .fv-stat-value { font-size:1.5rem;font-weight:800;margin:0;color:var(--text);line-height:1; }
        .fv-stat-label { font-size:0.72rem;color:var(--sub);margin:4px 0 0;font-weight:500; }
        .fv-stat-sub { font-size:0.65rem;color:var(--muted);margin:2px 0 0; }

        /* ── divider ── */
        .fv-divider {
          height: 1px; margin: 0 0 24px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.3) 20%, rgba(236,72,153,0.3) 50%, rgba(168,85,247,0.3) 80%, transparent);
        }

        /* ── controls ── */
        .fv-controls { display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px; }
        .fv-search-wrap { position:relative;flex:1;min-width:220px; }
        .fv-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;transition:color .2s; }
        .fv-search-wrap:focus-within .fv-search-icon { color:#a855f7; }
        .fv-search {
          width:100%;padding:10px 14px 10px 40px;background:var(--surface);
          border:1.5px solid var(--border);border-radius:12px;color:var(--text);
          font-size:0.85rem;outline:none;transition:all .2s;
        }
        .fv-search::placeholder { color:var(--muted); }
        .fv-search:focus { border-color:rgba(168,85,247,0.5);box-shadow:0 0 0 3px rgba(168,85,247,0.08); }
        .fv-search-clear {
          position:absolute;right:10px;top:50%;transform:translateY(-50%);
          width:22px;height:22px;border-radius:6px;background:rgba(168,85,247,0.1);
          border:none;color:var(--sub);display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all .2s;
        }
        .fv-search-clear:hover { background:rgba(168,85,247,0.2);color:#c084fc; }
        .fv-select-wrap { position:relative; }
        .fv-select {
          padding:10px 36px 10px 14px;background:var(--surface);
          border:1.5px solid var(--border);border-radius:12px;
          color:var(--sub);font-size:0.82rem;outline:none;appearance:none;
          cursor:pointer;transition:all .2s;font-weight:500;
        }
        .fv-select:focus { border-color:rgba(168,85,247,0.5);color:var(--text);box-shadow:0 0 0 3px rgba(168,85,247,0.08); }
        .fv-select-icon { position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none; }
        .fv-result-count {
          padding:7px 14px;border-radius:999px;background:rgba(168,85,247,0.08);
          border:1px solid rgba(168,85,247,0.2);color:#c084fc;
          font-size:0.74rem;font-weight:700;white-space:nowrap;
        }

        /* ── filter pills ── */
        .fv-filter-bar {
          display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;
          padding:14px 16px;background:var(--surface);
          border:1px solid var(--border);border-radius:14px;
          animation:fv-slide-down .3s ease;
        }
        @keyframes fv-slide-down { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .fv-filter-pill {
          display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
          border-radius:999px;background:transparent;border:1px solid var(--border);
          color:var(--sub);font-size:0.78rem;font-weight:600;cursor:pointer;
          transition:all .2s;white-space:nowrap;
        }
        .fv-filter-pill:hover { border-color:var(--b-hover);color:var(--text); }
        .fv-filter-active { font-weight:700; }
        .fv-pill-count { font-size:0.68rem;padding:1px 6px;border-radius:999px;background:rgba(255,255,255,0.06);font-weight:700; }
        .fv-filter-label { font-size:0.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-right:4px;display:flex;align-items:center;gap:5px; }

        /* ── stars ── */
        .fv-stars-wrap { display:inline-flex;align-items:center;gap:6px; }
        .fv-stars-row { display:inline-flex;gap:2px; }
        .fv-stars-value {
          font-size:0.78rem;font-weight:700;color:var(--yellow);
          background:rgba(250,204,21,0.08);padding:2px 7px;border-radius:6px;
        }

        /* ── card list ── */
        .fv-list { display:flex;flex-direction:column;gap:14px; }
        @keyframes fv-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .fv-card {
          display:flex;background:var(--card);border:1px solid var(--border);
          border-radius:16px;overflow:hidden;
          animation:fv-slide-up .4s cubic-bezier(.4,0,.2,1) both;transition:all .25s;
        }
        .fv-card:hover { border-color:var(--b-hover);background:var(--card-h);box-shadow:0 8px 32px rgba(168,85,247,0.08);transform:translateY(-2px); }
        .fv-card-stripe { width:4px;flex-shrink:0; }
        .fv-card-body { padding:20px 22px;flex:1;min-width:0; }
        .fv-card-top { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px; }
        .fv-card-left { display:flex;align-items:flex-start;gap:14px;min-width:0; }
        .fv-type-icon-wrap { width:42px;height:42px;border-radius:12px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .fv-card-info { min-width:0; }
        .fv-card-title { font-size:0.95rem;font-weight:700;color:var(--text);margin:0 0 6px;line-height:1.3; }
        .fv-card-meta-row { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
        .fv-dot { color:var(--muted);font-size:0.6rem; }
        .fv-type-badge { display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:999px;border:1px solid;white-space:nowrap; }
        .fv-time-badge { display:inline-flex;align-items:center;gap:4px;font-size:0.72rem;color:var(--muted);font-weight:500; }

        .fv-card-right-col {
          display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;
        }

        .fv-date-pill {
          display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
          border-radius:10px;background:rgba(168,85,247,0.06);
          border:1px solid rgba(168,85,247,0.12);color:var(--sub);
          font-size:0.72rem;font-weight:500;white-space:nowrap;flex-shrink:0;
        }
        .fv-card-content {
          background:rgba(0,0,0,0.15);border:1px solid rgba(168,85,247,0.06);
          border-radius:12px;padding:14px 16px;
        }
        .fv-card-text { font-size:0.87rem;color:#b8aed4;line-height:1.7;margin:0;word-break:break-word; }
        .fv-expand-btn {
          background:none;border:none;color:#a855f7;font-size:0.76rem;font-weight:600;
          margin-top:8px;padding:0;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:color .2s;
        }
        .fv-expand-btn:hover { color:#ec4899; }

        /* ── rating bar ── */
        .fv-rating-bar-wrap {
          display:flex;align-items:center;gap:12px;margin-top:12px;
        }
        .fv-rating-bar-track {
          flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,0.04);
          overflow:hidden;
        }
        .fv-rating-bar-fill {
          height:100%;border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1);
        }
        .fv-rating-bar-label {
          font-size:0.68rem;font-weight:600;color:var(--sub);white-space:nowrap;
        }

        /* ── grid view ── */
        .fv-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px; }
        .fv-grid-card {
          background:var(--card);border:1px solid var(--border);border-radius:16px;
          overflow:hidden;animation:fv-slide-up .4s cubic-bezier(.4,0,.2,1) both;
          transition:all .25s;display:flex;flex-direction:column;
        }
        .fv-grid-card:hover { border-color:var(--b-hover);background:var(--card-h);box-shadow:0 8px 32px rgba(168,85,247,0.08);transform:translateY(-3px); }
        .fv-grid-stripe { height:3px;width:100%; }
        .fv-grid-body { padding:18px 20px;flex:1;display:flex;flex-direction:column; }
        .fv-grid-top { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px; }
        .fv-grid-title { font-size:1rem;font-weight:700;color:var(--text);margin:0 0 10px;line-height:1.3; }
        .fv-grid-desc { font-size:0.85rem;color:#b8aed4;line-height:1.65;margin:0;flex:1;word-break:break-word; }
        .fv-grid-footer {
          display:flex;align-items:center;justify-content:space-between;
          margin-top:14px;padding-top:12px;border-top:1px solid var(--border);
        }
        .fv-date-text { display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;color:var(--muted);font-weight:500; }

        /* ── empty state ── */
        .fv-empty {
          text-align:center;padding:72px 28px;background:var(--surface);
          border:1px solid var(--border);border-radius:20px;
        }
        .fv-empty-icon-wrap {
          width:72px;height:72px;border-radius:20px;margin:0 auto 24px;
          background:linear-gradient(135deg,rgba(168,85,247,0.08),rgba(236,72,153,0.06));
          border:1.5px solid rgba(168,85,247,0.18);display:flex;align-items:center;justify-content:center;
        }
        .fv-empty h3 { font-size:1.1rem;font-weight:700;color:var(--text);margin:0 0 8px; }
        .fv-empty p { font-size:0.85rem;color:var(--sub);max-width:360px;margin:0 auto;line-height:1.6; }

        /* ── skeleton ── */
        @keyframes fv-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .fv-skeleton {
          background:linear-gradient(90deg,var(--surface) 25%,var(--card) 50%,var(--surface) 75%);
          background-size:600px 100%;animation:fv-shimmer 1.4s infinite linear;border-radius:8px;
        }
        .fv-skel-card { background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;display:flex; }
        .fv-skel-stripe { width:4px;background:var(--card-h);flex-shrink:0; }
        .fv-skel-body { padding:20px 22px;flex:1;display:flex;flex-direction:column;gap:12px; }
        .fv-skel-row { display:flex;gap:12px;align-items:center; }

        /* ── responsive ── */
        @media(max-width:640px){
          .fv-root{padding:18px 12px 40px}
          .fv-card-top{flex-direction:column;gap:8px}
          .fv-card-right-col{flex-direction:row;align-items:center;flex-wrap:wrap}
          .fv-date-pill{align-self:flex-start}
          .fv-stats-grid{grid-template-columns:repeat(2,1fr)}
          .fv-grid{grid-template-columns:1fr}
          .fv-header-row{flex-direction:column;align-items:flex-start}
          .fv-title{font-size:1.3rem}
        }
      `}</style>

      <div className="fv-root rounded-xl">
        {/* ── header ── */}
        <div className="fv-header">
          <div className="fv-header-row">
            <div className="fv-title-group">
              <div className="fv-title-icon-wrap">
                <Sparkles size={22} color="#c084fc" />
              </div>
              <div>
                <h2 className="fv-title">Feedback Hub</h2>
                <p className="fv-subtitle">
                  Track and manage all user feedback for your club
                </p>
              </div>
            </div>
            <div className="fv-actions">
              <button
                className={`fv-icon-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >
                <LayoutList size={16} />
              </button>
              <button
                className={`fv-icon-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className="fv-refresh-btn"
                onClick={fetchFeedbacks}
              >
                <RefreshCw
                  size={14}
                  className={loading ? 'fv-spin' : ''}
                />
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* stats */}
          {!loading && feedbacks.length > 0 && (
            <div className="fv-stats-grid">
              <StatCard
                icon={<MessageSquare />}
                label="Total Feedback"
                value={feedbacks.length}
                accent="#a855f7"
              />
              <StatCard
                icon={<Star />}
                label="Avg Rating"
                value={`${avgRating} / 5`}
                accent="#facc15"
                sub={`${fiveStarCount} five-star ratings`}
              />
              {typeCounts.Appreciation > 0 && (
                <StatCard
                  icon={<Heart />}
                  label="Appreciations"
                  value={typeCounts.Appreciation}
                  accent="#4ade80"
                />
              )}
              {typeCounts.Complaint > 0 && (
                <StatCard
                  icon={<AlertTriangle />}
                  label="Complaints"
                  value={typeCounts.Complaint}
                  accent="#f87171"
                />
              )}
              {typeCounts.Suggestion > 0 && (
                <StatCard
                  icon={<Lightbulb />}
                  label="Suggestions"
                  value={typeCounts.Suggestion}
                  accent="#facc15"
                />
              )}
            </div>
          )}
        </div>

        <div className="fv-divider" />

        {/* ── controls ── */}
        {!loading && (
          <>
            <div className="fv-controls">
              <div className="fv-search-wrap">
                <Search size={16} className="fv-search-icon" />
                <input
                  className="fv-search"
                  placeholder="Search by title or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="fv-search-clear"
                    onClick={() => setSearch('')}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="fv-select-wrap">
                <select
                  className="fv-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="rating-hi">Rating: High → Low</option>
                  <option value="rating-lo">Rating: Low → High</option>
                </select>
                <ArrowUpDown size={12} className="fv-select-icon" />
              </div>
              <button
                className={`fv-icon-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters((v) => !v)}
                title="Toggle filters"
              >
                <SlidersHorizontal size={16} />
              </button>
              <span className="fv-result-count">
                {visible.length} of {feedbacks.length}
              </span>
            </div>

            {showFilters && (
              <div className="fv-filter-bar">
                <span className="fv-filter-label">
                  <Filter size={12} /> Type
                </span>
                <FilterPill
                  active={filterType === 'all'}
                  label="All"
                  count={feedbacks.length}
                  onClick={() => setFilterType('all')}
                  color="#a855f7"
                />
                {Object.keys(TYPE_CONFIG).map((type) => {
                  const cfg = TYPE_CONFIG[type];
                  const count = typeCounts[type] || 0;
                  if (count === 0) return null;
                  return (
                    <FilterPill
                      key={type}
                      active={filterType === type}
                      label={cfg.label}
                      count={count}
                      onClick={() => setFilterType(type)}
                      color={cfg.color}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── content ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="fv-skel-card">
                <div className="fv-skel-stripe" />
                <div className="fv-skel-body">
                  <div className="fv-skel-row">
                    <div
                      className="fv-skeleton"
                      style={{ width: 42, height: 42, borderRadius: 12 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        className="fv-skeleton"
                        style={{ height: 14, width: '50%', marginBottom: 8 }}
                      />
                      <div
                        className="fv-skeleton"
                        style={{ height: 10, width: '30%' }}
                      />
                    </div>
                  </div>
                  <div
                    className="fv-skeleton"
                    style={{ height: 12, width: '90%' }}
                  />
                  <div
                    className="fv-skeleton"
                    style={{ height: 12, width: '70%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="fv-empty">
            <div className="fv-empty-icon-wrap">
              <Inbox size={30} color="#6b4fa0" />
            </div>
            <h3>
              {feedbacks.length === 0
                ? 'No feedback yet'
                : 'No matching feedback'}
            </h3>
            <p>
              {feedbacks.length === 0
                ? 'Feedback submitted by users will appear here. Share your events and encourage participants to share their thoughts!'
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="fv-grid">
            {visible.map((fb, i) => (
              <FeedbackCard
                key={fb._id}
                fb={fb}
                index={i}
                view="grid"
                rating={ratingMap[fb._id]}
              />
            ))}
          </div>
        ) : (
          <div className="fv-list">
            {visible.map((fb, i) => (
              <FeedbackCard
                key={fb._id}
                fb={fb}
                index={i}
                view="list"
                rating={ratingMap[fb._id]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FeedbackView;