import { useState } from "react";

const COUNCILS = [
  "Hobby Club",
  "Cultural Council",
  "Literary Council",
];

const ATTEND_OPTIONS = [
  { value: "definitely", label: "Definitely" },
  { value: "probably", label: "Probably" },
  { value: "unsure", label: "Not Sure" },
  { value: "probably_not", label: "Probably Not" },
  { value: "no", label: "No" },
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "2rem", padding: "2px", lineHeight: 1,
            color: star <= (hover || value) ? "#a855f7" : "#D1D5DB",
            transform: star <= (hover || value) ? "scale(1.2)" : "scale(1)",
            transition: "all 0.15s ease",
            filter: star <= (hover || value) ? "drop-shadow(0 0 4px #a855f788)" : "none",
          }}
        >★</button>
      ))}
      {(hover || value) > 0 && (
        <span style={{
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontSize: "0.82rem", fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginLeft: "8px"
        }}>
          {labels[hover || value]}
        </span>
      )}
    </div>
  );
}

function AttendLikelihood({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {ATTEND_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: "8px 18px", borderRadius: "40px", border: "2px solid",
            borderColor: value === opt.value ? "#a855f7" : "#E5E7EB",
            background: value === opt.value ? "linear-gradient(135deg, #a855f7, #ec4899)" : "#fff",
            color: value === opt.value ? "#fff" : "#6B7280",
            cursor: "pointer", fontSize: "0.82rem",
            fontFamily: "'Nunito', sans-serif", fontWeight: 600,
            transition: "all 0.2s ease",
            boxShadow: value === opt.value ? "0 4px 15px #a855f740" : "none",
          }}
        >{opt.label}</button>
      ))}
    </div>
  );
}

export default function EventFeedbackForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    council: "", eventName: "", participantName: "",
    year: "", rating: 0, attendAgain: "",
    eventFeedback: "", appFeedback: "",
  });
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.council) e.council = "Please select a council.";
    if (!form.eventName) e.eventName = "Please select an event.";
    if (!form.rating) e.rating = "Please give a rating.";
    if (!form.attendAgain) e.attendAgain = "Please select an option.";
    if (!form.eventFeedback.trim()) e.eventFeedback = "Please share your feedback.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      metadata: {
        council: form.council,
        event_name: form.eventName,
        participant_name: form.participantName || null,
        year: form.year || null,
        submitted_at: new Date().toISOString(),
      },
      quantitative: {
        overall_rating: form.rating,
        rating_max: 5,
        attend_again_likelihood: form.attendAgain,
      },
      sentiment_targets: [
        { field_id: "event_feedback", label: "Event Experience", text: form.eventFeedback },
        { field_id: "app_feedback", label: "App / Platform Experience", text: form.appFeedback || null },
      ],
    };
    setSubmittedData(payload);
    setStep(1);
    console.log("Feedback payload (sentiment-analysis ready):", JSON.stringify(payload, null, 2));
  };

  const getInputStyle = (field) => ({
    width: "100%", background: "#fff",
    border: "2px solid",
    borderColor: errors[field] ? "#f87171" : focusedField === field ? "#a855f7" : "#E5E7EB",
    borderRadius: "10px", padding: "11px 16px",
    color: "#111827", fontSize: "0.92rem",
    fontFamily: "'Nunito', sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusedField === field ? "0 0 0 3px #a855f720" : "none",
  });

  const labelStyle = {
    display: "block", color: "#374151", fontSize: "0.82rem",
    fontFamily: "'Nunito', sans-serif", fontWeight: 700,
    letterSpacing: "0.02em", marginBottom: "7px",
  };
  const fieldWrap = { display: "flex", flexDirection: "column", gap: "4px" };
  const errStyle = { color: "#ef4444", fontSize: "0.73rem", fontFamily: "'Nunito', sans-serif", fontWeight: 600 };
  const optStyle = { color: "#9CA3AF", fontWeight: 600 };

  /* ── Success screen ── */
  if (step === 1) {
    return (
      <>
        <style>{fonts}</style>
        <div style={pageStyle}>
          <div style={cardStyle}>
            <div style={{ textAlign: "center" }}>
              <Logo />
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "24px auto 20px", fontSize: "1.8rem", color: "#fff",
                boxShadow: "0 8px 25px #a855f740"
              }}>✓</div>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#111827", marginBottom: "10px" }}>
                Feedback Submitted!
              </h2>
              <p style={{ color: "#6B7280", fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "340px", margin: "0 auto 24px" }}>
                Thanks for sharing your thoughts on{" "}
                <strong style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {submittedData.metadata.event_name}
                </strong>. Your feedback helps us improve!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "28px" }}>
                <SummaryChip label="Rating" value={`${submittedData.quantitative.overall_rating} / 5 ★`} />
                <SummaryChip label="Attend Again" value={submittedData.quantitative.attend_again_likelihood} />
              </div>
              <button
                onClick={() => { setForm({ council: "", eventName: "", participantName: "", year: "", rating: 0, attendAgain: "", eventFeedback: "", appFeedback: "" }); setStep(0); setErrors({}); }}
                style={submitBtn}
              >
                Submit Another Response
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main form ── */
  return (
    <>
      <style>{fonts}</style>
      <div style={pageStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <Logo />
            <div style={{ marginTop: "16px" }}>
              <h1 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)", color: "#111827",
                margin: "0 0 6px", lineHeight: 1.2
              }}>
                Event Feedback Form
              </h1>
              <p style={{ color: "#9CA3AF", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", margin: 0 }}>
                Help us make every event better for you.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <SectionLabel>Event Details</SectionLabel>

            {/* Council */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Organising Council <Req /></label>
              <div style={{ position: "relative" }}>
                <select
                  value={form.council}
                  onChange={(e) => set("council", e.target.value)}
                  onFocus={() => setFocusedField("council")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...getInputStyle("council"), appearance: "none", cursor: "pointer", paddingRight: "36px" }}
                >
                  <option value="">— Select Council —</option>
                  {COUNCILS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <Chevron />
              </div>
              {errors.council && <span style={errStyle}>⚠ {errors.council}</span>}
            </div>

            {/* Event */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Event Name <Req /></label>
              <input
                type="text"
                placeholder="Enter the event name…"
                value={form.eventName}
                onChange={(e) => set("eventName", e.target.value)}
                onFocus={() => setFocusedField("eventName")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("eventName")}
              />
              {errors.eventName && <span style={errStyle}>⚠ {errors.eventName}</span>}
            </div>

            {/* Name + Year */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={fieldWrap}>
                <label style={labelStyle}>Your Name <span style={optStyle}>(optional)</span></label>
                <input
                  type="text" placeholder="Anonymous"
                  value={form.participantName}
                  onChange={(e) => set("participantName", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("name")}
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Year <span style={optStyle}>(optional)</span></label>
                <div style={{ position: "relative" }}>
                  <select
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    onFocus={() => setFocusedField("year")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...getInputStyle("year"), appearance: "none", cursor: "pointer", paddingRight: "36px" }}
                  >
                    <option value="">— Year —</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <Chevron />
                </div>
              </div>
            </div>

            <SectionLabel>Your Rating</SectionLabel>

            {/* Stars */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Overall Event Experience <Req /></label>
              <div style={{ padding: "12px 16px", background: "#FAFAFA", borderRadius: "10px", border: `2px solid ${errors.rating ? "#f87171" : "#E5E7EB"}` }}>
                <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
              </div>
              {errors.rating && <span style={errStyle}>⚠ {errors.rating}</span>}
            </div>

            {/* Attend Again */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Would you attend a similar event again? <Req /></label>
              <div style={{ padding: "12px 16px", background: "#FAFAFA", borderRadius: "10px", border: `2px solid ${errors.attendAgain ? "#f87171" : "#E5E7EB"}` }}>
                <AttendLikelihood value={form.attendAgain} onChange={(v) => set("attendAgain", v)} />
              </div>
              {errors.attendAgain && <span style={errStyle}>⚠ {errors.attendAgain}</span>}
            </div>

            <SectionLabel>Open Feedback</SectionLabel>

            {/* Event Feedback */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What did you think of the event? <Req /></label>
              <textarea
                rows={4}
                placeholder="Share what you loved, what could be improved, standout moments, suggestions…"
                value={form.eventFeedback}
                onChange={(e) => set("eventFeedback", e.target.value)}
                onFocus={() => setFocusedField("eventFeedback")}
                onBlur={() => setFocusedField(null)}
                style={{ ...getInputStyle("eventFeedback"), resize: "vertical", minHeight: "100px" }}
              />
              {errors.eventFeedback && <span style={errStyle}>⚠ {errors.eventFeedback}</span>}
            </div>

            {/* App Feedback */}
            <div style={fieldWrap}>
              <label style={labelStyle}>
                Any feedback on the{" "}
                <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
                  ClubSphere
                </span>{" "}
                app experience? <span style={optStyle}>(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Registration flow, UI issues, features you'd like to see, navigation improvements…"
                value={form.appFeedback}
                onChange={(e) => set("appFeedback", e.target.value)}
                onFocus={() => setFocusedField("appFeedback")}
                onBlur={() => setFocusedField(null)}
                style={{ ...getInputStyle("appFeedback"), resize: "vertical", minHeight: "80px" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={submitBtn}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px #a855f760"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px #a855f740"; }}
            >
              Submit Feedback
            </button>

            <p style={{ color: "#C4B5C4", fontFamily: "'Nunito', sans-serif", fontSize: "0.72rem", textAlign: "center", margin: 0 }}>
              Responses are structured for sentiment analysis · Fields marked <span style={{ color: "#ef4444" }}>*</span> are required
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─── Helpers ─── */
function Logo() {
  return (
    <span style={{
      fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1.6rem",
      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      letterSpacing: "-0.02em",
    }}>ClubSphere</span>
  );
}

function Req() {
  return <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>;
}

function Chevron() {
  return (
    <span style={{
      position: "absolute", right: "14px", top: "50%",
      transform: "translateY(-50%)", pointerEvents: "none",
      color: "#9CA3AF", fontSize: "0.8rem"
    }}>▾</span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ flex: 1, height: "1.5px", background: "linear-gradient(90deg, #a855f730, transparent)" }} />
      <span style={{
        background: "linear-gradient(135deg, #a855f7, #ec4899)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontFamily: "'Nunito', sans-serif", fontWeight: 800,
        fontSize: "0.7rem", letterSpacing: "0.14em",
        textTransform: "uppercase", whiteSpace: "nowrap",
      }}>{children}</span>
      <div style={{ flex: 1, height: "1.5px", background: "linear-gradient(90deg, transparent, #ec489930)" }} />
    </div>
  );
}

function SummaryChip({ label, value }) {
  return (
    <div style={{
      background: "#F9FAFB", border: "1.5px solid #E5E7EB",
      borderRadius: "12px", padding: "10px 18px", textAlign: "center"
    }}>
      <div style={{ color: "#9CA3AF", fontFamily: "'Nunito', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
      <div style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.92rem" }}>{value}</div>
    </div>
  );
}

/* ─── Styles ─── */
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(150deg, #fdf4ff 0%, #fff0f9 50%, #f5f3ff 100%)",
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  padding: "40px 16px 60px",
};

const cardStyle = {
  width: "100%", maxWidth: "560px",
  background: "#ffffff",
  border: "1.5px solid #EDE0F5",
  borderRadius: "20px", padding: "36px 32px",
  boxShadow: "0 4px 40px #a855f715, 0 1px 3px #0000000a",
};

const submitBtn = {
  width: "100%", padding: "14px",
  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
  border: "none", borderRadius: "12px",
  color: "#fff", fontSize: "0.95rem",
  fontFamily: "'Nunito', sans-serif", fontWeight: 800,
  letterSpacing: "0.03em", cursor: "pointer",
  boxShadow: "0 4px 20px #a855f740",
  transition: "all 0.2s ease", display: "block",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  select option { font-family: 'Nunito', sans-serif; background: #fff; color: #111827; }
  textarea, input, select { font-family: 'Nunito', sans-serif !important; }
`;