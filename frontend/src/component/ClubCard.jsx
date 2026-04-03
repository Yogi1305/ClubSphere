// src/components/ClubCard.jsx
import { Check } from "lucide-react";

export default function ClubCard({ image, category, tagline, title, description, activities, buttonText, color, quote }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
      style={{
        background: '#111122',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(139,92,246,0.42)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
      }}
    >
      {/* Image with bottom fade */}
      <div className="relative flex-shrink-0">
        <img src={image} alt={title} className="w-full h-56 object-cover" />
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #111122, transparent)' }}
        />
      </div>

      {/* Content — flex col, grows to fill card height */}
      <div className="p-6 flex flex-col flex-1">

        {/* Category Badge */}
        <span
          className="text-sm font-medium px-3 py-1 rounded-full self-start"
          style={{
            backgroundColor: `${color}18`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          {category}
        </span>

        {/* Title */}
        <h3
          className="text-2xl font-bold mt-3"
          style={{ color: '#eeeeff', fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h3>

        {/* Tagline */}
        <p className="text-sm font-medium mt-1" style={{ color }}>
          {tagline}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed" style={{ color: '#7272a0' }}>
          {description}
        </p>

        {/* Thin divider */}
        <div
          className="my-4"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.22), transparent)',
          }}
        />

        {/* Activities — grows to push button down */}
        <div className="flex-1">
          <h4
            className="font-semibold text-xs uppercase tracking-widest mb-3"
            style={{ color: '#5a5a8a', fontFamily: "'Syne', sans-serif" }}
          >
            Activities
          </h4>
          <ul className="space-y-2">
            {activities.map((activity, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#9090b8' }}>
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(52,211,153,0.1)',
                    border: '1px solid rgba(52,211,153,0.22)',
                  }}
                >
                  <Check className="h-3 w-3" style={{ color: '#6ee7b7' }} />
                </span>
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button — pinned to bottom via mt-auto */}
        <button
          className="w-full mt-auto pt-6 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            boxShadow: '0 4px 18px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
            fontFamily: "'DM Sans', sans-serif",
            marginTop: '1.5rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.88';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.55)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)';
          }}
        >
          {buttonText}
        </button>

        {/* Quote */}
        <p
          className="text-xs mt-4 italic text-center leading-relaxed"
          style={{ color: '#3d3d62' }}
        >
          "{quote}"
        </p>

      </div>
    </div>
  );
}