import { MapPin, GraduationCap, Code2, Trophy, Rocket, Sparkles } from "lucide-react";

const stats = [
  { value: "8.97", label: "CGPA", sub: "VIT Pune", color: "from-violet-500 to-purple-600", glow: "shadow-violet-500/25" },
  { value: "9+",   label: "Projects", sub: "Built & Deployed", color: "from-pink-500 to-rose-600", glow: "shadow-pink-500/25" },
  { value: "350+", label: "DSA Solved", sub: "LeetCode & more", color: "from-cyan-500 to-blue-600", glow: "shadow-cyan-500/25" },
  { value: "2+",   label: "Hackathons", sub: "National level", color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/25" },
];

const highlights = [
  { icon: GraduationCap, label: "B.Tech Computer Engineering", sub: "VIT Pune · 2024–Present", color: "from-violet-500 to-purple-600" },
  { icon: Code2,         label: "Full Stack Developer",        sub: "MERN · Flutter · Python",  color: "from-pink-500 to-rose-600" },
  { icon: Trophy,        label: "Tesseract'26 Runner-Up",      sub: "Inter-college Hackathon",   color: "from-amber-500 to-orange-500" },
  { icon: Rocket,        label: "AI / ML Enthusiast",          sub: "NLP · Digital Twins · LLMs", color: "from-cyan-500 to-blue-600" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />

      <div className="px-6 md:px-10 relative z-10 max-w-5xl">

        {/* ── Section label + heading ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary tracking-widest uppercase mb-4">
            <Sparkles size={12} className="animate-pulse" />
            Who I Am
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            About <span className="text-gradient">Me</span>
          </h2>
        </div>

        {/* ── Main two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* LEFT — Photo + stat cards */}
          <div className="flex-shrink-0 flex flex-col gap-5 w-full lg:w-auto">
            {/* Photo with gradient border */}
            <div className="relative mx-auto lg:mx-0">
              {/* Animated gradient border */}
              <div className="w-64 h-[300px] md:w-72 md:h-[340px] rounded-2xl p-[2px] bg-gradient-primary shadow-lg animate-pulse-glow">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="/professional.png"
                    alt="Palak Chandak"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-3 -right-3 glass border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-lg animate-float">
                Open to Work ✨
              </div>
              <div className="absolute -top-3 -left-3 glass border border-accent/30 px-3 py-1.5 rounded-full text-xs font-bold text-accent shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
                <MapPin size={10} className="inline mr-1" />Pune, India
              </div>
            </div>

            {/* Stat cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 w-64 md:w-72 mx-auto lg:mx-0">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`group glass border border-border rounded-xl p-3 text-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg ${s.glow}`}
                >
                  <div className={`font-display text-xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold text-foreground/90 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Bio + highlights */}
          <div className="flex-1 space-y-6">
            {/* Bio paragraphs */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Hi! I'm a passionate full-stack developer and Computer Engineering student at{" "}
                <span className="text-foreground font-semibold">Vishwakarma Institute of Technology, Pune</span>{" "}
                with a CGPA of{" "}
                <span className="text-gradient font-bold">8.97</span>. My journey in tech started
                during my college years, where I discovered my love for creating innovative solutions
                through code.
              </p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                I specialize in{" "}
                <span className="text-foreground font-medium">React, Node.js, Flutter, and Python</span>,
                with a keen interest in AI/ML systems. I've built projects ranging from an AI-powered
                legal awareness app to a voice-narrated data structure visualizer with a C++ backend —
                each solving a real problem for real users.
              </p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                I've solved{" "}
                <span className="text-foreground font-semibold">350+ DSA problems</span>, competed in
                national hackathons including ISRO's Bharatiya Antariksh Hackathon, and won{" "}
                <span className="text-foreground font-semibold">Runner-Up at Tesseract'26</span>. I'm
                always exploring new AI research and actively looking for opportunities where I can
                build things that matter.
              </p>
            </div>

            {/* Highlight cards — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="group glass border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 card-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <h.icon size={18} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{h.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="mailto:chandakpalak78@gmail.com"
                className="btn-shimmer text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
              >
                <Sparkles size={14} /> Get in Touch
              </a>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
                className="glass border border-border px-6 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                View Projects →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
