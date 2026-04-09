import { Code, GraduationCap, Lightbulb } from "lucide-react";

const highlights = [
  { icon: Code, title: "Full Stack Dev", desc: "MERN Stack, REST APIs, Flutter" },
  { icon: GraduationCap, title: "B.Tech CSE", desc: "VIT Pune • CGPA 8.97" },
  { icon: Lightbulb, title: "Problem Solver", desc: "300+ DSA problems solved" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          About <span className="text-gradient">Me</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          A driven Computer Engineering student with strong analytical, communication, and teamwork skills.
          Eager to contribute to team success through modern full-stack development.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 card-shadow"
            >
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-5">
                <item.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
