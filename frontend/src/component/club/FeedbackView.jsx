// import React from 'react'

// const FeedbackView = () => {
//   return (
//     <div>FeedbackView

//         underdevelopment ....
//         this page will show all feedbacks given by users to the club admins
        
//     </div>
//   )
// }

// export default FeedbackView
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Baseurl } from '../../main';
import {
  Star, MessageSquare, Calendar, User, Building2,
  TrendingUp, BarChart2, ThumbsUp, Filter, Search,
  ChevronDown, RefreshCw, Inbox,
} from 'lucide-react';

/* ─── helpers ───────────────────────────────────── */
const ATTEND_LABEL = {
  definitely:    { label: 'Definitely',    color: '#4ade80' },
  probably:      { label: 'Probably',      color: '#a3e635' },
  unsure:        { label: 'Not Sure',       color: '#facc15' },
  probably_not:  { label: 'Probably Not',  color: '#fb923c' },
  no:            { label: 'No',            color: '#f87171' },
};

/* ─── mock data (replace with real API call) ─────── */
const MOCK = [
  {
    _id: '1',
    metadata: { council:'Hobby Club', event_name:'Techathon 2025', participant_name:'Priya Sharma', year:'2023', submitted_at:'2025-03-10T10:30:00Z' },
    quantitative: { overall_rating:5, attend_again_likelihood:'definitely' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'Absolutely fantastic event! The workshops were incredibly well organized and the mentors were super helpful. Learned so much about web development and got to network with so many talented people.' },
      { field_id:'app_feedback',   label:'App Experience',   text:'The registration process was smooth. Would love a calendar integration feature.' },
    ],
  },
  {
    _id: '2',
    metadata: { council:'Hobby Club', event_name:'Photography Walk', participant_name:'Arjun Mehta', year:'2024', submitted_at:'2025-03-11T14:00:00Z' },
    quantitative: { overall_rating:4, attend_again_likelihood:'probably' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'Great experience overall. The locations chosen for the photography walk were scenic and inspiring. Could have had better time management between stops.' },
      { field_id:'app_feedback',   label:'App Experience',   text:null },
    ],
  },
  {
    _id: '3',
    metadata: { council:'Hobby Club', event_name:'Open Mic Night', participant_name:null, year:'2022', submitted_at:'2025-03-12T09:15:00Z' },
    quantitative: { overall_rating:5, attend_again_likelihood:'definitely' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'One of the best open mic nights I have attended. The energy in the room was electric, the acts were diverse and the crowd was so supportive. Please do this every semester!' },
      { field_id:'app_feedback',   label:'App Experience',   text:'App worked perfectly, no issues at all.' },
    ],
  },
  {
    _id: '4',
    metadata: { council:'Dramatic Club', event_name:'Annual Drama Fest', participant_name:'Sneha Kapoor', year:'2023', submitted_at:'2025-03-13T16:45:00Z' },
    quantitative: { overall_rating:3, attend_again_likelihood:'unsure' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'The performances were good but the venue was too cramped. Seating arrangements need improvement. The sound system also had some issues in the second half.' },
      { field_id:'app_feedback',   label:'App Experience',   text:'Had trouble with the event registration page loading slowly on mobile.' },
    ],
  },
  {
    _id: '5',
    metadata: { council:'Hobby Club', event_name:'Hackathon Spring', participant_name:'Rohan Verma', year:'2024', submitted_at:'2025-03-14T11:00:00Z' },
    quantitative: { overall_rating:4, attend_again_likelihood:'definitely' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'The hackathon was intense in the best way possible. The problem statements were challenging and relevant. Food could have been better for an overnight event though!' },
      { field_id:'app_feedback',   label:'App Experience',   text:null },
    ],
  },
  {
    _id: '6',
    metadata: { council:'Hobby Club', event_name:'Techathon 2025', participant_name:'Meera Joshi', year:'2022', submitted_at:'2025-03-15T08:30:00Z' },
    quantitative: { overall_rating:2, attend_again_likelihood:'probably_not' },
    sentiment_targets: [
      { field_id:'event_feedback', label:'Event Experience', text:'Expected more structured workshops. The schedule kept changing and communication was poor. The venue was good but overall execution needs a lot of improvement.' },
      { field_id:'app_feedback',   label:'App Experience',   text:'Notifications were not working properly. Did not receive reminders.' },
    ],
  },
];

/* ─── star renderer ──────────────────────────────── */
const Stars = ({ value, size = 14 }) => (
  <span style={{ display:'inline-flex', gap:2 }}>
    {[1,2,3,4,5].map(n => (
      <Star key={n} size={size}
        fill={n <= value ? '#facc15' : 'transparent'}
        color={n <= value ? '#facc15' : '#3d3550'}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

/* ─── single feedback card ───────────────────────── */
const FeedbackCard = ({ fb, index }) => {
  const [expanded, setExpanded] = useState(false);
  const attend = ATTEND_LABEL[fb.quantitative.attend_again_likelihood] || { label:'Unknown', color:'#9d8fc0' };
  const eventText = fb.sentiment_targets.find(t => t.field_id === 'event_feedback')?.text || '';
  const appText   = fb.sentiment_targets.find(t => t.field_id === 'app_feedback')?.text;
  const dateStr   = new Date(fb.metadata.submitted_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const isLong    = eventText.length > 180;
  const displayText = isLong && !expanded ? eventText.slice(0, 180) + '…' : eventText;

  return (
    <div className="fv-card" style={{ animationDelay: `${index * 60}ms` }}>

      {/* left rating stripe */}
      <div className="fv-card-stripe" style={{
        background: fb.quantitative.overall_rating >= 4
          ? 'linear-gradient(180deg,#a855f7,#ec4899)'
          : fb.quantitative.overall_rating === 3
          ? 'linear-gradient(180deg,#facc15,#fb923c)'
          : 'linear-gradient(180deg,#f87171,#ef4444)',
      }} />

      <div className="fv-card-body">

        {/* ── top row ── */}
        <div className="fv-card-top">
          <div className="fv-card-meta">
            {/* avatar */}
            <div className="fv-avatar">
              {fb.metadata.participant_name
                ? fb.metadata.participant_name.charAt(0).toUpperCase()
                : '?'}
            </div>
            <div>
              <p className="fv-name">
                {fb.metadata.participant_name || 'Anonymous'}
                {fb.metadata.year && (
                  <span className="fv-year-chip">Batch {fb.metadata.year}</span>
                )}
              </p>
              <p className="fv-sub">{dateStr}</p>
            </div>
          </div>

          <div className="fv-card-right">
            <Stars value={fb.quantitative.overall_rating} size={15} />
            <span className="fv-attend-chip" style={{ color: attend.color, borderColor: attend.color + '44', background: attend.color + '12' }}>
              {attend.label}
            </span>
          </div>
        </div>

        {/* ── event + council badges ── */}
        <div className="fv-badges">
          <span className="fv-badge fv-badge-event">
            <Calendar size={11} /> {fb.metadata.event_name}
          </span>
          <span className="fv-badge fv-badge-council">
            <Building2 size={11} /> {fb.metadata.council}
          </span>
        </div>

        {/* ── event feedback text ── */}
        <div className="fv-feedback-block">
          <span className="fv-block-label"><MessageSquare size={12} /> Event Experience</span>
          <p className="fv-feedback-text">{displayText}</p>
          {isLong && (
            <button className="fv-expand-btn" onClick={() => setExpanded(v => !v)}>
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>

        {/* ── app feedback ── */}
        {appText && (
          <div className="fv-feedback-block fv-app-block">
            <span className="fv-block-label" style={{ color:'#c084fc' }}>
              <TrendingUp size={12} /> App Feedback
            </span>
            <p className="fv-feedback-text" style={{ color:'#9d8fc0' }}>{appText}</p>
          </div>
        )}

      </div>
    </div>
  );
};

/* ─── stat chip ──────────────────────────────────── */
const StatChip = ({ icon, label, value, accent }) => (
  <div className="fv-stat">
    <div className="fv-stat-icon" style={{ background: accent + '18', border:`1px solid ${accent}30` }}>
      {React.cloneElement(icon, { size:18, color: accent })}
    </div>
    <div>
      <p className="fv-stat-val">{value}</p>
      <p className="fv-stat-lbl">{label}</p>
    </div>
  </div>
);

/* ─── main component ─────────────────────────────── */
const FeedbackView = ({ club }) => {
  const [feedbacks, setFeedbacks]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterCouncil, setFilterCouncil] = useState('all');
  const [sortBy, setSortBy]           = useState('newest');

  /* fetch – swap MOCK for real API when ready */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // const res = await axios.get(`${Baseurl}/event/feedbacks/${club}`, { withCredentials:true });
        // setFeedbacks(res.data.feedbacks);
        await new Promise(r => setTimeout(r, 600)); // simulate network
        setFeedbacks(MOCK);
      } catch {
        setFeedbacks(MOCK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [club]);

  /* derived stats */
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.quantitative.overall_rating, 0) / feedbacks.length).toFixed(1)
    : 0;
  /* filtering + sorting */
  const visible = feedbacks
    .filter(f => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        f.metadata.participant_name?.toLowerCase().includes(q) ||
        f.metadata.event_name.toLowerCase().includes(q) ||
        f.sentiment_targets.some(t => t.text?.toLowerCase().includes(q));
      const matchRating  = filterRating === 'all'   || f.quantitative.overall_rating === Number(filterRating);
      const matchCouncil = filterCouncil === 'all'  || f.metadata.council === filterCouncil;
      return matchSearch && matchRating && matchCouncil;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')     return new Date(b.metadata.submitted_at) - new Date(a.metadata.submitted_at);
      if (sortBy === 'oldest')     return new Date(a.metadata.submitted_at) - new Date(b.metadata.submitted_at);
      if (sortBy === 'rating-hi')  return b.quantitative.overall_rating - a.quantitative.overall_rating;
      if (sortBy === 'rating-lo')  return a.quantitative.overall_rating - b.quantitative.overall_rating;
      return 0;
    });

  return (
    <>
      <style>{`
        /* ── tokens ── */
        .fv-root {
          --bg:      #0e0c16;
          --surface: #14121f;
          --card:    #1a1727;
          --card-h:  #201d30;
          --border:  rgba(168,85,247,0.14);
          --b-hover: rgba(168,85,247,0.38);
          --purple:  #a855f7;
          --pink:    #ec4899;
          --text:    #ede8ff;
          --sub:     #8b7fac;
          --muted:   #4e4669;
          --yellow:  #facc15;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100%;
          padding: 32px 28px 60px;
        }

        /* ── header ── */
        .fv-header { margin-bottom: 32px; }
        .fv-header-top {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 16px;
          margin-bottom: 24px;
        }
        .fv-title-row { display:flex; align-items:center; gap:12px; }
        .fv-title-icon {
          width:44px; height:44px; border-radius:12px;
          background:linear-gradient(135deg,rgba(168,85,247,0.2),rgba(236,72,153,0.15));
          border:1px solid rgba(168,85,247,0.3);
          display:flex; align-items:center; justify-content:center;
        }
        .fv-title {
          font-size:1.5rem; font-weight:800; letter-spacing:-0.02em;
          background:linear-gradient(135deg,#f0e8ff,#c084fc,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; margin:0;
        }
        .fv-subtitle { color:var(--sub); font-size:0.82rem; margin:4px 0 0; }

        .fv-refresh-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 16px;
          background:rgba(168,85,247,0.08);
          border:1px solid rgba(168,85,247,0.22);
          border-radius:10px; color:#c084fc;
          font-size:0.8rem; font-weight:600;
          transition:background 0.2s, border-color 0.2s;
        }
        .fv-refresh-btn:hover { background:rgba(168,85,247,0.15); border-color:rgba(168,85,247,0.45); }

        /* ── stats bar ── */
        .fv-stats {
          display:flex; gap:14px; flex-wrap:wrap; margin-bottom:28px;
        }
        .fv-stat {
          display:flex; align-items:center; gap:12px;
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:14px; padding:14px 20px;
          flex:1; min-width:140px;
          transition:border-color 0.2s, transform 0.2s;
        }
        .fv-stat:hover { border-color:var(--b-hover); transform:translateY(-2px); }
        .fv-stat-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .fv-stat-val { font-size:1.35rem; font-weight:800; margin:0; color:var(--text); line-height:1; }
        .fv-stat-lbl { font-size:0.73rem; color:var(--sub); margin:4px 0 0; }

        /* ── separator ── */
        .fv-sep {
          width:100%; height:1px; margin:0 0 24px;
          background:linear-gradient(90deg,transparent,rgba(168,85,247,0.4) 30%,rgba(236,72,153,0.4) 60%,transparent);
          position:relative;
        }
        .fv-sep::after {
          content:''; position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%) rotate(45deg);
          width:5px; height:5px; border-radius:1px;
          background:linear-gradient(135deg,#a855f7,#ec4899);
          box-shadow:0 0 8px rgba(168,85,247,0.9);
        }

        /* ── controls ── */
        .fv-controls {
          display:flex; gap:10px; flex-wrap:wrap; align-items:center;
          margin-bottom:24px;
        }
        .fv-search-wrap {
          position:relative; flex:1; min-width:200px;
        }
        .fv-search-icon {
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          color:var(--muted); pointer-events:none;
        }
        .fv-search {
          width:100%; padding:9px 12px 9px 36px;
          background:var(--surface); border:1px solid var(--border);
          border-radius:10px; color:var(--text); font-size:0.85rem;
          outline:none;
          transition:border-color 0.2s;
        }
        .fv-search::placeholder { color:var(--muted); }
        .fv-search:focus { border-color:rgba(168,85,247,0.5); }

        .fv-select {
          padding:9px 32px 9px 12px;
          background:var(--surface); border:1px solid var(--border);
          border-radius:10px; color:var(--sub); font-size:0.82rem;
          outline:none; appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b5f8c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 10px center;
          transition:border-color 0.2s;
        }
        .fv-select:focus { border-color:rgba(168,85,247,0.5); color:var(--text); }

        .fv-count-badge {
          padding:6px 12px; border-radius:999px;
          background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.25);
          color:#c084fc; font-size:0.75rem; font-weight:700;
          white-space:nowrap;
        }

        /* ── card list ── */
        .fv-list { display:flex; flex-direction:column; gap:16px; }

        @keyframes fv-slide-up {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .fv-card {
          display:flex;
          background:var(--card);
          border:1px solid var(--border);
          border-radius:18px; overflow:hidden;
          animation:fv-slide-up 0.45s cubic-bezier(.4,0,.2,1) both;
          transition:border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .fv-card:hover {
          border-color:var(--b-hover);
          background:var(--card-h);
          box-shadow:0 6px 28px rgba(168,85,247,0.12);
          transform:translateY(-2px);
        }

        .fv-card-stripe { width:4px; flex-shrink:0; }
        .fv-card-body   { padding:20px 22px; flex:1; min-width:0; }

        /* top row */
        .fv-card-top {
          display:flex; align-items:flex-start;
          justify-content:space-between; gap:12px; margin-bottom:12px;
        }
        .fv-card-meta { display:flex; align-items:center; gap:12px; }
        .fv-avatar {
          width:38px; height:38px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,rgba(168,85,247,0.25),rgba(236,72,153,0.2));
          border:1px solid rgba(168,85,247,0.3);
          display:flex; align-items:center; justify-content:center;
          font-size:0.95rem; font-weight:700; color:#c084fc;
        }
        .fv-name {
          font-size:0.9rem; font-weight:700; color:var(--text);
          margin:0; display:flex; align-items:center; gap:7px; flex-wrap:wrap;
        }
        .fv-year-chip {
          font-size:0.68rem; font-weight:600; padding:2px 8px;
          background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.25);
          border-radius:999px; color:#a78bdb;
        }
        .fv-sub { font-size:0.72rem; color:var(--muted); margin:3px 0 0; }

        .fv-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:7px; flex-shrink:0; }
        .fv-attend-chip {
          font-size:0.7rem; font-weight:700; padding:3px 9px;
          border-radius:999px; border:1px solid;
          white-space:nowrap;
        }

        /* badges */
        .fv-badges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
        .fv-badge {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:600; padding:4px 10px;
          border-radius:8px;
        }
        .fv-badge-event   { background:rgba(236,72,153,0.10); color:#f472b6; border:1px solid rgba(236,72,153,0.2); }
        .fv-badge-council { background:rgba(168,85,247,0.10); color:#c084fc; border:1px solid rgba(168,85,247,0.2); }

        /* feedback text blocks */
        .fv-feedback-block {
          background:rgba(0,0,0,0.18);
          border:1px solid rgba(168,85,247,0.1);
          border-radius:12px; padding:12px 14px; margin-bottom:10px;
        }
        .fv-app-block { border-color:rgba(168,85,247,0.08); }
        .fv-block-label {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.68rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.08em; color:#7c6fa0; margin-bottom:7px;
        }
        .fv-feedback-text {
          font-size:0.87rem; color:#b8aed4; line-height:1.65; margin:0;
        }
        .fv-expand-btn {
          background:none; border:none; color:#a855f7;
          font-size:0.76rem; font-weight:600;
          margin-top:6px; padding:0;
          transition:color 0.2s;
        }
        .fv-expand-btn:hover { color:#ec4899; }

        /* ── empty state ── */
        .fv-empty {
          text-align:center; padding:64px 24px;
          background:var(--surface); border:1px solid var(--border);
          border-radius:20px;
        }
        .fv-empty-icon {
          width:64px; height:64px; border-radius:18px; margin:0 auto 20px;
          background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.18);
          display:flex; align-items:center; justify-content:center;
        }
        .fv-empty h3 { font-size:1.05rem; font-weight:700; color:var(--text); margin:0 0 8px; }
        .fv-empty p  { font-size:0.85rem; color:var(--sub); margin:0; }

        /* ── skeleton loader ── */
        @keyframes fv-shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position:600px 0; }
        }
        .fv-skeleton {
          background:linear-gradient(90deg,var(--surface) 25%,var(--card) 50%,var(--surface) 75%);
          background-size:600px 100%;
          animation:fv-shimmer 1.4s infinite linear;
          border-radius:8px;
        }
        .fv-skel-card {
          background:var(--card); border:1px solid var(--border);
          border-radius:18px; overflow:hidden;
          display:flex; height:120px;
        }
        .fv-skel-stripe { width:4px; background:var(--card-h); flex-shrink:0; }
        .fv-skel-body   { padding:20px; flex:1; display:flex; flex-direction:column; gap:10px; }

        /* ── responsive ── */
        @media (max-width:640px) {
          .fv-root { padding:20px 14px 40px; }
          .fv-card-top  { flex-direction:column; }
          .fv-card-right{ flex-direction:row; align-items:center; }
          .fv-stats     { gap:10px; }
          .fv-stat      { padding:12px 14px; }
        }
      `}</style>

      <div className="fv-root rounded-xl ">

        {/* ── header ── */}
        <div className="fv-header">
          <div className="fv-header-top">
            <div>
              <div className="fv-title-row">
                <div className="fv-title-icon">
                  <MessageSquare size={20} color="#c084fc" />
                </div>
                <div>
                  <h2 className="fv-title">Feedback Dashboard</h2>
                  <p className="fv-subtitle">All user submissions for your club</p>
                </div>
              </div>
            </div>
            <button className="fv-refresh-btn" onClick={() => window.location.reload()}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* stats */}
          {!loading && (
            <div className="fv-stats">
              <StatChip icon={<MessageSquare />} label="Total Responses" value={feedbacks.length} accent="#a855f7" />
              <StatChip icon={<Star />}          label="Avg Rating"      value={`${avgRating} / 5`} accent="#facc15" />
              
            </div>
          )}
        </div>

        <div className="fv-sep" />

        {/* ── content ── */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="fv-skel-card">
                <div className="fv-skel-stripe" />
                <div className="fv-skel-body">
                  <div className="fv-skeleton" style={{ height:16, width:'40%' }} />
                  <div className="fv-skeleton" style={{ height:12, width:'60%' }} />
                  <div className="fv-skeleton" style={{ height:12, width:'80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="fv-empty">
            <div className="fv-empty-icon"><Inbox size={28} color="#6b4fa0" /></div>
            <h3>No feedbacks found</h3>
            <p>{search || filterRating !== 'all' || filterCouncil !== 'all'
              ? 'Try adjusting your filters or search term.'
              : 'No feedback has been submitted yet.'}</p>
          </div>
        ) : (
          <div className="fv-list">
            {visible.map((fb, i) => (
              <FeedbackCard key={fb._id} fb={fb} index={i} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};

export default FeedbackView;