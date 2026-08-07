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
        <div className="text-[13px] text-[#86868b] font-medium animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      {/* Apple-style Ultra Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e5e5ea]">
        <div className="max-w-[980px] mx-auto px-5 h-[52px] flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight text-[#1d1d1f]">
            Prompt Resume
          </Link>

          <div className="flex items-center gap-6 text-[13px] text-[#424245]">
            <Link
              href="/"
              className="hover:text-[#1d1d1f] transition-colors"
            >
              ← Main Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[820px] mx-auto px-5 py-16 w-full flex-1 space-y-12">
        {/* Welcome Section */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b] block mb-2">
            Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            Welcome back, {user?.firstName || user?.fullName || "there"}.
          </h1>
          <p className="text-[17px] text-[#86868b] font-medium mt-2 leading-relaxed">
            {unlocked
              ? "Your Prompt Resume toolkit files are unlocked and ready for download below."
              : "Your account is created. Complete your launch payment to unlock all digital files."}
          </p>
        </div>

        {/* Lock Banner if Unpaid */}
        {!unlocked && (
          <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[15px] text-[#1d1d1f]">Payment Pending</h3>
              <p className="text-[13px] text-[#86868b] mt-0.5 font-medium">Complete ₹99 payment to access all PDF & Word downloads.</p>
            </div>
            <button
              onClick={handlePayClick}
              className="bg-[#1d1d1f] hover:bg-black text-white px-5 py-2 rounded-full font-medium text-[13px] transition-colors cursor-pointer shrink-0"
            >
              Pay ₹99 Now
            </button>
          </div>
        )}

        {/* Downloads Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#e5e5ea] pb-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Your Files
            </h2>
            <span className="text-[12px] text-[#86868b] font-medium">
              {unlocked ? "Lifetime Access" : "Payment Required"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File 1: PDF Ebook */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d2d2d7] transition-all">
              <div>
                <span className="text-[11px] font-medium text-[#86868b] block mb-2">
                  PDF • 52 Pages
                </span>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] mb-1">
                  The AI Resume Blueprint
                </h3>
                <p className="text-[13px] text-[#86868b] font-medium mb-6 leading-relaxed">
                  23 chapters with 30+ ready-to-use copyable AI prompts.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/ebook"
                  className="bg-[#1d1d1f] hover:bg-black text-white text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block"
                >
                  Download PDF
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f5f5f7] text-[#86868b] text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block border border-[#e5e5ea]"
                >
                  Unlock Access
                </button>
              )}
            </div>

            {/* File 2: Classic Template */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d2d2d7] transition-all">
              <div>
                <span className="text-[11px] font-medium text-[#86868b] block mb-2">
                  Word (.docx) • Template
                </span>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] mb-1">
                  ATS Classic Resume
                </h3>
                <p className="text-[13px] text-[#86868b] font-medium mb-6 leading-relaxed">
                  Standard format optimized for Workday, Taleo & Greenhouse.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-classic"
                  className="bg-[#1d1d1f] hover:bg-black text-white text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block"
                >
                  Download DOCX
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f5f5f7] text-[#86868b] text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block border border-[#e5e5ea]"
                >
                  Unlock Access
                </button>
              )}
            </div>

            {/* File 3: Modern Template */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d2d2d7] transition-all">
              <div>
                <span className="text-[11px] font-medium text-[#86868b] block mb-2">
                  Word (.docx) • Template
                </span>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] mb-1">
                  ATS Modern Resume
                </h3>
                <p className="text-[13px] text-[#86868b] font-medium mb-6 leading-relaxed">
                  Clean formatting designed for tech, marketing & sales roles.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-modern"
                  className="bg-[#1d1d1f] hover:bg-black text-white text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block"
                >
                  Download DOCX
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f5f5f7] text-[#86868b] text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block border border-[#e5e5ea]"
                >
                  Unlock Access
                </button>
              )}
            </div>

            {/* File 4: Internship Template */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 flex flex-col justify-between hover:border-[#d2d2d7] transition-all">
              <div>
                <span className="text-[11px] font-medium text-[#86868b] block mb-2">
                  Word (.docx) • Template
                </span>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] mb-1">
                  Internship & Fresher Resume
                </h3>
                <p className="text-[13px] text-[#86868b] font-medium mb-6 leading-relaxed">
                  Tailored format emphasizing projects, skills & education.
                </p>
              </div>

              {unlocked ? (
                <a
                  href="/api/download/template-internship"
                  className="bg-[#1d1d1f] hover:bg-black text-white text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block"
                >
                  Download DOCX
                </a>
              ) : (
                <button
                  onClick={handlePayClick}
                  className="bg-[#f5f5f7] text-[#86868b] text-center py-2.5 px-4 rounded-full font-medium text-[13px] transition-colors cursor-pointer block border border-[#e5e5ea]"
                >
                  Unlock Access
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Instagram Support Section */}
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
          <div>
            <h3 className="font-semibold text-[15px] text-[#1d1d1f]">Need Support?</h3>
            <p className="text-[13px] text-[#86868b] font-medium mt-0.5">Contact us directly on Instagram for instant assistance.</p>
          </div>
          <a
            href="https://ig.me/m/prompt_resume"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] px-5 py-2 rounded-full font-medium text-[13px] transition-colors cursor-pointer border border-[#e5e5ea] shrink-0"
          >
            Instagram DM @prompt_resume
          </a>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-[#fbfbfd] border-t border-[#e5e5ea] py-8">
        <div className="max-w-[980px] mx-auto px-5 text-center text-[12px] text-[#86868b] font-medium">
          © {new Date().getFullYear()} Prompt Resume. All rights reserved.
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
          <div className="text-[13px] text-[#86868b] font-medium animate-pulse">Loading...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
