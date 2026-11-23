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
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-reenz-green" htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            minLength={2}
            maxLength={100}
            required
            className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none transition placeholder:text-reenz-muted focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-reenz-green" htmlFor="contact-email">
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
            className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none transition placeholder:text-reenz-muted focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-reenz-green" htmlFor="contact-phone">
          Phone <span className="font-normal text-reenz-muted">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder="Your phone number"
          className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none transition placeholder:text-reenz-muted focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-reenz-green" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          minLength={5}
          maxLength={5000}
          placeholder="How can we help?"
          required
          className="w-full resize-y rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none transition placeholder:text-reenz-muted focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20"
        />
      </div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
      {success && <p className="rounded-xl bg-reenz-sage p-3 text-sm text-reenz-green" role="status">{success}</p>}
      <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send message"} <span aria-hidden="true">&rarr;</span>
      </button>
      <p className="m-0 text-xs text-reenz-muted">Your message is stored securely for the Reenz Organic team.</p>
    </form>
  );
}
