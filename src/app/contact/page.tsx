import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ContactSignalMesh } from "@/components/ContactSignalMesh";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the GliaAurre team. Submit inquiries regarding engineering collaboration, clinical partnerships, recruitment, or technology exploration.",
};

// Configurable Contact Information details
const CONTACT_INFO = {
  address: "Noida, Uttar Pradesh 201304, India",
  email: "contact@gliaaurre.com",
  phone: "+91 (Contact Number)",
  website: "https://www.gliaaurre.com",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Interactive cursor-reactive signal mesh */}
      <ContactSignalMesh />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 pb-24">
        {/* 1. HERO HEADER */}
        <section className="max-w-3xl space-y-4">
          <SectionHeading
            badge="GLIAAURRE // DIRECT COMM"
            title="Start a Conversation"
            subtitle="Whether you are exploring technical collaboration, engineering roles, clinical dialogue, or general inquiry, reach out below."
          />
        </section>

        {/* 2. CONTACT FORM */}
        <div className="max-w-3xl">
          <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading secure gateway...</div>}>
            <ContactForm />
          </Suspense>
        </div>

        {/* 3. CONTACT INFORMATION SECTION (Below Form) */}
        <section className="border-t border-border-subtle pt-16 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-light text-white">
              Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Office Location */}
            <SpotlightCard className="p-6 space-y-3">
              <div className="w-9 h-9 rounded-lg border border-accent-cyan/30 bg-surface-200 flex items-center justify-center text-accent-cyan">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  OFFICE LOCATION
                </div>
                <div className="text-sm font-medium text-white">
                  {CONTACT_INFO.address}
                </div>
              </div>
            </SpotlightCard>

            {/* 2. Company Email & Contact Number */}
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-emerald-500/30 bg-surface-200 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    COMPANY EMAIL
                  </div>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-sm font-medium text-white hover:text-accent-cyan transition-colors block truncate"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <div className="w-9 h-9 rounded-lg border border-amber-500/30 bg-surface-200 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    CONTACT NUMBER
                  </div>
                  <div className="text-sm font-medium text-white font-mono">
                    {CONTACT_INFO.phone}
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* 4. Required Quick Links */}
            <SpotlightCard className="p-6 space-y-3">
              <div className="w-9 h-9 rounded-lg border border-border-medium bg-surface-200 flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  LINKS
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <Link
                    href="/careers"
                    className="text-slate-300 hover:text-accent-cyan transition-colors flex items-center justify-between"
                  >
                    <span>› Careers & Openings</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/about"
                    className="text-slate-300 hover:text-accent-cyan transition-colors flex items-center justify-between"
                  >
                    <span>› About GliaAurre</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/why-us"
                    className="text-slate-300 hover:text-accent-cyan transition-colors flex items-center justify-between"
                  >
                    <span>› Engineering Ethos</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>
      </div>
    </div>
  );
}