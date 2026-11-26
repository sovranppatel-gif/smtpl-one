// src/components/master-admin/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import logo from "../../../assets/icons-opt/logo.webp";
import { API_URL } from "../../../utils/api.js";
import { persistMasterAdminSession } from "../../../utils/masterAdminAuth.js";

export default function MasterAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/master-admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.token) {
        setError(data.message || "Invalid email or password");
        return;
      }

      persistMasterAdminSession({ token: data.token, user: data.user });
      navigate("/master-admin/dashboard");
    } catch {
      setError("Unable to reach server. Please ensure the backend API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#111d36] antialiased">
      {/* Matching Landing Header */}
      <header className="sticky top-0 z-30 border-b border-[#e2d2ae] bg-[#fffdf8]/95 backdrop-blur-md shadow-[0_3px_14px_rgba(63,46,15,0.07)]">
        <div className="mx-auto flex min-h-[76px] max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-7">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={logo}
              alt="Scholars Mediatech logo"
              width={64}
              height={52}
              className="h-[50px] w-[60px] shrink-0 object-contain sm:h-[56px] sm:w-[68px]"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold tracking-[0.02em] text-[#092754] sm:text-base">
                Scholars <span className="text-[#8c5e0f]">Mediatech</span>
              </div>
              <div className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.03em] text-[#455168] sm:text-[10px]">
                Freelancer Marketplace &amp; Digital Services Platform
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-xl border-[1.5px] border-[#092754] bg-[#fffdf8] px-4 py-2 text-xs font-bold text-[#092754] transition hover:bg-[#fff8e9] sm:text-sm"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Editorial Cream Section */}
      <main className="relative overflow-hidden bg-[linear-gradient(125deg,#fff8e9_0%,#fffdf8_58%,#f6ead0_100%)] px-4 py-10 sm:px-7 sm:py-14 lg:py-16">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 lg:grid-cols-[1.05fr_minmax(0,460px)] lg:gap-12">
          {/* Left Brand Context */}
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 border-b-[1.5px] border-[#c28b22] pb-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#092754]">
              <Shield size={14} className="text-[#8c5e0f]" aria-hidden="true" />
              Master Admin Portal
            </span>

            <h1
              className="text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] text-[#092754] sm:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Scholars Mediatech{" "}
              <span className="block text-[#8c5e0f]">Admin Control Center</span>
            </h1>

            <p className="max-w-lg text-[15px] leading-relaxed text-[#25334a]">
              Sign in with your administrator credentials to manage incoming
              client service enquiries, community applications, and landing page
              settings.
            </p>

            <ul className="grid gap-2.5 pt-1 text-sm font-medium text-[#111d36]">
              {[
                "Review and update client service enquiry statuses",
                "Manage community join submissions and export records",
                "Configure contact details, social links, and site settings",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-[#8c5e0f]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Cream Paper Login Card */}
          <div className="rounded-[22px] border border-[#e2d2ae] border-t-4 border-t-[#c28b22] bg-[#fffdf8] p-6 shadow-[0_18px_40px_rgba(9,39,84,0.1)] sm:p-8">
            <div className="mb-5 border-b border-[#ede1c6] pb-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8c5e0f]">
                Authorized Access
              </p>
              <h2
                className="mt-1 text-2xl font-extrabold text-[#092754]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Master Admin Login
              </h2>
              <p className="mt-1 text-xs text-[#455168]">
                Enter your registered admin email and password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#f0b4b4] bg-[#fef2f2] p-3 text-xs text-[#991b1b]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  className="mb-1.5 block text-xs font-bold text-[#092754]"
                  htmlFor="email"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#455168]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@scholarsmediatech.com"
                    autoComplete="username"
                    required
                    className="min-h-[44px] w-full rounded-xl border border-[#d5c5a3] bg-white pl-10 pr-3 text-sm text-[#111d36] placeholder-[#7a8496] outline-none transition focus:border-[#092754] focus:ring-2 focus:ring-[#c28b22]/30"
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-bold text-[#092754]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#455168]"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="min-h-[44px] w-full rounded-xl border border-[#d5c5a3] bg-white pl-10 pr-11 text-sm text-[#111d36] placeholder-[#7a8496] outline-none transition focus:border-[#092754] focus:ring-2 focus:ring-[#c28b22]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#455168] transition hover:bg-[#fff8e9] hover:text-[#092754]"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#092754] bg-gradient-to-r from-[#10376e] to-[#061c3d] px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(9,39,84,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(9,39,84,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#092754] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Signing in..." : "Login as Master Admin"}
                {!loading && <ArrowRight size={16} aria-hidden="true" />}
              </button>
            </form>

            <p className="mt-5 border-t border-[#ede1c6] pt-4 text-center text-[11.5px] text-[#455168]">
              Protected portal for Scholars Mediatech administrators.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
