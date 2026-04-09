import { ExternalLink, Plus } from "lucide-react";
import foodieHubImg from "@/assets/project-foodie-hub.jpg";
import nyayaAiImg from "@/assets/project-nyaya-ai.jpg";
import treeVisualizerImg from "@/assets/project-tree-visualizer.jpg";

const projects = [
  {
    title: "Foodie Hub",
    subtitle: "Online Food Ordering System",
    year: "2025",
    tech: ["Node.js", "MySQL", "EJS", "Bootstrap"],
    points: [
      "Full-stack food ordering platform with auth & order tracking",
      "Restaurant browsing, cart system, checkout & reward-based discounts",
      "Responsive UI with optimized database queries",
    ],
    link: "https://foodie-hub1-sv8c.onrender.com",
    image: foodieHubImg,
    color: "from-orange-400 to-red-500",
  },
  {
    title: "Nyaya AI",
    subtitle: "Legal Awareness AI Assistant",
    year: "2026",
    tech: ["Flutter", "Node.js", "MongoDB", "Groq API"],
    points: [
      "AI-powered mobile app explaining Indian legal rights in simple language",
      "Integrated Groq LLM API for real-time legal assistance",
      "Backend with Node.js, Express, MongoDB & JWT auth",
    ],
    image: nyayaAiImg,
    color: "from-purple-400 to-pink-500",
  },
  {
    title: "Tree Visualizer",
    subtitle: "Advanced Data Structure Visualizer",
    year: "2026",
    tech: ["JavaScript", "HTML", "CSS", "Chart.js"],
    points: [
      "Interactive visualizer for BST, AVL, Red-Black, B-Tree & B+ Tree",
      "Insert, delete, search with AVL rotations & Red-Black balancing",
      "Performance comparison dashboard using Chart.js",
    ],
    image: treeVisualizerImg,
    color: "from-emerald-400 to-cyan-500",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Some of the projects I've built
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 card-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  width={800}
                  height={512}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold bg-card/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full">
                    {project.year}
                  </span>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm p-2 rounded-full text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{project.subtitle}</p>

                <ul className="space-y-2 mb-5">
                  {project.points.map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">▹</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs bg-secondary text-primary font-medium px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder cards for more projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card/50 border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/30 transition-colors"
            >
              <Plus size={32} className="mb-3 opacity-50" />
              <p className="font-medium">More Projects Coming Soon</p>
              <p className="text-xs mt-1">Tell me what to add here!</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
