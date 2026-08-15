"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/#pricing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-5 text-center">
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-red-200">
          ✕
        </div>
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-3">
          Transaction Cancelled
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Payment Could Not Be Completed
        </h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Your payment process was interrupted or declined. Don't worry, your money is completely safe. If any amount was debited, your bank will automatically refund it within 3-5 business days.
        </p>

        <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-xs font-semibold mb-5 border border-red-200 flex items-center justify-center gap-2">
          <span className="animate-spin text-sm">⏳</span> Redirecting to Home Page in {countdown} seconds...
        </div>

        <button
          onClick={() => router.push("/#pricing")}
          className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-3 px-4 rounded-full text-sm transition-all shadow-md cursor-pointer mb-3"
        >
          Try Payment Again →
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-full text-xs transition-all cursor-pointer"
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
}
