"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "./lib/api";

export function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.login(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        <h1>Sign in to your account</h1>
        {error ? <div className="warning-banner">{error}</div> : null}
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
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>
        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="login-alt">
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </div>
      </form>
    </div>
  );
}
