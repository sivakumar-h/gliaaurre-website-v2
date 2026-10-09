"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { JOB_OPENINGS, JobOpening } from "@/lib/careers-data";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { CareersConstellationBackground } from "@/components/CareersConstellationBackground";

export default function CareersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState<JobOpening | null>(null);

  const handleOpenModal = (job?: JobOpening) => {
    setTargetJob(job || JOB_OPENINGS[0] || null);
    setModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Dynamic ambient constellation background */}
      <CareersConstellationBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 pb-24">
        {/* 1. HERO SECTION */}
        <section className="space-y-8 max-w-4xl">
          <SectionHeading
            badge="GLIAAURRE // INVITATION"
            title="Join the Quiet Revolution"
          />

          <div className="space-y-6 text-base sm:text-xl text-slate-300 font-light leading-relaxed">
            <p className="text-white font-normal text-2xl sm:text-4xl leading-tight">
              Great engineering doesn’t need to shout.{" "}
              <span className="text-white">
                It speaks for itself.
              </span>
            </p>
            <p className="text-slate-400 max-w-3xl">
              We’re rebuilding medical ultrasound from signal to silicon. If you’re a thinker, tinkerer, explorer, or quiet rebel, come build the future of clarity with us.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              href="#openings"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Apply for Open Position
            </Button>
          </div>
        </section>

        {/* 2. CURRENT JOB OPENINGS DIRECTORY */}
        <section id="openings" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-subtle pb-6">
            <SectionHeading
              badge="01 // CURRENT OPENING"
              title="Current Job Openings"
              subtitle="Explore active opportunities at GliaAurre. Click the job title or 'View Details' to review the complete job description, or submit your application directly."
            />
            <div className="text-xs font-mono text-slate-400">
              SHOWING 1 OF 1 ACTIVE ROLE
            </div>
          </div>

          {/* Job Listings Cards */}
          <div className="space-y-6 pt-2">
            {JOB_OPENINGS.map((job) => (
              <SpotlightCard
                key={job.id}
                className="p-6 sm:p-8 space-y-6 group hover:border-accent-cyan/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left Job Info */}
                  <div className="space-y-3.5 max-w-3xl">
                    {/* Job Title as a clickable link */}
                    <Link
                      href={/careers/ + (job.slug || job.id)}
                      className="group/title block focus:outline-none"
                    >
                      <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight group-hover/title:text-accent-cyan transition-colors flex items-center gap-2">
                        <span>{job.title}</span>
                        <ArrowUpRight className="w-5 h-5 text-accent-cyan opacity-0 -translate-x-1 translate-y-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:translate-y-0 transition-all duration-200 inline" />
                      </h3>
                    </Link>

                    {/* Location and Type directly under Job Title */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>{job.location}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>{job.type}</span>
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                      {job.summary}
                    </p>

                    {/* Quick highlights */}
                    <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3D CAD & Prototyping</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>CNC & 3D Printing</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 flex-shrink-0 self-start">
                    <Link
                      href={/careers/ + (job.slug || job.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-subtle bg-surface-200 text-xs font-mono text-white hover:text-accent-cyan hover:border-accent-cyan/60 transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenModal(job)}
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* 3. GENERAL APPLICATION / OPEN INQUIRY CTA */}
        <section className="border-t border-border-subtle pt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-light text-white">
              Don’t see your exact role listed?
            </h3>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleOpenModal()}
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Submit Open Application
          </Button>
        </section>

        {/* Application Form Modal */}
        <JobApplicationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedJob={targetJob}
        />
      </div>
    </div>
  );
}