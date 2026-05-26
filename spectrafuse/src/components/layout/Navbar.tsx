import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { Menu, X, Github, Radar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workbench', label: 'Tool' },
    { to: '/docs', label: 'Docs' },
    { to: '/about', label: 'About' },
  ];

  const isLanding = location.pathname === '/';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isLanding
            ? 'glass shadow-lg'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="SpectraFuse Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Radar className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-dark-text">
                Spectra<span className="text-primary">Fuse</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-card/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/Nitish-vattikuti/Spectrafuse"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-card/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <Link to="/workbench">
                <Button size="sm">Launch Tool →</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-dark-muted"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-semibold transition-colors ${
                  location.pathname === link.to ? 'text-primary' : 'text-dark-text hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 mt-8">
              <Link to="/workbench" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg">Launch Tool →</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
