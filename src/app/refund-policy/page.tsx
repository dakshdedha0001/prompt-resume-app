import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111827] font-sans antialiased">
      <header className="bg-white border-b border-gray-200 py-4 px-5">
        <div className="max-w-[800px] mx-auto flex justify-between items-center">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            Prompt <span className="text-[#2563eb]">Resume</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-gray-600 hover:text-black">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-5 py-12 flex-1">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Refund & Cancellation Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">1. Digital Products Policy</h2>
            <p>
              Due to the immediate digital access nature of the Prompt Resume Toolkit (PDF Ebook + ATS Word Templates), purchases are generally non-refundable once the digital files have been delivered to your Student Dashboard.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">2. Duplicate Payment Adjustments</h2>
            <p>
              If you were charged twice due to a technical error or network disruption during the Razorpay checkout process, we will process a full refund for the duplicate transaction within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">3. Download Assistance</h2>
            <p>
              If you experience any issues accessing your files or logging into your dashboard after completing payment, please contact our support team at support@promptresume.com or via Instagram DM (@prompt_resume). We will assist you immediately.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Prompt Resume. All rights reserved.
      </footer>
    </div>
  );
}
