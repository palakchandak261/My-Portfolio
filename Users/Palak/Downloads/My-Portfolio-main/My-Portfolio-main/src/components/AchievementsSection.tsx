import { useState } from "react";
import { Award, Code, Rocket, BookOpen, X, ImageIcon } from "lucide-react";

interface Achievement {
  icon: typeof Code;
  title: string;
  desc: string;
  year: string;
  tag: string;
  tagColor: string;
  certificateImg?: string;
}

const achievements: Achievement[] = [
  {
    icon: Award,
    title: "Tesseract'26 Runner-Up",
    desc: "Runner Up in Tesseract'26 Inter-college hackathon by VIT Pune",
    year: "2026",
    tag: "Hackathon",
    tagColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    certificateImg: "/certificates/tesseract.jpeg",
  },
  {
    icon: Code,
    title: "350+ DSA Problems",
    desc: "Solved on LeetCode and various competitive coding platforms",
    year: "2024–26",
    tag: "Coding",
    tagColor: "bg-primary/15 text-primary border-primary/25",
    certificateImg: "/certificates/leetcode.png",
  },
  {
    icon: Rocket,
    title: "ISRO Hackathon 2024",
    desc: "Participated in Bharatiya Antariksh Hackathon by ISRO",
    year: "2024",
    tag: "Hackathon",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    certificateImg: "/certificates/Isro.png",
  },
  {
    icon: Award,
    title: "PICT TechFiesta 2026",
    desc: "Participated in PICT TechFiesta inter-college hackathon",
    year: "2026",
    tag: "Hackathon",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/25",
    certificateImg: "/certificates/PICT.png",
  },
  {
    icon: BookOpen,
    title: "DSA in C++ Course",
    desc: "Completed comprehensive DSA course by Apna College",
    year: "2024",
    tag: "Certificate",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    certificateImg: "/certificates/DSA.png",
  },
];

const AchievementsSection = () => {
  const [selected, setSelected] = useState<Achievement | null>(null);

  return (
    <section id="achievements" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section label + heading */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">MILESTONES</p>
          <div className="flex items-end gap-4 mb-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              My <span className="text-gradient">Achievements</span>
            </h2>
            <div className="h-1 flex-1 max-w-xs bg-gradient-primary rounded-full mb-3 hidden sm:block" />
          </div>
          <p className="text-muted-foreground max-w-xl">
            Milestones and accomplishments along the way — click any card to view the certificate
          </p>
        </div>

        {/* Achievement cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((item) => (
            <button
              key={item.title}
              onClick={() => setSelected(item)}
              className="group glass border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 card-shadow text-left cursor-pointer relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative z-10">
                {/* Icon + tag row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-1">{item.year}</p>
                <h3 className="font-display font-bold text-base mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={12} />
                  View Certificate
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden card-shadow animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <selected.icon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">{selected.title}</h3>
                  <p className="text-xs text-muted-foreground">{selected.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Certificate image */}
            <div className="p-6">
              {selected.certificateImg ? (
                <img
                  src={selected.certificateImg}
                  alt={`${selected.title} Certificate`}
                  className="w-full rounded-xl border border-border"
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
