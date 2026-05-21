import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Navbar is only shown on the /projects page (and other non-index pages).
 * On the index page, the Sidebar handles navigation.
 * On mobile for the index page, the top bar is rendered inline in Index.tsx.
 */
const Navbar = () => {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects";

  if (!isProjectsPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors glass border border-border px-4 py-2 rounded-full"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
        <span className="font-display text-xl font-bold text-gradient">PC</span>
        <span className="text-sm text-primary font-medium">Projects</span>
      </div>
    </nav>
  );
};

export default Navbar;
