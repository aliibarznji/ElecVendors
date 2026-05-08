"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useLang } from "../lib/lang-context";

export function LoginContent() {
  const { t, lang, setLang } = useLang();
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
      setError(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card-header">
          <div className="login-brand">
            <strong>ElecMall</strong>
            <span>Vendors</span>
          </div>
          <button
            type="button"
            className="login-lang"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
          >
            {t("changeLanguage")}
          </button>
        </div>
        <h1>{t("loginTitle")}</h1>
        {error ? <div className="warning-banner">{error}</div> : null}
        <label className="login-field">
          <span>{t("loginEmailLabel")}</span>
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
          <span>{t("loginPasswordLabel")}</span>
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
          {loading ? t("loginSubmitting") : t("loginSubmitBtn")}
        </button>
        <div className="login-alt">
          {t("loginNoAccount")} <Link href="/signup">{t("loginCreateLink")}</Link>
        </div>
      </form>
    </div>
  );
}
