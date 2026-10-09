import React from "react";
import Link from "next/link";
import { GliaLogo } from "@/components/GliaLogo";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/why-us", label: "Why Us" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-background relative overflow-hidden">
      {/* Precision ambient background beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            >
              <GliaLogo size="sm" />
              <span className="font-mono text-base font-semibold tracking-wider text-foreground uppercase">
                GliaAurre
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Engineering the Future of Clarity. Rebuilding ultrasound from signal to silicon.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SYSTEMS: ONLINE</span>
              <span className="text-slate-500">/</span>
              <span>PARADIGM: DEEP-TECH</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-6 flex flex-col md:items-end justify-between space-y-6">
            <div className="flex flex-wrap gap-6 text-xs font-mono tracking-wider">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400 tracking-wider">
              © 2026 GliaAurre. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}