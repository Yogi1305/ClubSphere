import React, { useState } from "react";

const events = [
  "TechFest 2026",
  "Cultural Night",
  "Hackathon Spring",
  "Debate Championship",
  "Music Fest",
  "Sports Carnival",
  "Photography Walk",
  "Startup Summit",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Alumni"];

const categories = [
  "Organization & Planning",
  "Content & Activities",
  "Venue & Facilities",
  "Team & Volunteers",
  "Communication",
  "Overall Experience",
];

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-all duration-150 hover:scale-125 focus:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 transition-all duration-200"
            fill={star <= (hovered || value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            style={{
              color: star <= (hovered || value) ? "#ec4899" : "#374151",
              filter:
                star <= (hovered || value)
                  ? "drop-shadow(0 0 6px rgba(236,72,153,0.7))"
                  : "none",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-400 self-center">
        {value > 0 ? ["", "Poor", "Fair", "Good", "Great", "Excellent"][value] : "Tap to rate"}
      </span>
    </div>
  );
};

const LikelihoodSlider = ({ value, onChange }) => {
  const getColor = (v) => {
    if (v <= 3) return "#ef4444";
    if (v <= 6) return "#f59e0b";
    if (v <= 8) return "#8b5cf6";
    return "#ec4899";
  };

  const getLabel = (v) => {
    if (v === 0) return "Drag to rate";
    if (v <= 2) return "Very Unlikely";
    if (v <= 4) return "Unlikely";
    if (v <= 6) return "Maybe";
    if (v <= 8) return "Likely";
    return "Definitely!";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span
          className="text-2xl font-black tabular-nums transition-all duration-200"
          style={{ color: value > 0 ? getColor(value) : "#4b5563" }}
        >
          {value > 0 ? value : "—"}
          <span className="text-sm font-normal text-gray-500">/10</span>
        </span>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200"
          style={
            value > 0
              ? {
                  color: getColor(value),
                  borderColor: getColor(value) + "55",
                  backgroundColor: getColor(value) + "15",
                }
              : { color: "#4b5563", borderColor: "#374151", backgroundColor: "transparent" }
          }
        >
          {getLabel(value)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${getColor(value)} ${value * 10}%, #1f2937 ${value * 10}%)`,
          }}
        />
        <div className="flex justify-between mt-1.5 px-0.5">
          {[0, 2, 4, 6, 8, 10].map((n) => (
            <span key={n} className="text-[10px] text-gray-600">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Feedback() {
  const [form, setForm] = useState({
    event: "",
    year: "",
    rating: 0,
    category: "",
    suggestions: "",
    likelihood: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const focusStyle = (field) =>
    focused === field
      ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.12)] bg-white/[0.07]"
      : "border-white/10 hover:border-white/20";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center p-6">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center space-y-5 max-w-sm w-full">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Feedback Sent!</h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Thanks for rating{" "}
              <span className="text-violet-400 font-semibold">{form.event || "the event"}</span>.
              Your input shapes every future experience.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ event: "", year: "", rating: 0, category: "", suggestions: "", likelihood: 0 });
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center p-4 py-10 rounded-xl ">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-800/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-xl bg-[#1a0b2e]/50 backdrop-blur-xl border border-purple-500/30 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.4)] ">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]" />
          <span className="text-white font-black text-xl tracking-tight">ClubSphere</span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-4xl font-black text-white leading-none">
            Event<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              Feedback.
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-2.5 leading-relaxed">
            Rate your experience and help us build better communities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 1. Event Name */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">1</span>
              Event Name
            </label>
            <div className="relative">
              <select
                value={form.event}
                onChange={(e) => setForm({ ...form, event: e.target.value })}
                onFocus={() => setFocused("event")}
                onBlur={() => setFocused("")}
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 text-sm tracking-wide appearance-none cursor-pointer pr-10 ${focusStyle("event")}`}
              >
                <option value="" disabled className="bg-[#13131f] text-gray-500">Select an event…</option>
                {events.map((ev) => (
                  <option key={ev} value={ev} className="bg-[#13131f] text-white">{ev}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 2. Year */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">2</span>
              Year of Study
            </label>
            <div className="grid grid-cols-3 gap-2">
              {years.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setForm({ ...form, year: yr })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    form.year === yr
                      ? "bg-violet-600/25 border-violet-500 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                      : "bg-white/5 border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Rating */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">3</span>
              Overall Rating
            </label>
            <StarRating value={form.rating} onChange={(val) => setForm({ ...form, rating: val })} />
          </div>

          {/* 4. Feedback Category */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">4</span>
              Feedback Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-left transition-all duration-200 leading-tight ${
                    form.category === cat
                      ? "bg-pink-600/20 border-pink-500/60 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                      : "bg-white/5 border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Suggestions */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">5</span>
              Any Suggestions?
            </label>
            <textarea
              placeholder="What could we do better? Any ideas are welcome…"
              value={form.suggestions}
              onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
              onFocus={() => setFocused("suggestions")}
              onBlur={() => setFocused("")}
              rows={3}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 text-sm tracking-wide resize-none ${focusStyle("suggestions")}`}
            />
          </div>

          {/* 6. Likelihood to Join */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[9px] font-black">6</span>
              Likelihood to Join This Club
            </label>
            <LikelihoodSlider
              value={form.likelihood}
              onChange={(val) => setForm({ ...form, likelihood: val })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-widest uppercase bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 transition-all duration-300 shadow-[0_8px_32px_rgba(139,92,246,0.35)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Submit Feedback →
          </button>

          <p className="text-center text-gray-700 text-xs tracking-wide pb-2">
            Join 50,000+ students · ClubSphere
          </p>
        </form>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 10px rgba(139,92,246,0.6);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 0 10px rgba(139,92,246,0.6);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}