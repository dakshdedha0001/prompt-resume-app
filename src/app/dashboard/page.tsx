"use client";

import { useState, useEffect, Suspense } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if user has already paid in metadata
    const metaPaid =
      user.publicMetadata?.has_paid === true ||
      user.unsafeMetadata?.has_paid === true;

    if (metaPaid) {
      setUnlocked(true);
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", { value: 99, currency: "INR" });
      }
      return;
    }

    // Check if user just returned from Razorpay Payment
    const paidParam =
      searchParams.get("paid") === "true" ||
      searchParams.get("access") === "paid_verified" ||
      searchParams.get("razorpay_payment_id");

    if (paidParam) {
      setVerifying(true);
      fetch("/api/verify-payment", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUnlocked(true);
            if (typeof window !== "undefined" && (window as any).fbq) {
              (window as any).fbq("track", "Purchase", { value: 99, currency: "INR" });
            }
            user.reload();
          }
        })
        .finally(() => setVerifying(false));
    }
  }, [user, isLoaded, searchParams]);

  const handlePayClick = () => {
    window.location.href = "https://rzp.io/rzp/LVhAvNk";
  };

  if (!isLoaded || verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white">
        <div className="w-10 h-10 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin mb-4" />
        <div className="text-gray-400 font-medium text-[14px] tracking-wide">
          Verifying your account & payment status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      {/* Executive Dark Header */}
      <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-gray-800/80">
        <div className="max-w-[1060px] mx-auto px-5 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-white">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0071e3] to-[#00c6ff] flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
              PR
            </span>
            <span>Prompt Resume</span>
          </Link>

          <div className="flex items-center gap-5 text-[13px]">
            <Link
              href="/"
              className="font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Site</span>
            </Link>

            <div className="h-4 w-[1px] bg-gray-800" />

            <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-800">
              <span className="text-xs text-gray-300 font-medium">Account</span>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-[1020px] mx-auto px-5 py-10 w-full flex-1 space-y-8">
        {/* Executive Hero Banner Card */}
        {unlocked ? (
          <div className="bg-gradient-to-br from-[#0f172a] via-[#090d16] to-[#020617] text-white border border-gray-800 shadow-2xl rounded-[2.2rem] p-8 md:p-10 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#0071e3]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-2 tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIFETIME ACCESS UNLOCKED
                </span>
                <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-medium px-3 py-1 rounded-full">
                  PRO TOOLKIT ACTIVE
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Welcome back, {user?.firstName || user?.fullName || "Member"} 👋
                </h1>
                <p className="text-gray-400 text-[15px] sm:text-[16px] mt-2 max-w-2xl font-normal leading-relaxed">
                  Your full Prompt Resume Toolkit is unlocked. Download your high-converting ATS Word templates and 52-page prompt guide below to start generating interview calls.
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-800/80 text-xs">
                <div className="bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/60">
                  <div className="text-gray-400 font-medium">Downloadable Assets</div>
                  <div className="text-xl font-bold text-white mt-0.5">4 Ready Files</div>
                </div>
                <div className="bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/60">
                  <div className="text-gray-400 font-medium">ATS Compatibility</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">100% Tested</div>
                </div>
                <div className="bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/60">
                  <div className="text-gray-400 font-medium">AI Prompts Bank</div>
                  <div className="text-xl font-bold text-sky-400 mt-0.5">30+ Copy-Paste</div>
                </div>
                <div className="bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/60">
                  <div className="text-gray-400 font-medium">Updates & License</div>
                  <div className="text-xl font-bold text-indigo-400 mt-0.5">Lifetime Free</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-950/90 via-[#1c1305] to-[#090d16] text-white border border-amber-500/30 rounded-[2.2rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                🔒 PAYMENT REQUIRED TO ACCESS DOWNLOADS
              </div>
              <h1 className="text-3xl font-bold text-white">
                Complete Your ₹99 Launch Payment
              </h1>
              <p className="text-amber-200/80 text-[15px] max-w-xl leading-relaxed">
                Your account is ready! Complete your ₹99 one-time launch payment to unlock immediate access to the 52-page PDF guide and 3 ATS Word templates.
              </p>
              <div className="pt-2">
                <button
                  onClick={handlePayClick}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-8 py-3.5 rounded-full font-bold text-[15px] transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  ⚡ Unlock Full Toolkit Now for ₹99
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actionable 4-Step Roadmap Card */}
        {unlocked && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Quick Start Action Plan</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Follow these 4 simple steps to build your ATS resume in 15 minutes</p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                Step-by-Step Guide
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/60">
                <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center mb-3">1</div>
                <h3 className="font-semibold text-[14px] text-[#0f172a]">Download Template</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Choose Classic, Modern, or Internship .docx template below.</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/60">
                <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center mb-3">2</div>
                <h3 className="font-semibold text-[14px] text-[#0f172a]">Open AI Guide</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Open Chapter 01 to Chapter 08 in the 52-page PDF Ebook.</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/60">
                <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center mb-3">3</div>
                <h3 className="font-semibold text-[14px] text-[#0f172a]">Copy AI Prompts</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Copy prompts directly into ChatGPT, Claude, or Gemini.</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/60">
                <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center mb-3">4</div>
                <h3 className="font-semibold text-[14px] text-[#0f172a]">Land Interviews</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Apply with your 90+ ATS score resume and get replies!</p>
              </div>
            </div>
          </div>
        )}

        {/* Downloadable Assets Section */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">
                Your Toolkit Assets & Files
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Click any button below to download the latest files directly to your device.
              </p>
            </div>

            {unlocked && (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Direct Download Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File 1: PDF Ebook */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0071e3] flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#0071e3]/10 text-[#0071e3] px-3 py-1 rounded-full border border-[#0071e3]/20">
                    PDF Guide • 14.2 MB
                  </span>
                </div>

                <h3 className="font-bold text-[17px] text-[#0f172a] mb-1 group-hover:text-[#0071e3] transition-colors">
                  The AI Resume Blueprint (52 Pages)
                </h3>
                <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                  23 step-by-step chapters containing 30+ ready-to-use copyable AI prompts, LinkedIn optimizer, and HR scorecard matrix.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/ebook"
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download PDF Ebook</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-slate-100 text-slate-500 text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200 hover:bg-amber-100 hover:text-amber-900"
                >
                  <span>🔒 Complete Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 2: Classic Template */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                    Word (.docx) • 1.8 MB
                  </span>
                </div>

                <h3 className="font-bold text-[17px] text-[#0f172a] mb-1 group-hover:text-[#0071e3] transition-colors">
                  ATS Classic Resume Template
                </h3>
                <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                  Single-column standard layout engineered to score 90+ on Workday, Taleo, and Greenhouse ATS screeners.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-classic"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Classic DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-slate-100 text-slate-500 text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200 hover:bg-amber-100 hover:text-amber-900"
                >
                  <span>🔒 Complete Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 3: Modern Template */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-100">
                    Word (.docx) • 2.1 MB
                  </span>
                </div>

                <h3 className="font-bold text-[17px] text-[#0f172a] mb-1 group-hover:text-[#0071e3] transition-colors">
                  ATS Modern Resume Template
                </h3>
                <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                  Clean modern format designed for tech, software engineering, product, marketing, and sales roles.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-modern"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Modern DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-slate-100 text-slate-500 text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200 hover:bg-amber-100 hover:text-amber-900"
                >
                  <span>🔒 Complete Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 4: Internship Template */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                    Word (.docx) • 1.5 MB
                  </span>
                </div>

                <h3 className="font-bold text-[17px] text-[#0f172a] mb-1 group-hover:text-[#0071e3] transition-colors">
                  Internship & Fresher Template
                </h3>
                <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                  Tailored format emphasizing college projects, coursework, leadership skills, and key achievements.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-internship"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Internship DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-slate-100 text-slate-500 text-center py-3 px-5 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200 hover:bg-amber-100 hover:text-amber-900"
                >
                  <span>🔒 Complete Payment to Unlock</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Support & Community Access Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-[16px] text-[#0f172a]">Need Help or Have Questions?</h3>
            <p className="text-xs text-slate-500 font-medium">Our support team is active 24/7 on Instagram DM to assist you with editing or downloads.</p>
          </div>
          <a
            href="https://ig.me/m/prompt_resume"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-6 py-2.5 rounded-full font-semibold text-[13px] shadow-md hover:scale-105 transition-transform shrink-0 flex items-center gap-2"
          >
            <span>Message @prompt_resume</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8fafc] border-t border-slate-200/80 py-8">
        <div className="max-w-[1020px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500 font-medium">
          <div>© {new Date().getFullYear()} Prompt Resume. All rights reserved.</div>
          <div>All digital downloads are watermarked & protected under single-user license.</div>
        </div>
      </footer>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-white">
          <div className="w-10 h-10 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin mb-4" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
