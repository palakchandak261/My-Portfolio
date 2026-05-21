import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
          <span className="font-display font-bold text-gradient text-lg">PC</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground p-2 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Offset for mobile top bar */}
        <div className="lg:hidden h-14" />

        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AchievementsSection />
        <EducationSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
