"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function ThankYouRedirect() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // 1. Fire Meta Pixel Purchase Event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        value: 99,
        currency: "INR",
        content_name: "PROMPT RESUME Ebook",
      });
      console.log("✅ Meta Pixel Purchase Event Fired!");
    }

    // 2. Call verify payment API & unlock downloads
    fetch("/api/verify-payment", { method: "POST" }).catch(() => {});
  }, [router]);

  return (
    <>
      {/* Meta Pixel Purchase Event Script */}
      <Script id="fb-pixel-purchase" strategy="afterInteractive">
        {`
          if (window.fbq) {
            fbq('track', 'Purchase', { value: 99, currency: 'INR', content_name: 'PROMPT RESUME Ebook' });
          }
        `}
      </Script>

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-5 text-center">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-green-200">
            ✓
          </div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-3">
            Payment Completed
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Thank you for purchasing The Prompt Resume Blueprint & Toolkit. Your access has been successfully unlocked!
          </p>

          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-xs font-medium mb-6 border border-green-200 leading-relaxed">
            To download your 52-page PDF ebook and ATS Word templates, click the Dashboard button below.
          </div>

          <button
            onClick={() => router.push("/dashboard?paid=true")}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-3.5 px-4 rounded-full text-sm transition-all shadow-md cursor-pointer"
          >
            Go to Dashboard to Download Files →
          </button>
        </div>
      </div>
    </>
  );
}
