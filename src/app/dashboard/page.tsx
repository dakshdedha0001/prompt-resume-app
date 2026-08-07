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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin mb-4" />
        <div className="text-[#475569] font-medium text-[14px]">
          Verifying account & payment status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#0f172a] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e2e8f0]">
        <div className="max-w-[1060px] mx-auto px-5 h-[52px] flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Prompt Resume
          </Link>

          <div className="flex items-center gap-6 text-[13px]">
            <Link
              href="/"
              className="font-medium text-[#475569] hover:text-[#0071e3] transition-colors"
            >
              ← Back to Main Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="max-w-[860px] mx-auto px-5 py-12 w-full flex-1">
        {/* Banner: Unlocked vs Locked */}
        {unlocked ? (
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 mb-10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Dashboard
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Toolkit Unlocked
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">
              Welcome back, {user?.firstName || user?.fullName || "there"}
            </h1>
            <p className="text-[#475569] text-[15px] mt-2 max-w-xl font-medium leading-relaxed">
              Your Prompt Resume Toolkit is unlocked and ready. Download your PDF ebook and ATS Word templates below.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50/60 border border-amber-200 text-amber-950 rounded-3xl p-8 mb-10 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Payment Pending
              </span>
            </div>
            <h1 className="text-2xl font-bold text-amber-950">
              Complete ₹99 Payment to Unlock Downloads
            </h1>
            <p className="text-[14px] text-amber-800 mt-2 max-w-xl font-medium leading-relaxed">
              Your account is created! To download the 52-Page PDF Ebook and 3 ATS Word Templates, complete your ₹99 launch payment below.
            </p>
            <div className="mt-6">
              <button
                onClick={handlePayClick}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 rounded-full font-semibold text-[14px] transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Complete ₹99 Payment to Unlock
              </button>
            </div>
          </div>
        )}

        {/* Downloads Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">
              Your Purchased Toolkit Files
            </h2>
            {unlocked ? (
              <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Lifetime Access Active
              </span>
            ) : (
              <span className="text-[12px] font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Payment Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* File 1: PDF Ebook */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📘</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#0071e3]/10 text-[#0071e3] px-3 py-1 rounded-full">
                    PDF Ebook
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-[#0f172a] mb-1">
                  The AI Resume Blueprint (52 Pages)
                </h3>
                <p className="text-[13px] text-[#475569] mb-6 leading-relaxed">
                  23 chapters with 30+ ready-to-use copyable AI prompt sheets.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/ebook"
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download PDF Ebook</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f8fafc] text-[#64748b] text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#e2e8f0] hover:bg-amber-50 hover:text-amber-900"
                >
                  <span>Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 2: Classic Template */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📑</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-[#0f172a] mb-1">
                  ATS Classic Resume Template
                </h3>
                <p className="text-[13px] text-[#475569] mb-6 leading-relaxed">
                  Single-column format optimized for Workday, Taleo & Greenhouse ATS.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-classic"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Classic DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f8fafc] text-[#64748b] text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#e2e8f0] hover:bg-amber-50 hover:text-amber-900"
                >
                  <span>Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 3: Modern Template */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎨</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-[#0f172a] mb-1">
                  ATS Modern Resume Template
                </h3>
                <p className="text-[13px] text-[#475569] mb-6 leading-relaxed">
                  Clean, modern formatting for tech, marketing, sales, and design.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-modern"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Modern DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f8fafc] text-[#64748b] text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#e2e8f0] hover:bg-amber-50 hover:text-amber-900"
                >
                  <span>Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 4: Internship Template */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎓</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-[#0f172a] mb-1">
                  Internship & Fresher Template
                </h3>
                <p className="text-[13px] text-[#475569] mb-6 leading-relaxed">
                  Tailored format emphasizing projects, skills, and achievements.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-internship"
                  className="bg-[#0f172a] hover:bg-[#000000] text-white text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Internship DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f8fafc] text-[#64748b] text-center py-2.5 px-4 rounded-full font-semibold text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#e2e8f0] hover:bg-amber-50 hover:text-amber-900"
                >
                  <span>Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#fbfbfd] border-t border-[#e2e8f0] py-8">
        <div className="max-w-[1060px] mx-auto px-5 text-center text-[12px] text-[#64748b] font-medium">
          © {new Date().getFullYear()} Prompt Resume. All downloads are protected & watermarked.
        </div>
      </footer>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
          <div className="w-8 h-8 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin mb-4" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
