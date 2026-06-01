import { useState } from "react";
import { ExternalLink, Github, ArrowLeft, Star, Code2, Layers, Zap, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Same ProjectImage component as in ProjectsSection
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
    return <img src={src} alt={title} className="w-full h-full object-cover" loading="lazy" />;
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
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

const allProjects = [
  {
    id: "twinforge",
    title: "TwinForge",
    subtitle: "AI-Powered Digital Twin Code Optimization System",
    year: "2026",
    category: "AI / Full-Stack",
    rating: 5,
    status: "In Development",
    statusColor: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    tech: ["React.js", "Flask", "Python", "PostgreSQL", "Docker", "Prometheus", "WebSocket"],
    description:
      "TwinForge is a zero-risk autonomous IT system that tests every fix on a shadow digital twin before touching production. It creates multiple digital twins of code for parallel analysis and optimization using AI models.",
    points: [
      "Creates shadow digital twins of production systems for zero-risk autonomous testing",
      "AI-powered anomaly detection, root cause analysis, and fix generation pipeline",
      "Tournament-based approach where code variants compete to select the most efficient version",
      "Confidence-score gating ensures only validated fixes are deployed to production",
      "Real-time WebSocket dashboard with Prometheus metrics and trend prediction",
      "Docker-compose orchestration with Flask API, background worker, and AI agent",
    ],
    github: "https://github.com/sonali110806/TwinForge",
    imgSrc: "/projects/twinforge.png",
    color: "from-indigo-500 to-purple-600",
    icon: "🤖",
  },
  {
    id: "pocket-court",
    title: "Pocket Court",
    subtitle: "AI Legal Awareness App for Indian Citizens",
    year: "2026",
    category: "Mobile / AI",
    rating: 5,
    status: "Live",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["Flutter", "Node.js", "MongoDB Atlas", "Gemini AI", "JWT", "Express.js"],
    description:
      "A full-stack mobile app empowering Indian citizens with legal awareness. Features 101 Indian laws across 12 categories, an AI legal assistant powered by Google Gemini 2.0 Flash, and an emergency SOS system.",
    points: [
      "101 Indian laws across 12 categories — Traffic, Consumer Rights, Cyber Crime, Women Safety, Labour Rights and more",
      "AI Legal Assistant powered by Google Gemini 2.0 Flash with Hindi & English support",
      "Emergency SOS with tap-to-call for 6 helplines: Women (181), Cyber Crime (1930), Police (100)",
      "Full-text search with text highlighting, persistent search history, and popular suggestions",
      "Offline bookmark system with category filter chips and swipe-to-delete",
      "JWT auth with bcrypt (12 rounds), rate limiting, and Gemini API key secured on backend",
    ],
    github: "https://github.com/palakchandak261/Pocket-Court-App",
    imgSrc: "/projects/pocket-court.png",
    color: "from-purple-500 to-pink-600",
    icon: "⚖️",
  },
  {
    id: "contradiction-ledger",
    title: "Semantic Contradiction Ledger",
    subtitle: "AI Contradiction Detection with Blockchain Transparency",
    year: "2026",
    category: "AI / NLP",
    rating: 5,
    status: "Live on HuggingFace",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["Python", "FastAPI", "HuggingFace", "DeBERTa", "MiniLM", "Docker", "SHA-256 Blockchain"],
    description:
      "Upload any PDF, DOCX, or TXT — contracts, research, reports, transcripts. The Semantic Contradiction Ledger catalogs every internal conflict: numeric mismatches, broken logic, conflicting claims, and timelines that don't add up.",
    points: [
      "NLI-based contradiction detection using CrossEncoder nli-deberta-v3-base transformer model",
      "Semantic similarity scoring via SentenceTransformer all-MiniLM-L6-v2 (384-dim embeddings)",
      "Classifies 7 contradiction types: Negation, Numeric, Temporal, Semantic, Logical, Entity",
      "Word-level visual diff viewer showing exactly what changed (red = deleted, green = added)",
      "Custom SHA-256 blockchain ledger — every analysis permanently recorded as an immutable block",
      "Document version tracking — upload multiple versions, auto-compare against previous",
    ],
    github: "https://github.com/palakchandak261/Contradiction-Ledger",
    link: "https://palakchandak25-contradiction-ledger.hf.space",
    imgSrc: "/projects/contradiction-ledger.png",
    color: "from-red-500 to-orange-500",
    icon: "🔗",
  },
  {
    id: "foodie-hub",
    title: "Foodie Hub",
    subtitle: "Full-Stack Food Ordering System",
    year: "2025",
    category: "Full-Stack Web",
    rating: 4,
    status: "Live",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["Node.js", "Express.js", "MySQL", "EJS", "Bootstrap 5", "Leaflet.js", "Aiven Cloud"],
    description:
      "A complete food ordering web application with restaurant browsing, cart management, live order tracking on a real map, reward points system, and animated scratch-card gift coupons.",
    points: [
      "Browse restaurants with ratings, explore menus with category filter and live search",
      "Animated golden scratch cards revealing unique discount codes with 7-day expiry",
      "Real-time order tracking with Leaflet.js + OpenStreetMap — rider animating toward you over 30 seconds",
      "Reward points system: earn points = order total, accumulate 1000 → unlock ₹50 OFF",
      "Multiple payment options: COD, UPI (PhonePe/GPay/Paytm), QR Code scan & pay",
      "Admin panel for order management, bcrypt password hashing, session-based auth",
    ],
    github: "https://github.com/palakchandak261/Foodie-Hub1",
    link: "https://foodiehub-ib7u.onrender.com",
    imgSrc: "/projects/foodie-hub.png",
    color: "from-orange-400 to-red-500",
    icon: "🍕",
  },
  {
    id: "tree-visualizer",
    title: "Advanced Tree Rotation Visualizer",
    subtitle: "Voice-Narrated Interactive Data Structure Visualizer",
    year: "2026",
    category: "DSA / Visualization",
    rating: 4,
    status: "Live",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["C++", "Node.js", "Express.js", "SVG", "Chart.js", "Web Speech API", "HTML/CSS/JS"],
    description:
      "An interactive, voice-narrated visualizer for BST, AVL, Red-Black, B-Tree, and B+ Tree data structures — with all core logic implemented in C++, bridged to a Node.js backend via a custom JSON pipe architecture.",
    points: [
      "All tree logic (AVL, BST, Red-Black, B-Tree, B+ Tree) implemented in C++ for performance",
      "Custom C++ ↔ Node.js bridge via child_process stdin/stdout JSON pipe — no node-gyp needed",
      "Voice narration using Web Speech API — narrates every rotation, recoloring, split/merge",
      "Side-by-side comparison of BST vs AVL vs Red-Black with step-by-step replay",
      "Statistical comparison chart (height, rotations, recolorings) via Chart.js",
      "Quiz mode, preset scenarios, shareable URL, SVG export, keyboard shortcuts",
    ],
    github: "https://github.com/palakchandak261/Advanced-Tree-Rotation-Visualizer",
    link: "https://advanced-tree-rotation-visualizer-s.vercel.app",
    imgSrc: "/projects/tree-visualizer.png",
    color: "from-emerald-400 to-cyan-500",
    icon: "🌳",
  },
  {
    id: "os-simulator",
    title: "MULTI/PROG OS Simulator",
    subtitle: "Multiprogramming Operating System Visual Simulator",
    year: "2026",
    category: "Systems / Academic",
    rating: 4,
    status: "Live",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Custom Simulator Engine"],
    description:
      "A browser-based OS simulator implementing the classical VIT OS Lab Multiprogramming System — covering Paging, Interrupt Handling, and CPU Scheduling across three academic phases with full visual dashboards.",
    points: [
      "Phase 1: Basic single job execution with GD, PD, LR, SR, CR, BT, H instructions",
      "Phase 2: Demand paging, page table management, SI/PI/TI interrupt handling, page fault resolution",
      "Phase 3: Multiprogramming with FCFS scheduling, ready queue, context switching, PCB save/restore",
      "Visual Gantt-style CPU timeline, physical memory frame view, virtual→physical page table",
      "Job Control Language (JCL) input format with live execution log and interrupt events",
      "Pure TypeScript simulator engine — zero external dependencies for OS logic",
    ],
    github: "https://github.com/palakchandak261/os-control-panel",
    imgSrc: "/projects/os-simulator.png",
    color: "from-blue-500 to-cyan-500",
    icon: "🖥️",
  },
  {
    id: "smart-fridge",
    title: "Smart Kitchen System",
    subtitle: "Browser-Based Smart Fridge Inventory & Expiry Tracker",
    year: "2025",
    category: "Frontend / MVC",
    rating: 3,
    status: "Live",
    statusColor: "bg-green-400/20 text-green-400 border-green-400/30",
    tech: ["HTML5", "CSS3", "Vanilla JavaScript ES6+", "MVC Architecture", "LocalStorage API"],
    description:
      "A browser-based smart fridge inventory and expiry tracker built with vanilla HTML, CSS, and JavaScript using the MVC architecture pattern. Features 3D fridge animation, real-time expiry simulation, and nutrition dashboard.",
    points: [
      "3D fridge door open/close animation with inventory displayed inside",
      "Real-time expiry simulation: 1 day = 10 seconds with auto popup alerts",
      "Recipe suggestions for items expiring in 1 day, nutrition balance dashboard (7 food groups)",
      "Auto-generated shopping list for expired/expiring/low stock items with CSV export",
      "Kitchen stats: total units, waste rate %, items added/removed/expired across sessions",
      "Dark/light mode, localStorage persistence, fully responsive — pure MVC, zero frameworks",
    ],
    github: "https://github.com/palakchandak261/Smart-Fridge-System",
    imgSrc: "/projects/smart-fridge.png",
    color: "from-teal-400 to-green-500",
    icon: "🥬",
  },
  {
    id: "red-light-override",
    title: "Smart Traffic Signal Optimizer",
    subtitle: "Smart Traffic Signal Management System",
    year: "2025",
    category: "IOT + Web App",
    rating: 3,
    status: "Live",
    statusColor: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    tech: ["React.js", "Tailwind CSS", "Vite"],
  
  "description": "An IoT-enabled smart traffic signal management system that pairs an ESP32 hardware controller (IR sensors, RFID reader, 7-segment displays) with a React web dashboard for real-time adaptive traffic control, emergency vehicle priority, and red-light violation monitoring.",
  "points": [
    "IoT traffic signal system with ESP32 hardware and React dashboard",
    "Real-time visual traffic simulation with WebSocket state sync",
    "Override controls for emergency vehicle priority (RFID) and manual signal management",
    "Adaptive signal timing based on live IR sensor traffic density inputs",
    "Clean React-based responsive UI with hardware simulator mode"
  ]


    ,
    github: "https://github.com/palakchandak261/red-light-override",
    imgSrc: "/projects/red-light.png",
    color: "from-red-400 to-rose-500",
    icon: "🚦",
  },
  {
    id: "medisure",
    title: "MediSure",
    subtitle: "AI-Powered Healthcare & Insurance Assistant",
    year: "2026",
    category: "AI / Healthcare",
    rating: 4,
    status: "Live",
    statusColor: "bg-blue-400/20 text-blue-400 border-blue-400/30",
    tech: ["React.js", "Node.js", "MongoDB", "AI/ML", "NLP"],
    description:
      "An AI-powered healthcare assistant that helps users understand medical insurance policies, navigate claims, and get personalized health guidance — making healthcare more accessible and transparent.",
    points: [
      "AI-powered insurance policy analysis and claim guidance",
      "Personalized health recommendations based on user profile",
      "Natural language interface for complex insurance queries",
      "Document parsing for insurance policy understanding",
    ],
    imgSrc: "/projects/medisure.png",
    color: "from-sky-400 to-blue-600",
    icon: "🏥",
  },
];

const categories = ["All", "AI / Full-Stack", "Mobile / AI", "AI / NLP", "Full-Stack Web", "DSA / Visualization", "Systems / Academic", "Frontend / MVC", "Web App", "AI / Healthcare"];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={11} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 glass border border-border px-4 py-2 rounded-full w-fit">
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div className="max-w-3xl">
            <p className="text-primary font-medium mb-3 flex items-center gap-2 text-sm tracking-widest uppercase">
              <Code2 size={14} /> All Projects
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Things I've <span className="text-gradient">Built</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From AI-powered systems and full-stack web apps to mobile applications and data structure visualizers — each project solves a real problem.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { icon: <Layers size={16} />, label: "Total Projects", value: allProjects.length },
              { icon: <Zap size={16} />, label: "Live Demos", value: allProjects.filter(p => (p as any).link).length },
              { icon: <Star size={16} />, label: "5-Star Projects", value: allProjects.filter(p => p.rating === 5).length },
            ].map((stat) => (
              <div key={stat.label} className="glass border border-border rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="font-display text-2xl font-bold stat-number">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border py-3">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "glass border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group glass border border-border rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-3 card-3d"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <ProjectImage
                    gradient={project.color}
                    icon={project.icon}
                    title={project.title}
                    src={project.imgSrc}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 glass border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                        <Github size={13} /> Code
                      </a>
                    )}
                    {(project as any).link && (
                      <a href={(project as any).link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                        <Play size={11} className="fill-white" /> Live Demo
                      </a>
                    )}
                  </div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border glass ${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>
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
                    {project.points.slice(0, 3).map((point, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary mt-0.5 flex-shrink-0">▹</span>
                        <span className="line-clamp-1">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                    {project.tech.slice(0, 5).map((t) => (
                      <span key={t} className="text-xs bg-secondary text-primary font-medium px-2 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 5 && (
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">
                        +{project.tech.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
