"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";

const minMessageHeight = 160;

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    >
      {children}
      {required ? (
        <span className="ml-1 text-amber-700 dark:text-amber-300" aria-hidden="true">
          *
        </span>
      ) : null}
      {required ? <span className="sr-only">required</span> : null}
    </label>
  );
}

export function ContactForm() {
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Unable to send message.");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiry: "",
        message: "",
      });
      if (messageRef.current) {
        messageRef.current.style.height = `${minMessageHeight}px`;
      }
      setStatus("Message sent.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = event.target;

    handleChange("message", element.value);
    element.style.height = "auto";
    element.style.height = `${Math.max(element.scrollHeight, minMessageHeight)}px`;
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-lg bg-gray-950/[.03] p-5 dark:bg-gray-50/[.08] sm:p-6"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
          Tell us about your project
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          A few details help us recommend the right build, finish, and timeline.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-name" required>
            Name
          </FieldLabel>
          <Input
            id="contact-name"
            type="text"
            placeholder="Ex. Maria Santos"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div>
          <FieldLabel htmlFor="contact-email" required>
            Email
          </FieldLabel>
          <Input
            id="contact-email"
            type="email"
            placeholder="Ex. maria@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="Ex. +63 917 123 4567"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="h-11"
          />
        </div>
        <div>
          <FieldLabel htmlFor="contact-inquiry">Inquiry type</FieldLabel>
          <Select value={formData.inquiry} onValueChange={(value) => handleChange("inquiry", value)}>
            <SelectTrigger id="contact-inquiry" className="h-11">
              <SelectValue placeholder="Ex. Custom Furniture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Furniture</SelectItem>
              <SelectItem value="catalog">Catalog Items</SelectItem>
              <SelectItem value="consultation">Design Consultation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <FieldLabel htmlFor="contact-message" required>
          Message
        </FieldLabel>
        <textarea
          id="contact-message"
          ref={messageRef}
          placeholder="Ex. I need a six-seat narra dining table for a 3m x 4m dining area."
          value={formData.message}
          onChange={handleMessageChange}
          required
          rows={6}
          style={{ minHeight: minMessageHeight }}
          className="w-full resize-none overflow-hidden rounded-md border bg-white px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
        />
      </div>
      {status ? (
        <p className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {status}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="mt-4 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </motion.form>
  );
}

