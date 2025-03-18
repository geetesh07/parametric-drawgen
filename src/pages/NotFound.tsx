
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-medium mt-4 mb-6">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
