import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/subjects", label: "Subjects" },
    { href: "/pricing", label: "Pricing" },
    { href: "/live-lessons", label: "Live Schedules" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-white/80 backdrop-blur-md border-border shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:bg-secondary transition-colors duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-heading font-bold text-xl md:text-2xl text-foreground tracking-tight">
              Smart Minds
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/register">
                <Button className="font-semibold shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-xl animate-in slide-in-from-top-5">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-lg font-medium py-2 border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full justify-center">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-heading font-bold text-xl">Smart Minds</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering Grade 12 learners with curriculum-aligned digital education. Master your matric results with us.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/live-lessons" className="hover:text-primary transition-colors">Live Lessons</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium block text-foreground">Call/WhatsApp:</span>
                  <a href="tel:+27816991450" className="hover:text-primary transition-colors">+27 81 699 1450</a>
                </li>
                <li>
                  <span className="font-medium block text-foreground">Email:</span>
                  <a href="mailto:tsmartminds@gmail.com" className="hover:text-primary transition-colors">tsmartminds@gmail.com</a>
                </li>
                <li>
                  <span className="font-medium block text-foreground">Location:</span>
                  <span>Pretoria, South Africa</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Smart Minds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
