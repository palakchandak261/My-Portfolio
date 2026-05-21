import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    icon: GraduationCap,
    degree: "B.Tech Computer Engineering",
    institution: "Vishwakarma Institute of Technology, Pune",
    period: "2024 – Present",
    score: "CGPA: 8.97",
    location: "Pune, Maharashtra",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Award,
    degree: "XII (Science — PCM)",
    institution: "MJ College, Jalgaon",
    period: "2022 – 2024",
    score: "83.33%",
    location: "Jalgaon, Maharashtra",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Award,
    degree: "MHT CET",
    institution: "Competitive Entrance Exam",
    period: "2024",
    score: "98.6 Percentile",
    location: "Maharashtra",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Award,
    degree: "JEE Mains",
    institution: "Competitive Entrance Exam",
    period: "2024",
    score: "92.75 Percentile",
    location: "India",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Award,
    degree: "X (SSC)",
    institution: "PNL Kanya School, Jalgaon",
    period: "2021 – 2022",
    score: "97% — 3rd District Topper",
    location: "Jalgaon, Maharashtra",
    color: "from-emerald-500 to-teal-600",
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">BACKGROUND</p>
          <div className="flex items-end gap-4 mb-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              My <span className="text-gradient">Education</span>
            </h2>
            <div className="h-1 flex-1 max-w-xs bg-gradient-primary rounded-full mb-3 hidden sm:block" />
          </div>
          <p className="text-muted-foreground max-w-xl">Academic journey and qualifications</p>
        </div>

        <div className="max-w-2xl relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={edu.degree} className="relative flex gap-6 group">
                <div className="relative flex-shrink-0 mt-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${edu.color} flex items-center justify-center shadow-lg z-10 relative group-hover:scale-110 transition-transform duration-300`}>
                    <edu.icon size={18} className="text-white" />
                  </div>
                  {i === 0 && (
                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse-glow" />
                  )}
                </div>
                <div className="flex-1 glass border border-border rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 card-shadow">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary font-medium mb-1">{edu.period}</p>
                      <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{edu.location}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r ${edu.color} text-white shadow-md`}>
                        {edu.score}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
