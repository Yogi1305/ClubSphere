// src/components/ClubCard.jsx
import { Check } from "lucide-react";

export default function ClubCard({ image, category, tagline, title, description, activities, buttonText, color, quote }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl">
      {/* Image */}
      <img src={image} alt={title} className="w-full h-56 object-cover" />

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full`}
          style={{ backgroundColor: `${color}15`, color }}
        >
          {category}
        </span>

        {/* Title & Tagline */}
        <h3 className="text-2xl font-bold mt-3">{title}</h3>
        <p className="text-sm font-medium mt-1" style={{ color }}>{tagline}</p>

        {/* Description */}
        <p className="text-gray-600 mt-3">{description}</p>

        {/* Activities */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800">Activities:</h4>
          <ul className="mt-2 space-y-2 text-gray-600">
            {activities.map((activity, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          className="w-full mt-6 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
        >
          {buttonText}
        </button>

        {/* Quote */}
        <p className="text-xs text-gray-500 mt-4 italic">"{quote}"</p>
      </div>
    </div>
  );
}
