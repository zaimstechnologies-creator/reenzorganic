"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Sign-in failed. Please try again.");
        return;
      }
      router.replace("/admin");
    } catch {
      setError("Could not reach the sign-in service. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="admin-login-card">
      <CardHeader>
        <p className="admin-eyebrow">Reenz Organic</p>
        <CardTitle className="text-2xl">Administrator sign in</CardTitle>
        <CardDescription>Use your configured administrator credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-field">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </div>
          <div className="admin-form-field">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
            />
          </div>
          {error && (
            <p className="admin-alert" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          <Link className="admin-muted text-center no-underline hover:underline" href="/">
            Return to the storefront
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}

