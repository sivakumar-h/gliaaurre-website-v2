"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your contact number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message or enquiry.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transmit message. Please try again.");
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

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setErrors({});
    setIsSuccess(false);
    setServerError(null);
  };

  if (isSuccess) {
    return (
      <div className="border border-border-medium bg-surface-100/90 backdrop-blur-md p-8 sm:p-10 rounded-xl text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-light text-white">
            Message Transmitted Successfully
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-light">
            Thank you for reaching out. We have received your inquiry and our team will get back to you promptly.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-border-medium bg-surface-100/80 backdrop-blur-md p-6 sm:p-8 rounded-xl space-y-5 shadow-2xl"
    >
      {serverError && (
        <div className="p-4 rounded border border-red-500/30 bg-red-500/10 flex items-start gap-3 text-red-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="block text-xs font-mono tracking-wider text-slate-300 uppercase">
          Full Name <span className="text-accent-cyan">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Elena Vance"
          className={cn(
            "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan",
            errors.name ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
          )}
        />
        {errors.name && (
          <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email & Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-mono tracking-wider text-slate-300 uppercase">
            Email Address <span className="text-accent-cyan">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

        <div className="space-y-1.5">
          <label htmlFor="contact-phone" className="block text-xs font-mono tracking-wider text-slate-300 uppercase">
            Contact Number <span className="text-accent-cyan">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
      </div>

      {/* Message / Enquiry Field */}
      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-xs font-mono tracking-wider text-slate-300 uppercase">
          Message / Enquiry <span className="text-accent-cyan">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe the context of your inquiry, partnership interest, or question..."
          className={cn(
            "w-full px-4 py-2.5 bg-surface-50 border text-sm text-foreground placeholder:text-slate-600 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-cyan resize-y",
            errors.message ? "border-red-500/60" : "border-border-subtle hover:border-border-medium"
          )}
        />
        {errors.message && (
          <p className="text-[11px] font-mono text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          icon={
            isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )
          }
        >
          {isSubmitting ? "Transmitting Message..." : "Submit Enquiry"}
        </Button>
      </div>
    </form>
  );
}