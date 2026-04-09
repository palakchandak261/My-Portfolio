import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Let's <span className="text-gradient">Connect</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          I'm always open to new opportunities and collaborations. Feel free to reach out!
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <a
            href="mailto:chandakpalak78@gmail.com"
            className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 card-shadow min-w-[250px]"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">chandakpalak78@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:9156942778"
            className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 card-shadow min-w-[250px]"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">9156942778</p>
            </div>
          </a>

          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 min-w-[250px]">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">Pune, India</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/palakchandak261"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-secondary border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/palakchandak-44b84733a"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-secondary border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:chandakpalak78@gmail.com"
            className="w-12 h-12 bg-secondary border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
