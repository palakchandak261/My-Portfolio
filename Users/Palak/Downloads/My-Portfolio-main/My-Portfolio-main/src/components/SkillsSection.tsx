import { Code2, Layout, Server, Database, GitBranch, Wrench, Sparkles } from "lucide-react";

const skillCategories = [
  {
    icon: Code2,
    title: "Programming Languages",
    gradient: "from-violet-500 to-purple-600",
    glow: "hover:shadow-violet-500/20",
    border: "hover:border-violet-500/40",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    pillBg: "bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/40",
    skills: ["C++", "Python", "JavaScript", "Dart", "C"],
  },
  {
    icon: Layout,
    title: "Front-End Development",
    gradient: "from-pink-500 to-rose-600",
    glow: "hover:shadow-pink-500/20",
    border: "hover:border-pink-500/40",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    pillBg: "bg-pink-500/10 border-pink-500/20 text-pink-300 hover:bg-pink-500/20 hover:border-pink-400/40",
    skills: ["React.js", "Flutter", "HTML / CSS", "Tailwind CSS", "Bootstrap"],
  },
  {
    icon: Server,
    title: "Back-End Development",
    gradient: "from-cyan-500 to-blue-600",
    glow: "hover:shadow-cyan-500/20",
    border: "hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    pillBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40",
    skills: ["Node.js", "Express.js", "FastAPI", "Flask", "REST APIs"],
  },
  {
    icon: Database,
    title: "Databases & Storage",
    gradient: "from-emerald-500 to-teal-600",
    glow: "hover:shadow-emerald-500/20",
    border: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    pillBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/40",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "LocalStorage API"],
  },
  {
    icon: GitBranch,
    title: "Version Control & DevOps",
    gradient: "from-amber-500 to-orange-500",
    glow: "hover:shadow-amber-500/20",
    border: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    pillBg: "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/40",
    skills: ["Git", "GitHub", "Docker", "Prometheus", "WebSocket"],
  },
  {
    icon: Wrench,
    title: "Tools & Platforms",
    gradient: "from-indigo-500 to-blue-600",
    glow: "hover:shadow-indigo-500/20",
    border: "hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    pillBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/40",
    skills: ["VS Code", "Postman", "HuggingFace", "Gemini AI", "Arduino"],
  },
];

const alsoFamiliarWith = [
  { name: "EJS",           color: "from-orange-500 to-amber-500" },
  { name: "JWT",           color: "from-green-500 to-emerald-500" },
  { name: "bcrypt",        color: "from-red-500 to-rose-500" },
  { name: "Leaflet.js",    color: "from-teal-500 to-cyan-500" },
  { name: "Chart.js",      color: "from-pink-500 to-fuchsia-500" },
  { name: "Web Speech API",color: "from-violet-500 to-purple-500" },
  { name: "SVG",           color: "from-sky-500 to-blue-500" },
  { name: "MVC",           color: "from-indigo-500 to-violet-500" },
  { name: "SHA-256",       color: "from-slate-400 to-gray-500" },
  { name: "WebSocket",     color: "from-cyan-500 to-blue-500" },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="px-6 md:px-10 relative z-10 max-w-5xl">

        {/* ── Section label + heading ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary tracking-widest uppercase mb-4">
            <Sparkles size={12} className="animate-pulse" />
            Expertise
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-2">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            A comprehensive overview of my technical expertise and tools I work with
          </p>
        </div>

        {/* ── 3-column category cards ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className={`group glass border border-border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl card-shadow ${cat.glow} ${cat.border}`}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-5">
                {/* Gradient icon box */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon size={18} className="text-white" />
                </div>
                <h3 className={`font-display font-bold text-sm bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent leading-tight`}>
                  {cat.title}
                </h3>
              </div>

              {/* Skill pills — 2 per row */}
              <div className="grid grid-cols-2 gap-2">
                {cat.skills.map((skill) => (
                  <div
                    key={skill}
                    className={`border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-150 cursor-default ${cat.pillBg}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Also familiar with ── */}
        <div className="glass border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Code2 size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-foreground">Also Familiar With</h3>
              <p className="text-xs text-muted-foreground">Additional tools & libraries</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {alsoFamiliarWith.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden glass border border-border rounded-full px-3.5 py-1.5 cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
              >
                {/* Gradient shimmer on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-full`} />
                <span className="relative text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
