"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Your message could not be sent.");
      }
      form.reset();
      setSuccess("Thanks for reaching out. Your message has been received.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            minLength={2}
            maxLength={100}
            required
          />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            required
          />
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor="contact-phone">
          Phone <span className="contact-optional">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder="Your phone number"
        />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          minLength={5}
          maxLength={5000}
          placeholder="How can we help?"
          required
        />
      </div>
      {error && <p className="contact-feedback contact-feedback--error" role="alert">{error}</p>}
      {success && <p className="contact-feedback" role="status">{success}</p>}
      <button className="button contact-submit" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send message"} <span aria-hidden="true">&rarr;</span>
      </button>
      <p className="contact-note">Your message is stored securely for the Reenz Organic team.</p>
    </form>
  );
}
