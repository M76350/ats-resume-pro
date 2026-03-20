import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, FileText, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Page Not Found | FreeATS"
        description="The page you're looking for doesn't exist. Return to FreeATS to check your ATS resume score for free."
        noIndex={true}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="text-8xl font-display font-extrabold text-primary/20 mb-4">404</div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/"><Home className="w-4 h-4 mr-2" /> Go Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/blog"><BookOpen className="w-4 h-4 mr-2" /> Read Blog</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
