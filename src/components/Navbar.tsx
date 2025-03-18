
import { Link } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 bg-background/80 backdrop-blur-lg border-b border-border transition-all duration-200">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">
            ParametricDraw
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/generator" className="text-foreground/80 hover:text-foreground transition-colors">
            Generator
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <User className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors">
                  Home
                </Link>
                <Link to="/generator" className="text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors">
                  Generator
                </Link>
                <Link to="/about" className="text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors">
                  About
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
