import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, ChevronDown, Sparkles, Code2, Cpu } from "lucide-react";

const roles = [
  "Full Stack Developer",
  "Flutter Developer",
  "AI/ML Enthusiast",
  "Problem Solver",
  "Computer Engineer",
];

const HeroSection = () => {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter effect
  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(252, 87%, 67%, ${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(252, 87%, 67%, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-8 pb-16">
        {/* Left — Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary mb-6 animate-fade-up border border-primary/20">
            <Sparkles size={14} className="animate-pulse" />
            Available for opportunities
          </div>

          <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold mb-4 animate-fade-up animate-fade-up-delay-1 leading-tight">
            Hi, I'm<br />
            <span className="text-gradient">Palak Chandak</span>
          </h1>

          <div className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-up animate-fade-up-delay-2 h-8 flex items-center justify-center lg:justify-start">
            <Code2 size={20} className="text-primary mr-2 flex-shrink-0" />
            <span className="typing-cursor font-medium text-foreground/80">{displayed}</span>
          </div>

          <p className="text-muted-foreground max-w-lg mb-8 animate-fade-up animate-fade-up-delay-3 mx-auto lg:mx-0 leading-relaxed">
            Computer Engineering student at VIT Pune with CGPA 8.97. Building AI-powered systems,
            full-stack platforms, and mobile apps that solve real problems.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-up animate-fade-up-delay-4">
            <a
              href="mailto:chandakpalak78@gmail.com"
              className="btn-shimmer text-white px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-transform duration-200"
            >
              <Mail size={18} /> Get in Touch
            </a>
            <a
              href="https://github.com/palakchandak261"
              target="_blank"
              rel="noopener noreferrer"
              className="glass border border-border px-7 py-3.5 rounded-xl font-semibold hover:border-primary/50 transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <Github size={18} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/palakchandak-44b84733a"
              target="_blank"
              rel="noopener noreferrer"
              className="glass border border-border px-7 py-3.5 rounded-xl font-semibold hover:border-primary/50 transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-10 justify-center lg:justify-start animate-fade-up animate-fade-up-delay-4">
            {[
              { value: "8.97", label: "CGPA" },
              { value: "9+",   label: "Projects" },
              { value: "350+", label: "DSA Solved" },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="font-display text-2xl font-bold stat-number">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Profile image */}
        <div className="flex-shrink-0 animate-fade-up animate-fade-up-delay-2">
          <div className="relative w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" />
            <div
              className="absolute inset-4 rounded-full border border-accent/15 animate-spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "15s" }}
            />
            {/* Orbiting dot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-3 h-3 rounded-full bg-primary animate-orbit"
                style={{ boxShadow: "0 0 12px hsl(252 87% 67%)" }}
              />
            </div>
            {/* Photo */}
            <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-primary/30 animate-pulse-glow shadow-3d">
              <img
                src="/professional.png"
                alt="Palak Chandak"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating badges */}
            <div className="absolute -top-2 -right-2 glass border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-lg animate-float">
              CGPA 8.97 ✨
            </div>
            <div
              className="absolute -bottom-2 -left-2 glass border border-accent/30 px-3 py-1.5 rounded-full text-xs font-bold text-accent shadow-lg animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <Cpu size={11} className="inline mr-1" />VIT Pune
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
      >
        <span className="text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;
