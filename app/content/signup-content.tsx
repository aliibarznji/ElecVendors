"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useLang } from "../lib/lang-context";

export function SignupContent() {
  const { t, lang, setLang } = useLang();
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
      setError(t("signupPasswordMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("signupPasswordTooShort"));
      return;
    }

    setLoading(true);
    try {
      await api.auth.signup({ name, email, password, phone, companyLocation });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("signupFailed"));
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
        <h1>{t("signupTitle")}</h1>
        {error ? <div className="warning-banner">{error}</div> : null}

        <label className="login-field">
          <span>{t("signupNameLabel")}</span>
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
          <span>{t("signupPhoneLabel")}</span>
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
          <span>{t("signupLocationLabel")}</span>
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
          <span>{t("loginPasswordLabel")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </label>

        <label className="login-field">
          <span>{t("signupConfirmLabel")}</span>
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
          {loading ? t("signupSubmitting") : t("signupSubmitBtn")}
        </button>

        <div className="login-alt">
          {t("signupHasAccount")} <Link href="/login">{t("signupSignInLink")}</Link>
        </div>
      </form>
    </div>
  );
}
