"use client";

import { useState } from "react";
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

export function ContactForm() {
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

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="h-11"
          />
        </div>
        <div>
          <Select value={formData.inquiry} onValueChange={(value) => handleChange("inquiry", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Inquiry Type" />
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
      <div>
        <Input
          type="text"
          placeholder="Message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          required
          className="h-11"
        />
      </div>
      {status ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </motion.form>
  );
}

