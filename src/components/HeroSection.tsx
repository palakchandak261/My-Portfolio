import { Github, Linkedin, Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile-placeholder.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 pt-20">
        <div className="flex-1 text-center lg:text-left">
          <p className="text-primary font-medium mb-3 animate-fade-up">Hello, I'm</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 animate-fade-up animate-fade-up-delay-1">
            Palak <span className="text-gradient">Chandak</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-up animate-fade-up-delay-2">
            Full Stack Developer & Computer Engineering Student
          </p>
          <p className="text-muted-foreground max-w-lg mb-8 animate-fade-up animate-fade-up-delay-3 mx-auto lg:mx-0">
            Passionate about building impactful web applications with modern technologies.
            Strong analytical skills with a commitment to continuous learning.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-up animate-fade-up-delay-4">
            <a
              href="mailto:chandakpalak78@gmail.com"
              className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Mail size={18} /> Get in Touch
            </a>
            <a
              href="https://github.com/palakchandak261"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border bg-secondary px-6 py-3 rounded-lg font-medium hover:border-primary transition-colors flex items-center gap-2"
            >
              <Github size={18} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/palakchandak-44b84733a"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border bg-secondary px-6 py-3 rounded-lg font-medium hover:border-primary transition-colors flex items-center gap-2"
            >
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted-foreground justify-center lg:justify-start animate-fade-up animate-fade-up-delay-4">
            <span className="flex items-center gap-1"><MapPin size={14} /> Pune, India</span>
            <span className="flex items-center gap-1"><Phone size={14} /> 9156942778</span>
          </div>
        </div>

        <div className="flex-shrink-0 animate-fade-up animate-fade-up-delay-2">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 animate-pulse-glow">
              <img
                src={profileImg}
                alt="Palak Chandak"
                className="w-full h-full object-cover"
                width={512}
                height={512}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              CGPA 8.97
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
