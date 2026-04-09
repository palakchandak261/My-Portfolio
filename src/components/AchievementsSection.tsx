import { Award, Code, Rocket, BookOpen, Plus } from "lucide-react";

const achievements = [
  {
    icon: Code,
    title: "300+ DSA Problems",
    desc: "Solved on various coding platforms",
  },
  {
    icon: Rocket,
    title: "ISRO Hackathon 2024",
    desc: "Participated in Bharatiya Antariksh Hackathon",
  },
  {
    icon: Award,
    title: "PICT TechFiesta 2026",
    desc: "Participated in PICT TechFiesta Hackathon",
  },
  {
    icon: BookOpen,
    title: "DSA in C++ Course",
    desc: "Completed by Apna College",
  },
];

const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          My <span className="text-gradient">Achievements</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Milestones and accomplishments along the way
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {achievements.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 card-shadow text-center"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Extra space for more achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card/50 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/30 transition-colors"
            >
              <Plus size={28} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Add Achievement</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
