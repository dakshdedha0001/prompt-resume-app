"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Call verify payment API to unlock files for signed in user
    fetch("/api/verify-payment", { method: "POST" })
      .then(() => {
        router.push("/dashboard?paid=true");
      })
      .catch(() => {
        router.push("/dashboard?paid=true");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-5 text-center">
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for purchasing The Prompt Resume Blueprint & Toolkit. Unlocking your downloads and redirecting to your Dashboard...
        </p>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2563eb]">
          <span className="animate-spin text-lg">⏳</span> Unlocking Your Downloads...
        </div>
      </div>
    </div>
  );
}
