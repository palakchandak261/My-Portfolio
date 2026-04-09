const skillCategories = [
  {
    title: "Languages",
    skills: ["C", "C++", "Python", "JavaScript", "Dart"],
  },
  {
    title: "Full Stack",
    skills: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    title: "Tools & Frameworks",
    skills: ["Flutter", "Bootstrap", "Git", "GitHub", "EJS"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "MongoDB", "SQL"],
  },
  {
    title: "Concepts",
    skills: ["DSA", "OOP", "System Design"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          Tech <span className="text-gradient">Stack</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Technologies and tools I work with
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <h3 className="font-display font-semibold text-primary mb-4 text-sm uppercase tracking-wider">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-secondary text-foreground text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
