import { useState } from "react";
import { Award, Code, Rocket, BookOpen, Plus, X, ImageIcon } from "lucide-react";

interface Achievement {
  icon: typeof Code;
  title: string;
  desc: string;
  certificateImg?: string;
}

const achievements: Achievement[] = [
  {
    icon: Code,
    title: "300+ DSA Problems",
    desc: "Solved on various coding platforms",
    certificateImg: "",
  },
  {
    icon: Rocket,
    title: "ISRO Hackathon 2024",
    desc: "Participated in Bharatiya Antariksh Hackathon",
    certificateImg: "",
  },
  {
    icon: Award,
    title: "PICT TechFiesta 2026",
    desc: "Participated in PICT TechFiesta Hackathon",
    certificateImg: "",
  },
  {
    icon: BookOpen,
    title: "DSA in C++ Course",
    desc: "Completed by Apna College",
    certificateImg: "",
  },
];

const AchievementsSection = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  return (
    <section id="achievements" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          My <span className="text-gradient">Achievements</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Milestones and accomplishments along the way — click to view certificates
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {achievements.map((item) => (
            <button
              key={item.title}
              onClick={() => setSelectedAchievement(item)}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 card-shadow text-center cursor-pointer group relative"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon size={12} /> View Certificate
              </span>
            </button>
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

      {/* Certificate Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden card-shadow animate-fade-up"
            style={{ animationDelay: "0s" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <selectedAchievement.icon size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold">{selectedAchievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAchievement.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {selectedAchievement.certificateImg ? (
                <img
                  src={selectedAchievement.certificateImg}
                  alt={`${selectedAchievement.title} Certificate`}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="bg-secondary rounded-xl p-12 flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon size={48} className="mb-3 opacity-40" />
                  <p className="font-medium">Certificate Coming Soon</p>
                  <p className="text-xs mt-1">Image will be added here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AchievementsSection;
