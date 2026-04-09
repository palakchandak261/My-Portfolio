const education = [
  {
    degree: "B.Tech Computer Engineering",
    institution: "VIT Pune",
    period: "2024 - Present",
    score: "CGPA: 8.97",
    location: "Pune",
  },
  {
    degree: "XII (Science)",
    institution: "MJ College Jalgaon",
    period: "2022 - 2024",
    score: "83.33%",
    location: "Jalgaon",
  },
  {
    degree: "MHT CET",
    institution: "Competitive Exam",
    period: "2024",
    score: "98.6 %ile",
    location: "Maharashtra",
  },
  {
    degree: "JEE Mains",
    institution: "Competitive Exam",
    period: "2024",
    score: "92.75 %ile",
    location: "India",
  },
  {
    degree: "X",
    institution: "PNL Kanya School",
    period: "2021 - 2022",
    score: "97% (3rd District Topper)",
    location: "Jalgaon",
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          My <span className="text-gradient">Education</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Academic journey and qualifications
        </p>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {education.map((edu, i) => (
            <div
              key={edu.degree}
              className={`relative flex flex-col md:flex-row gap-4 mb-10 ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 mt-2 glow" />

              <div className="md:w-1/2" />
              <div
                className={`md:w-1/2 ml-10 md:ml-0 ${
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-300 card-shadow">
                  <span className="text-xs text-primary font-medium">{edu.period}</span>
                  <h3 className="font-display font-semibold text-lg mt-1">{edu.degree}</h3>
                  <p className="text-muted-foreground text-sm">{edu.institution}</p>
                  <p className="text-primary font-semibold text-sm mt-2">{edu.score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
