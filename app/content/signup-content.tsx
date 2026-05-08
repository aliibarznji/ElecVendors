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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        className="bg-surface border border-border rounded-xl shadow p-10 w-full max-w-[400px] flex flex-col gap-[1.1rem]"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-[0.35rem]">
            <strong className="text-brand text-[1.35rem]">ElecMall</strong>
            <span className="text-[0.85rem] text-[#6b7280]">Vendors</span>
          </div>
          <button
            type="button"
            className="bg-transparent border border-border rounded px-[0.65rem] py-[0.3rem] text-[0.78rem] font-medium cursor-pointer hover:border-brand hover:text-brand"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
          >
            {t("changeLanguage")}
          </button>
        </div>
        <h1 className="text-[1.1rem] font-semibold text-text m-0">{t("signupTitle")}</h1>
        {error ? (
          <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#fed7aa] bg-[#fff7ed] text-[#9a3412] text-[13px]">
            {error}
          </div>
        ) : null}

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("signupNameLabel")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Acme Trading Co."
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("loginEmailLabel")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("signupPhoneLabel")}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            placeholder="+964 7XX XXX XXXX"
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("signupLocationLabel")}</span>
          <input
            type="text"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            required
            autoComplete="address-level2"
            placeholder="Baghdad, Karrada"
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("loginPasswordLabel")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <label className="flex flex-col gap-[0.4rem] text-[0.85rem] font-medium text-text">
          <span>{t("signupConfirmLabel")}</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="border border-border rounded px-[0.75rem] py-[0.55rem] text-[0.9rem] outline-none bg-surface-soft focus:border-brand transition-colors duration-150"
          />
        </label>

        <button
          className="mt-1 bg-brand text-white border-0 rounded px-4 py-[0.65rem] text-[0.92rem] font-semibold cursor-pointer transition-opacity duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? t("signupSubmitting") : t("signupSubmitBtn")}
        </button>

        <div className="text-center text-[0.85rem] text-[#6b7280] mt-1">
          {t("signupHasAccount")} <Link href="/login">{t("signupSignInLink")}</Link>
        </div>
      </form>
    </div>
  );
}
