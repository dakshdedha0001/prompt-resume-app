import Link from "next/link";

export default function TermsConditions() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms & Conditions</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing Prompt Resume (promptresume.shop) and purchasing the ₹99 Prompt Resume Toolkit, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">2. Intellectual Property & Digital License</h2>
            <p>
              All ebook content, AI prompt sheets, and ATS Word templates provided in the toolkit are the intellectual property of Prompt Resume. Purchasing grants you a non-exclusive, personal single-user license. You may not re-sell, redistribute, or publicly host these files.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">3. Product Delivery</h2>
            <p>
              The toolkit is a digital download product. Access to all files is granted immediately on your Student Dashboard upon successful payment completion via Razorpay.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">4. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of New Delhi, India.
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
