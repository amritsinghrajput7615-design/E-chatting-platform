import { useState, useEffect, useRef } from "react";
import {api} from '../config/ProjectAxios.jsx'
import { useNavigate } from "react-router";

const NAV_ITEMS = ["Chats", "Friends", "Settings"];
const FEATURES = [
  {
    icon: "↔️",
    title: "Seamless Switching",
    desc: "Flip between private friend circles and group chats with a single gesture. No context switching, just flow.",
    dots: true,
  },
  {
    icon: "👾",
    title: "Group Chats",
    desc: "Create group spaces for your team. Collaborate, share, and keep the conversation going in real time.",
  },
  {
    icon: "⚡",
    title: "Warp Speed",
    desc: "Our interface is built for speed. 60fps animations and sub-100ms response times across the globe.",
  },
  {
    icon: "🛡️",
    title: "Fortified Privacy",
    desc: "Your data belongs to you. We use end-to-end encryption so your conversations stay private.",
    shield: true,
  },
];

/* ─── MODAL ─────────────────────────────────────────────────── */
function ProjectModal({ onClose, onStart }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleStart = async (e) => {
    e?.preventDefault();

    try {
      await api.post('/project/create', { name });
      onStart(name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#07070f] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/80 animate-modal-in">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors text-lg leading-none"
        >
          ✕
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
            N
          </div>
          <div>
            <p className="text-white font-bold text-base">Create New Project</p>
            <p className="text-white/35 text-xs">Name your project to begin</p>
          </div>
        </div>
        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2 block">
          Project Name
        </label>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          placeholder="e.g. Design System, Dev Ops, Marketing..."
          className="w-full bg-[#0b0b1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-500/40 focus:bg-[#0d1026] transition-all mb-5"
        />
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-cyan-500 text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────── */
function Navbar({ onLaunch }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#03030a]/95 backdrop-blur-md border-b border-white/[0.04]">
      <div className="flex items-center gap-8">
        <span className="font-black text-white text-lg tracking-tight">
          Nexus<span className="text-cyan-400">Chat</span>
        </span>
        <div className="hidden md:flex gap-6">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className={`text-sm font-medium transition-colors ${
                i === 0 ? "text-cyan-400 border-b border-cyan-400 pb-0.5" : "text-white/50 hover:text-white/90"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-[#0a0a12] rounded-full px-4 py-1.5 border border-white/[0.07]">
          <span className="text-white/30 text-sm">🔍</span>
          <input
            placeholder="Search Nexus..."
            className="bg-transparent text-sm text-white/60 outline-none w-32 placeholder:text-white/30"
          />
        </div>
        <button className="text-white/50 hover:text-white text-lg">🔔</button>
        <button
          onClick={onLaunch}
          className="hidden md:block bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all hover:scale-105"
        >
          + New Space
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
          U
        </div>
      </div>
    </nav>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────── */
function Sidebar({ onLaunch }) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-48 bg-[#04040b] border-r border-white/[0.04] flex flex-col py-4 z-40 hidden lg:flex">
      <button
        onClick={onLaunch}
        className="mx-4 mb-5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        + New Project
      </button>
      <div className="mt-auto px-2 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          📁 Archive
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          ❓ Support
        </button>
      </div>
    </aside>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/8 rounded-full blur-[140px]" />
    <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-fuchsia-600/8 rounded-full blur-[100px]" />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

const ProjectCard = ({ project, onClick }) => {
  const colors = [
    { ring: "border-cyan-500/30", dot: "bg-cyan-400", glow: "shadow-cyan-900/30", text: "text-cyan-300", bg: "bg-cyan-950/40" },
    { ring: "border-violet-500/30", dot: "bg-violet-400", glow: "shadow-violet-900/30", text: "text-violet-300", bg: "bg-violet-950/40" },
    { ring: "border-fuchsia-500/30", dot: "bg-fuchsia-400", glow: "shadow-fuchsia-900/30", text: "text-fuchsia-300", bg: "bg-fuchsia-950/40" },
  ];
  const c = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      onClick={onClick}
      className={`group relative flex-shrink-0 w-56 rounded-2xl border ${c.ring} bg-[#06080f] p-4 cursor-pointer
        transition-all duration-300 hover:-translate-y-1 hover:border-opacity-60
        shadow-lg ${c.glow} overflow-hidden`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg} border ${c.ring}`}>
          <svg className={`h-4 w-4 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
          </svg>
        </div>
        <span className={`h-2 w-2 rounded-full ${c.dot} shadow-md mt-1`} style={{ boxShadow: `0 0 6px 1px currentColor` }} />
      </div>

      <h3 className="font-semibold text-sm text-white/90 mb-1 truncate">{project.name}</h3>

      <div className="flex items-center gap-1.5 mt-2">
        <div className="flex">
          {(project.users || []).slice(0, 3).map((u, i) => (
            <div
              key={u._id || i}
              style={{ marginLeft: i === 0 ? 0 : -6, zIndex: i }}
              className={`relative flex h-5 w-5 items-center justify-center rounded-full border border-[#06080f] text-[8px] font-bold ${c.bg} ${c.text}`}
            >
              {(u.name || u.email || "U")[0].toUpperCase()}
            </div>
          ))}
          {(project.users?.length || 0) > 3 && (
            <div style={{ marginLeft: -6 }} className="flex h-5 w-5 items-center justify-center rounded-full border border-[#06080f] bg-white/5 text-[8px] text-white/40">
              +{project.users.length - 3}
            </div>
          )}
        </div>
        <span className="text-[10px] text-white/30">
          {project.users?.length || 0} collaborator{(project.users?.length || 0) !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className={`h-3.5 w-3.5 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
    <div className="h-12 w-12 rounded-2xl border border-cyan-500/20 bg-cyan-950/30 flex items-center justify-center mb-3">
      <svg className="h-5 w-5 text-cyan-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </div>
    <p className="text-xs text-white/30 leading-relaxed">No projects yet.<br />Create one to get started.</p>
  </div>
);

export const HeroSection = ({ onLaunch }) => {
  const [projects, setProjects] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/project/all")
      .then((res) => setProjects(res.data.projects || []))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden bg-[#03030a]">
      <GridBackground />

      {/* ── Badge ── */}
      <div
        className="mb-7 flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium backdrop-blur-sm"
        style={{ animation: "fadeUp 0.6s ease forwards", opacity: 0 }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        The Next Generation of Social Chat
      </div>

      {/* ── Headline ── */}
      <h1
        className="text-5xl md:text-7xl font-black text-white leading-[1.05] max-w-3xl tracking-tight"
        style={{ animation: "fadeUp 0.7s 0.1s ease forwards", opacity: 0 }}
      >
        Nexus Chat: Social{" "}
        <span className="italic bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Reimagined.
        </span>
      </h1>

      {/* ── Subtext ── */}
      <p
        className="mt-5 max-w-lg text-white/40 text-base leading-relaxed"
        style={{ animation: "fadeUp 0.7s 0.2s ease forwards", opacity: 0 }}
      >
        The social ecosystem where human creativity meets real-time collaboration.
        Chat, connect, and transcend traditional messaging.
      </p>

      {/* ── CTA ── */}
      <div
        className="mt-8"
        style={{ animation: "fadeUp 0.7s 0.3s ease forwards", opacity: 0 }}
      >
        <button
          onClick={onLaunch}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-violet-900/30 transition-all duration-200 hover:scale-[1.03] active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Create a Project
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>

      {/* ── Projects showcase card ── */}
      <div
        className="relative mt-14 w-full max-w-3xl"
        style={{ animation: "fadeUp 0.8s 0.4s ease forwards", opacity: 0 }}
      >
        <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#080d18] to-[#030308] shadow-2xl shadow-black/70 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400/60 animate-pulse" />
              <span className="text-xs text-white/30 font-medium tracking-wide">Your Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="relative p-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
            </div>

            {projects.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
              >
                {projects.map((project, i) => (
                  <div key={project._id} className="snap-start" style={{ animation: `fadeUp 0.5s ${0.05 * i}s ease forwards`, opacity: 0 }}>
                    <ProjectCard
                      project={project}
                      onClick={() => navigate("/project", { state: { project } })}
                    />
                  </div>
                ))}
              </div>
            )}

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-cyan-400/25 pointer-events-none"
                style={{
                  top: `${12 + Math.sin(i * 1.1) * 30}%`,
                  left: `${8 + (i * 16) % 85}%`,
                  animation: `pulse 2.5s ${i * 0.4}s infinite`,
                }}
              />
            ))}
          </div>

          {projects.length > 2 && (
            <div className="absolute bottom-6 right-0 w-16 h-full bg-gradient-to-l from-[#030308] to-transparent pointer-events-none rounded-r-3xl" />
          )}
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

/* ─── FEATURES ───────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white">Beyond Simple Messaging</h2>
        <p className="text-white/40 mt-2 text-sm">Designed for the next generation of digital nomads.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="group relative bg-[#06060e] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all hover:-translate-y-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-600 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl pointer-events-none" />
            <span className="text-2xl mb-4 block">{f.icon}</span>
            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            {f.dots && (
              <div className="flex gap-2 mt-5">
                {["bg-white/20", "bg-violet-500", "bg-white/20"].map((cls, j) => (
                  <div key={j} className={`w-7 h-7 rounded-full ${cls} border border-white/10`} />
                ))}
              </div>
            )}
            {f.shield && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#02020a]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Trusted by the <span className="text-cyan-400">Avant-Garde.</span>
          </h2>
          <div className="mt-8 bg-[#06060e] border border-white/[0.06] rounded-2xl p-6 max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/20 text-sm">🔒</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-cyan-400 text-xs">★</span>
                ))}
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic">
              "Nexus Chat changed how our dev team collaborates. The spaces keep everyone in sync and the conversations always flow."
            </p>
            <p className="mt-4 text-cyan-400 text-xs font-semibold">Alex Chen, Lead Designer</p>
          </div>
        </div>
        <div className="flex gap-4 flex-shrink-0">
          <div className="w-36 h-36 rounded-2xl bg-[#06060e] border border-white/[0.06] flex flex-col items-center justify-center gap-1">
            <span className="text-white font-black text-xl tracking-tight">NEX<span className="text-cyan-400">US</span></span>
            <span className="text-white/30 text-[9px] uppercase tracking-widest">Community</span>
          </div>
          <div className="w-36 h-36 rounded-2xl bg-[#06060e] border border-white/[0.06] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#060f1c] to-[#02020a] flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
                <span className="text-cyan-400/60 text-3xl">🌍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────── */
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 text-center">
          Get in <span className="text-cyan-400">Touch</span>
        </h2>
        <p className="text-white/40 text-sm text-center mb-10">Have questions? We'd love to hear from you.</p>
        <form onSubmit={handleSubmit} className="bg-[#05050d] border border-white/[0.06] rounded-2xl p-8 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Your name" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="bg-[#09091a] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/15 outline-none focus:border-cyan-500/40 focus:bg-[#0a0f22] transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what's on your mind..."
              required
              rows={5}
              className="bg-[#09091a] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/15 outline-none focus:border-cyan-500/40 focus:bg-[#0a0f22] transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${submitted ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90"}`}
          >
            {submitted ? "✓ Message Sent!" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#03030a]">
      <div>
        <p className="font-black text-white text-sm">nexus <span className="text-cyan-400">chat.</span></p>
        <p className="text-white/20 text-xs mt-1">© 2024 Nexus Chat. Connect with anyone, anywhere.</p>
      </div>
      <div className="flex gap-6 text-white/30 text-xs uppercase tracking-widest font-medium">
        {["Privacy", "Terms", "API", "Careers"].map((item) => (
          <button key={item} className="hover:text-white/60 transition-colors">{item}</button>
        ))}
      </div>
      <div className="flex gap-2">
        {["𝕏", "in"].map((icon) => (
          <button key={icon} className="w-8 h-8 rounded-lg bg-[#0a0a14] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-[#12121e] transition-all text-sm">
            {icon}
          </button>
        ))}
      </div>
    </footer>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function NexusChat() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleStart = (name) => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#03030a] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        h1,h2,h3 { font-family:'Syne',sans-serif; }
        @keyframes fade-in { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes modal-in { from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }
        .animate-modal-in { animation:modal-in 0.25s ease forwards; }
      `}</style>

      <Navbar onLaunch={() => setShowModal(true)} />
      <div className="lg:pl-48">
        <HeroSection onLaunch={() => setShowModal(true)} />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
      <Sidebar onLaunch={() => setShowModal(true)} />

      {showModal && (
        <ProjectModal onClose={() => setShowModal(false)} onStart={handleStart} />
      )}
    </div>
  );
}
