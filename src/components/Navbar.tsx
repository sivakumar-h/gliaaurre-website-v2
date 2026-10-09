"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";
import { GliaLogo } from "@/components/GliaLogo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/why-us", label: "Why Us" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-border-subtle shadow-lg shadow-black/20 py-3.5"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official GliaAurre Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
          >
            <GliaLogo size="md" />
            <span className="font-mono text-base font-semibold tracking-wider text-foreground uppercase group-hover:text-white transition-colors">
              GliaAurre
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 border border-border-subtle bg-surface-50/70 backdrop-blur-md px-3 py-1.5 rounded-full">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 text-xs font-mono tracking-wider transition-all duration-200 rounded-full",
                    isActive
                      ? "bg-white/10 text-accent-cyan font-medium shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href="/contact"
              variant="outline"
              size="sm"
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Get in Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-surface-100 border border-border-subtle rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[60px] bg-background/98 backdrop-blur-xl border-b border-border-medium transition-all duration-300 ease-in-out px-6 py-6 space-y-4",
          mobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible pointer-events-none"
        )}
      >
        <div className="flex flex-col space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 text-sm font-mono tracking-wider border transition-all duration-200 rounded",
                  isActive
                    ? "bg-surface-100 border-accent-cyan/40 text-accent-cyan font-medium"
                    : "border-transparent text-slate-300 hover:text-white hover:bg-surface-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border-subtle">
          <Button
            href="/contact"
            variant="primary"
            size="md"
            className="w-full"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </header>
  );
}