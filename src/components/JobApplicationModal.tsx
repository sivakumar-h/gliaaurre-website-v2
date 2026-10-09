"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/Button";
import { JOB_OPENINGS, JobOpening } from "@/lib/careers-data";
import { cn } from "@/lib/utils";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: JobOpening | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  totalExperience: string;
  currentCtc: string;
  expectedCtc: string;
  jobId: string;
  briefIntroduction: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  totalExperience?: string;
  currentCtc?: string;
  expectedCtc?: string;
  jobId?: string;
  briefIntroduction?: string;
  resume?: string;
}

export function JobApplicationModal({
  isOpen,
  onClose,
  selectedJob,
}: JobApplicationModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    totalExperience: "",
    currentCtc: "",
    expectedCtc: "",
    jobId: selectedJob?.id || "mechanical-design-engineer",
    briefIntroduction: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync selected job when opening modal
  useEffect(() => {
    if (selectedJob) {
      setFormData((prev) => ({ ...prev, jobId: selectedJob.id }));
    }
  }, [selectedJob]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (file: File | undefined) => {
    setServerError(null);
    if (!file) return;

    // Allowed extensions: pdf, doc, docx
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF or DOC/DOCX document.",
      }));
      return;
    }

    // Limit size to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size exceeds the 10 MB limit.",
      }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your contact number.";
    }

    if (!formData.totalExperience.trim()) {
      newErrors.totalExperience = "Please specify your total experience (e.g., 2 Years).";
    }

    if (!formData.jobId) {
      newErrors.jobId = "Please select a target position.";
    }

    if (
      formData.briefIntroduction.trim().length > 0 &&
      formData.briefIntroduction.trim().length < 15
    ) {
      newErrors.briefIntroduction = "Please provide at least 15 characters.";
    }

    if (!resumeFile) {
      newErrors.resume = "Please attach your resume (PDF or DOC/DOCX).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("totalExperience", formData.totalExperience);
      data.append("currentCtc", formData.currentCtc);
      data.append("expectedCtc", formData.expectedCtc);
      data.append("jobId", formData.jobId);
      data.append("briefIntroduction", formData.briefIntroduction);
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application. Please try again.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      totalExperience: "",
      currentCtc: "",
      expectedCtc: "",
      jobId: selectedJob?.id || "mechanical-design-engineer",
      briefIntroduction: "",
    });
    setResumeFile(null);
    setErrors({});
    setIsSuccess(false);
    setServerError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Container */}
      <div
        className="relative w-full max-w-2xl bg-surface-100 border border-border-medium rounded-xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-50">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-slate-300 uppercase" id="modal-title">
              JOB APPLICATION // {selectedJob ? selectedJob.title.toUpperCase() : "ENGINEERING PORTAL"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-surface-200 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-light text-white">
                  Application Submitted Successfully
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Thank you for applying to GliaAurre. Our engineering and recruitment team has received your application and attached resume. We will review your profile and reach out shortly.
                </p>
              </div>

              <div className="pt-4">
                <Button variant="primary" size="md" onClick={handleResetAndClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {serverError && (
                <div className="p-4 rounded border border-red-500/40 bg-red-500/10 flex items-start gap-3 text-red-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Target Position Selection */}
              <div className="space-y-1.5">
                <label
                  htmlFor="jobId"
                  className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                >
                  Position Applied For <span className="text-accent-cyan">*</span>
                </label>
                <div className="relative">
                  <select
                    id="jobId"
                    value={formData.jobId}
                    onChange={(e) =>
                      setFormData({ ...formData, jobId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-surface-50 border border-border-subtle hover:border-border-medium text-sm text-foreground rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan appearance-none cursor-pointer"
                  >
                    {JOB_OPENINGS.map((job) => (
                      <option key={job.id} value={job.id} className="bg-surface-100 text-foreground">
                        {job.title} — {job.location}
                      </option>
                    ))}
                    <option value="general-inquiry" className="bg-surface-100 text-foreground">
                      General Engineering Exploration / Other
                    </option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                {errors.jobId && (
                  <p className="text-[11px] font-mono text-red-400">{errors.jobId}</p>
                )}
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-name"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Full Name <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    id="cand-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. John Doe"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.name ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-email"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Email Address <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    id="cand-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@domain.com"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.email ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Contact Number & Total Experience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-phone"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Contact Number <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    id="cand-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 9876543210"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.phone ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.phone && (
                    <p className="text-[11px] font-mono text-red-400">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-experience"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Total Experience <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    id="cand-experience"
                    type="text"
                    value={formData.totalExperience}
                    onChange={(e) =>
                      setFormData({ ...formData, totalExperience: e.target.value })
                    }
                    placeholder="e.g. 2 Years / 1.5 Years"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.totalExperience ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.totalExperience && (
                    <p className="text-[11px] font-mono text-red-400">{errors.totalExperience}</p>
                  )}
                </div>
              </div>

              {/* Current CTC & Expected CTC Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-current-ctc"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Current CTC <span className="text-slate-500 normal-case">(Optional)</span>
                  </label>
                  <input
                    id="cand-current-ctc"
                    type="text"
                    value={formData.currentCtc}
                    onChange={(e) =>
                      setFormData({ ...formData, currentCtc: e.target.value })
                    }
                    placeholder="e.g. 5.5 LPA / N/A"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.currentCtc ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.currentCtc && (
                    <p className="text-[11px] font-mono text-red-400">{errors.currentCtc}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cand-expected-ctc"
                    className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                  >
                    Expected CTC <span className="text-slate-500 normal-case">(Optional)</span>
                  </label>
                  <input
                    id="cand-expected-ctc"
                    type="text"
                    value={formData.expectedCtc}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedCtc: e.target.value })
                    }
                    placeholder="e.g. 8 LPA"
                    className={cn(
                      "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
                      errors.expectedCtc ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                    )}
                  />
                  {errors.expectedCtc && (
                    <p className="text-[11px] font-mono text-red-400">{errors.expectedCtc}</p>
                  )}
                </div>
              </div>

              {/* Resume File Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wider text-slate-300 uppercase">
                  Resume Attachment <span className="text-accent-cyan">*</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                {resumeFile ? (
                  <div className="flex items-center justify-between p-3.5 rounded border border-accent-cyan/40 bg-accent-cyan/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-surface-200 border border-border-medium flex items-center justify-center text-accent-cyan flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-white truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-surface-200 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2",
                      isDragging
                        ? "border-accent-cyan bg-accent-cyan/10"
                        : "border-border-medium hover:border-accent-cyan/60 bg-surface-50/50 hover:bg-surface-50",
                      errors.resume ? "border-red-500/60" : ""
                    )}
                  >
                    <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-accent-cyan" />
                    <div className="text-xs text-slate-300">
                      <span className="text-accent-cyan font-medium">Click to upload resume</span> or drag and drop
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      PDF, DOC, DOCX (Max 10 MB)
                    </div>
                  </div>
                )}

                {errors.resume && (
                  <p className="text-[11px] font-mono text-red-400">{errors.resume}</p>
                )}
              </div>

              {/* Brief Introduction */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cand-intro"
                  className="block text-xs font-mono tracking-wider text-slate-300 uppercase"
                >
                  Brief Introduction <span className="text-slate-500 normal-case">(Optional)</span>
                </label>
                <textarea
                  id="cand-intro"
                  rows={4}
                  value={formData.briefIntroduction}
                  onChange={(e) =>
                    setFormData({ ...formData, briefIntroduction: e.target.value })
                  }
                  placeholder="Tell us about your background, relevant projects (e.g. 3D printing, CAD, CNC prototyping), and what interests you about GliaAurre..."
                  className={cn(
                    "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan resize-y",
                    errors.briefIntroduction ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
                  )}
                />
                {errors.briefIntroduction && (
                  <p className="text-[11px] font-mono text-red-400">{errors.briefIntroduction}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  icon={
                    isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}