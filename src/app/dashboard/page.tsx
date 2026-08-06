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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <div className="text-3xl mb-3 animate-spin">⏳</div>
        <div className="text-gray-600 font-semibold text-sm">
          Verifying your account & payment status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111827] font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-[#e5e7eb]">
        <div className="max-w-[1060px] mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            Prompt <span className="text-[#2563eb]">Resume</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition"
            >
              ← Back to Main Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="max-w-[840px] mx-auto px-5 py-10 w-full flex-1">
        {/* Banner: Unlocked vs Locked */}
        {unlocked ? (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Student Dashboard
              </span>
              <span className="bg-green-400/20 text-green-200 border border-green-300/30 text-xs font-bold px-3 py-1 rounded-full">
                ✓ Toolkit Unlocked
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.firstName || user?.fullName || "Student"}! 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
              Access and download your purchased Prompt Resume Blueprint ebook and ATS Word templates below. All files are securely protected.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔒</span>
              <span className="bg-amber-200 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Toolkit Locked — Payment Pending
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-amber-950 mt-1">
              Complete ₹99 Payment to Unlock Downloads
            </h1>
            <p className="text-sm text-amber-800 mt-2 max-w-xl">
              Your Student Account is created! To unlock instant download access to the 52-Page PDF Ebook and 3 ATS Word Templates, complete your ₹99 launch payment below.
            </p>
            <div className="mt-5">
              <button
                onClick={handlePayClick}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-md cursor-pointer"
              >
                ⚡ Complete ₹99 Payment to Unlock Downloads
              </button>
            </div>
          </div>
        )}

        {/* Downloads Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Your Purchased Files & Toolkit
            </h2>
            {unlocked ? (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                ✓ Lifetime Access Active
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                🔒 Payment Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File 1: PDF Ebook */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">📘</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded-full border border-blue-100">
                    PDF Ebook
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  The AI Resume Blueprint (52 Pages)
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Complete 23-chapter guide with 30+ ready-to-use copyable AI prompt sheets.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/ebook"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⬇️ Download PDF Ebook</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-gray-100 text-gray-400 text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-gray-200 hover:bg-amber-100 hover:text-amber-800"
                >
                  <span>🔒 Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 2: Classic Template */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">📑</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  ATS Classic Resume Template
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Standard single-column format optimized for Workday, Taleo, and Greenhouse ATS.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-classic"
                  className="bg-gray-900 hover:bg-black text-white text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⬇️ Download Classic DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-gray-100 text-gray-400 text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-gray-200 hover:bg-amber-100 hover:text-amber-800"
                >
                  <span>🔒 Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 3: Modern Template */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🎨</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  ATS Modern Resume Template
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Clean, modern formatting for tech, marketing, sales, and design roles.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-modern"
                  className="bg-gray-900 hover:bg-black text-white text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⬇️ Download Modern DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-gray-100 text-gray-400 text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-gray-200 hover:bg-amber-100 hover:text-amber-800"
                >
                  <span>🔒 Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>

            {/* File 4: Internship Template */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🎓</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                    Word (.docx)
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  Internship & Fresher Template
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Tailored format emphasizing projects, skills, education, and achievements.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-internship"
                  className="bg-gray-900 hover:bg-black text-white text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⬇️ Download Internship DOCX</span>
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-gray-100 text-gray-400 text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-gray-200 hover:bg-amber-100 hover:text-amber-800"
                >
                  <span>🔒 Complete ₹99 Payment to Unlock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-[1060px] mx-auto px-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Prompt Resume. All downloads are protected & watermarked.
        </div>
      </footer>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="text-gray-500 font-medium animate-pulse">Loading dashboard...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
