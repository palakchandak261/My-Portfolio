import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
    <div className="container mx-auto px-4 py-6 relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          © 2026 Palak Chandak — Built with{" "}
          <Heart size={11} className="fill-accent text-accent" /> in Pune
        </p>
        <div className="flex items-center gap-2">
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
              className="w-8 h-8 glass border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
