import { useState } from "react";
import { ExternalLink, Github, ArrowRight, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

// Project image placeholder component
const ProjectImage = ({
  gradient,
  icon,
  title,
  src,
}: {
  gradient: string;
  icon: string;
  title: string;
  src?: string;
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        <div className="flex-1 mx-3 h-3.5 bg-white/10 rounded-full" />
      </div>
      <div className="absolute top-10 left-4 right-4 space-y-2 opacity-30">
        <div className="h-2 bg-white/40 rounded w-3/4" />
        <div className="h-2 bg-white/30 rounded w-1/2" />
        <div className="h-2 bg-white/20 rounded w-2/3" />
      </div>
      <div className="text-5xl drop-shadow-2xl z-10 mt-4">{icon}</div>
      <div className="text-white/70 text-xs font-medium mt-2 z-10 tracking-wide">{title}</div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
    </div>
  );
};

const featuredProjects = [
  {
    id: "twinforge",
    title: "TwinForge",
    subtitle: "AI-Powered Digital Twin Code Optimization",
    year: "2026",
    category: "AI / Full-Stack",
    tech: ["React.js", "Flask", "Python", "PostgreSQL", "Docker", "WebSocket"],
    description:
      "Zero-risk autonomous IT system that tests every fix on a shadow digital twin before touching production. AI-powered anomaly detection, tournament-based fix selection, and confidence-score deployment gating.",
    points: [
      "Shadow digital twins for zero-risk autonomous testing before production deployment",
      "AI anomaly detection, root cause analysis, and tournament-based fix selection",
      "Real-time WebSocket dashboard with Prometheus metrics and trend prediction",
    ],
    github: "https://github.com/sonali110806/TwinForge",
    imgSrc: "/projects/twinforge.png",
    color: "from-indigo-500 to-purple-600",
    icon: "🤖",
    featured: true,
    rating: 5,
  },
  {
    id: "pocket-court",
    title: "Pocket Court",
    subtitle: "AI Legal Awareness App for Indian Citizens",
    year: "2026",
    category: "Mobile / AI",
    tech: ["Flutter", "Node.js", "MongoDB", "Gemini AI", "JWT"],
    description:
      "Full-stack mobile app with 101 Indian laws across 12 categories, AI legal assistant powered by Google Gemini 2.0 Flash, emergency SOS with 6 helplines, and offline bookmark system.",
    points: [
      "101 Indian laws across 12 categories with AI assistant in Hindi & English",
      "Emergency SOS with tap-to-call for Women (181), Cyber Crime (1930), Police (100)",
      "JWT auth, bcrypt (12 rounds), rate limiting, Gemini API secured on backend",
    ],
    github: "https://github.com/palakchandak261/Pocket-Court-App",
    imgSrc: "/projects/pocket-court.png",
    color: "from-purple-500 to-pink-600",
    icon: "⚖️",
    featured: true,
    rating: 5,
  },
  {
    id: "contradiction-ledger",
    title: "Semantic Contradiction Ledger",
    subtitle: "AI Contradiction Detection + Blockchain",
    year: "2026",
    category: "AI / NLP",
    tech: ["Python", "FastAPI", "DeBERTa", "MiniLM", "Docker", "SHA-256"],
    description:
      "Upload any PDF, DOCX, or TXT — the system detects 7 types of contradictions using NLI transformers, scores semantic similarity, shows word-level diffs, and records every analysis on a SHA-256 blockchain.",
    points: [
      "NLI contradiction detection using CrossEncoder nli-deberta-v3-base transformer",
      "7 contradiction types: Negation, Numeric, Temporal, Semantic, Logical, Entity",
      "Custom SHA-256 blockchain — every analysis permanently recorded as immutable block",
    ],
    github: "https://github.com/palakchandak261/Contradiction-Ledger",
    link: "https://palakchandak25-contradiction-ledger.hf.space",
    imgSrc: "/projects/contradiction-ledger.png",
    color: "from-red-500 to-orange-500",
    icon: "🔗",
    featured: true,
    rating: 5,
  },
  {
    id: "foodie-hub",
    title: "Foodie Hub",
    subtitle: "Full-Stack Food Ordering System",
    year: "2025",
    category: "Full-Stack Web",
    tech: ["Node.js", "MySQL", "EJS", "Bootstrap 5", "Leaflet.js"],
    description:
      "Complete food ordering platform with live order tracking on a real map, animated scratch-card coupons, reward points system, and multiple payment options including UPI and QR code.",
    points: [
      "Real-time order tracking with Leaflet.js — rider animating toward you over 30 seconds",
      "Animated scratch cards with 7-day expiry and reward points (1000 pts = ₹50 OFF)",
      "COD, UPI (PhonePe/GPay/Paytm), QR Code payments with live coupon validation",
    ],
    github: "https://github.com/palakchandak261/Foodie-Hub1",
    link: "https://foodiehub-ib7u.onrender.com",
    imgSrc: "/projects/foodie-hub.png",
    color: "from-orange-400 to-red-500",
    icon: "🍕",
    featured: false,
    rating: 4,
  },
  {
    id: "tree-visualizer",
    title: "Advanced Tree Visualizer",
    subtitle: "Voice-Narrated DSA Visualizer with C++ Backend",
    year: "2026",
    category: "DSA / Visualization",
    tech: ["C++", "Node.js", "SVG", "Chart.js", "Web Speech API"],
    description:
      "Interactive visualizer for BST, AVL, Red-Black, B-Tree, and B+ Tree with all logic in C++, bridged to Node.js via JSON pipe. Voice narration, step-by-step replay, and statistical comparison charts.",
    points: [
      "All tree logic in C++ bridged to Node.js via child_process stdin/stdout JSON pipe",
      "Voice narration using Web Speech API — narrates every rotation, recoloring, split/merge",
      "Quiz mode, preset scenarios, shareable URL, SVG export, keyboard shortcuts",
    ],
    github: "https://github.com/palakchandak261/Advanced-Tree-Rotation-Visualizer",
    link: "https://advanced-tree-rotation-visualizer-s.vercel.app",
    imgSrc: "/projects/tree-visualizer.png",
    color: "from-emerald-400 to-cyan-500",
    icon: "🌳",
    featured: false,
    rating: 4,
  },
  {
    id: "os-simulator",
    title: "MULTI/PROG OS Simulator",
    subtitle: "Multiprogramming OS Visual Simulator",
    year: "2026",
    category: "Systems / Academic",
    tech: ["React 18", "TypeScript", "Tailwind CSS", "Vite"],
    description:
      "Browser-based OS simulator covering Paging, Interrupt Handling (SI/PI/TI), and FCFS CPU Scheduling across 3 phases with visual Gantt timeline, memory frame view, and page table.",
    points: [
      "3 phases: basic execution → paging + interrupts → multiprogramming with FCFS scheduling",
      "Visual Gantt CPU timeline, physical memory frame view, virtual→physical page table",
      "Pure TypeScript simulator engine — zero external dependencies for OS logic",
    ],
    github: "https://github.com/palakchandak261/os-control-panel",
    imgSrc: "/projects/os-simulator.png",
    color: "from-blue-500 to-cyan-500",
    icon: "🖥️",
    featured: false,
    rating: 4,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={11}
        className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
      />
    ))}
  </div>
);

const ProjectsSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const featured = featuredProjects.filter((p) => p.featured);
  const rest = featuredProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section label + heading */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">PORTFOLIO</p>
          <div className="flex items-end gap-4 mb-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <div className="h-1 flex-1 max-w-xs bg-gradient-primary rounded-full mb-3 hidden sm:block" />
          </div>
          <p className="text-muted-foreground max-w-xl">
            From AI systems and mobile apps to full-stack platforms — projects that solve real problems.
          </p>
        </div>

        {/* Featured top 3 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {featured.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative glass border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-3 card-3d"
            >
              {/* Featured badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-primary/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                <Star size={10} className="fill-white" /> Featured
              </div>

              {/* Image area */}
              <div className="relative h-44 overflow-hidden">
                <ProjectImage
                  gradient={project.color}
                  icon={project.icon}
                  title={project.title}
                  src={project.imgSrc}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Github size={13} /> Code
                    </a>
                  )}
                  {"link" in project && project.link && (
                    <a
                      href={project.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
                    >
                      <Play size={11} className="fill-white" /> Live Demo
                    </a>
                  )}
                </div>
                {/* Year + rating */}
                <div className="absolute top-3 right-3 glass border border-white/10 px-2 py-1 rounded-full">
                  <StarRating rating={project.rating} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {project.points.map((point, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">▹</span>
                      <span className="line-clamp-1">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs bg-secondary text-primary font-medium px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary row */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {rest.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group glass border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 card-shadow"
            >
              <div className="relative h-32 overflow-hidden">
                <ProjectImage
                  gradient={project.color}
                  icon={project.icon}
                  title={project.title}
                  src={project.imgSrc}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 glass border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <Github size={13} />
                    </a>
                  )}
                  {"link" in project && project.link && (
                    <a
                      href={project.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary font-medium">{project.year}</span>
                  <StarRating rating={project.rating} />
                </div>
                <h3 className="font-display text-base font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-secondary text-primary font-medium px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2.5 btn-shimmer text-white px-9 py-4 rounded-xl font-semibold shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-transform duration-200"
          >
            View All 9 Projects <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-muted-foreground mt-3 opacity-70">
            Including Smart Kitchen System, Red Light Override &amp; MediSure
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
