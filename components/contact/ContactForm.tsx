"use client";

import { Send, User, Mail, MessageSquare } from "lucide-react";
import DOMPurify from "dompurify";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/primitives/Button";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const sanitizeField = (input: string) =>
        DOMPurify.sanitize(input, { ALLOWED_TAGS: ["b", "i", "a"] });

      const sanitizedFormData = {
        name: sanitizeField(formData.name),
        email: sanitizeField(formData.email),
        message: sanitizeField(formData.message),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedFormData),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Failed to submit the form.");
      }

      toast.success("Form submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-line pb-5">
        <h3 className="mb-1.5 text-[15px] font-semibold text-hi">
          Send me a message
        </h3>
        <p className="text-caption text-mid">
          I&apos;ll get back to you as soon as possible
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block font-mono text-[11px] text-mid"
          >
            Your Name
          </label>
          <div className="relative">
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="peer w-full rounded-control border border-line bg-surface-2 py-3 pl-10 pr-3.5 text-[14px] text-hi transition-colors duration-200 placeholder:text-low focus:border-accent-line"
            />
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-low peer-focus:text-accent" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block font-mono text-[11px] text-mid"
          >
            Your Email
          </label>
          <div className="relative">
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="peer w-full rounded-control border border-line bg-surface-2 py-3 pl-10 pr-3.5 text-[14px] text-hi transition-colors duration-200 placeholder:text-low focus:border-accent-line"
            />
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-low peer-focus:text-accent" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block font-mono text-[11px] text-mid"
          >
            Your Message
          </label>
          <div className="relative">
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={6}
              className="peer min-h-33 w-full resize-none rounded-control border border-line bg-surface-2 py-3 pl-10 pr-3.5 text-[14px] text-hi transition-colors duration-200 placeholder:text-low focus:border-accent-line"
            />
            <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-low peer-focus:text-accent" />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
