"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "./lib/api";

export function SignupContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.auth.signup({ name, email, password, phone, companyLocation });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <strong>ElecMall</strong>
          <span>Vendors</span>
        </div>
        <h1>Create your vendor account</h1>
        {error ? <div className="warning-banner">{error}</div> : null}

        <label className="login-field">
          <span>Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Acme Trading Co."
          />
        </label>

        <label className="login-field">
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>

        <label className="login-field">
          <span>Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            placeholder="+964 7XX XXX XXXX"
          />
        </label>

        <label className="login-field">
          <span>Company location</span>
          <input
            type="text"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            required
            autoComplete="address-level2"
            placeholder="Baghdad, Karrada"
          />
        </label>

        <label className="login-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>

        <label className="login-field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </label>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="login-alt">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
