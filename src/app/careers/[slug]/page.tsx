"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/Button";
import { SpotlightCard } from "@/components/SpotlightCard";
import { JOB_OPENINGS } from "@/lib/careers-data";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { CareersConstellationBackground } from "@/components/CareersConstellationBackground";

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = JOB_OPENINGS.find((j) => j.slug === params.slug || j.id === params.slug);
  const [modalOpen, setModalOpen] = useState(false);

  if (!job) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient 3D Constellation Canvas */}
      <CareersConstellationBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 pb-24">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-accent-cyan transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO ALL OPENINGS</span>
          </Link>
        </div>

        {/* 1. JOB HEADER HERO CARD */}
        <SpotlightCard className="p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight">
                {job.title}
              </h1>

              {/* Location and Type directly under Job Title */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-accent-cyan" />
                  <span>{job.location}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-accent-cyan" />
                  <span>{job.type}</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
                {job.summary}
              </p>
            </div>

            {/* Top Apply Button */}
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setModalOpen(true)}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </SpotlightCard>

        {/* 2. ENTIRE JOB DESCRIPTION IN ONE UNIFIED BLOCK */}
        <SpotlightCard className="p-8 sm:p-12 space-y-10">
          {/* About the Role */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-medium flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              <span className="text-accent-cyan">
                About the Role
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed pl-5">
              {job.aboutRole}
            </p>
          </div>

          <div className="border-t border-border-subtle" />

          {/* Key Responsibilities */}
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-medium flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              <span className="text-accent-cyan">
                Key Responsibilities
              </span>
            </h2>
            <ul className="space-y-3 pt-1 pl-5">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-1" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border-subtle" />

          {/* Required Skills & Experience */}
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-medium flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              <span className="text-accent-cyan">
                Required Skills & Experience
              </span>
            </h2>
            <ul className="space-y-3 pt-1 pl-5">
              {job.qualifications.map((qual, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-1" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border-subtle" />

          {/* What We're Looking For */}
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-medium flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              <span className="text-accent-cyan">
                What We’re Looking For
              </span>
            </h2>
            <ul className="space-y-3 pt-1 pl-5">
              {job.whatWereLookingFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  <Sparkles className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </SpotlightCard>

        {/* 3. BOTTOM BUTTONS (APPLY NOW & BACK TO CAREERS) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setModalOpen(true)}
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Apply Now
          </Button>

          <Button
            href="/careers"
            variant="outline"
            size="lg"
          >
            Back to Careers
          </Button>
        </div>

        {/* Job Application Modal (shared for both buttons) */}
        <JobApplicationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedJob={job}
        />
      </div>
    </div>
  );
}