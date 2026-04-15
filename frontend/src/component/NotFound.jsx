import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Go Home", to: "/" },
  { label: "Explore Contests", to: "/contest" },
  { label: "View Clubs", to: "/club/hobby" },
];

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-violet-900/30">
          404
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Page not found
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">
          This route doesn't exist.
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed">
          The page you are trying to open may have been moved, renamed, or the URL may be incorrect.
          Use one of the links below to continue browsing ClubSphere.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left text-sm text-slate-400 md:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-200">Check the URL</p>
            <p className="mt-1">Make sure there are no typos in the address.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Use navigation</p>
            <p className="mt-1">Return to a known page through the app menu.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Keep your progress</p>
            <p className="mt-1">No feature logic or user data has been changed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
