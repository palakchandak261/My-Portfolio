import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, MapPin, User, Wrench, FolderOpen, Trophy, GraduationCap, Phone, X, Download } from "lucide-react";

const roles = [
  "Full Stack Developer",
  "Flutter Developer",
  "AI/ML Enthusiast",
  "Problem Solver",
];

const navLinks = [
  { label: "About",        href: "#about",        icon: User },
  { label: "Skills",       href: "#skills",        icon: Wrench },
  { label: "Projects",     href: "#projects",      icon: FolderOpen },
  { label: "Achievements", href: "#achievements",  icon: Trophy },
  { label: "Education",    href: "#education",     icon: GraduationCap },
  { label: "Contact",      href: "#contact",       icon: Phone },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [activeSection, setActiveSection] = useState("about");

  // Typewriter
  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    onClose();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-card border-r border-border overflow-y-auto scrollbar-hide
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* ── Profile area ── */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6 border-b border-border">
          {/* Photo with gradient border */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl p-0.5 bg-gradient-primary shadow-lg animate-pulse-glow">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src="/professional.png"
                  alt="Palak Chandak"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Available badge */}
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-card border border-border rounded-full px-2 py-0.5 text-xs font-medium text-green-400 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Open
            </div>
          </div>

          <h1 className="font-display text-lg font-bold text-foreground text-center leading-tight">
            Palak Chandak
          </h1>

          {/* Typewriter role */}
          <div className="h-5 mt-1 flex items-center justify-center">
            <span className="text-xs text-primary font-medium typing-cursor">{displayed}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin size={11} />
            Pune, India
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { href: "https://github.com/palakchandak261", icon: Github, label: "GitHub" },
              { href: "https://linkedin.com/in/palakchandak-44b84733a", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:chandakpalak78@gmail.com", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 glass border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 px-4 py-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 px-2">Navigation</p>
          <ul className="space-y-1">
            {navLinks.map(({ label, href, icon: Icon }) => {
              const id = href.slice(1);
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 text-left
                      ${isActive
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }
                    `}
                  >
                    <Icon size={16} className={isActive ? "text-primary" : ""} />
                    {label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom stat + Resume ── */}
        <div className="px-4 pb-6 space-y-3">
          <div className="glass border border-border rounded-xl p-4 text-center">
            <div className="font-display text-2xl font-bold stat-number">8.97</div>
            <div className="text-xs text-muted-foreground mt-0.5">CGPA · VIT Pune</div>
          </div>
          {/* Resume download — prominent in sidebar */}
          <a
            href="/resume.pdf"
            download="Palak_Chandak_Resume.pdf"
            className="w-full btn-shimmer text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
          >
            <Download size={15} /> Download Resume
          </a>
          <p className="text-center text-xs text-muted-foreground opacity-60">
            © 2026 Palak Chandak
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
