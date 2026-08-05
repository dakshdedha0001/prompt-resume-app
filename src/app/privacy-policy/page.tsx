import Link from "next/link";

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you purchase the Prompt Resume Toolkit or sign up for an account via Clerk Authentication, we collect basic personal information including your full name, email address, and payment details processed via Razorpay. We do not store credit/debit card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your information to fulfill digital file downloads, manage student account access on your dashboard, provide customer support via WhatsApp or email, and send order confirmation updates.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">3. Data Security & Third Parties</h2>
            <p>
              We implement industry-standard encryption and security measures. We do not sell or trade your personal data. Authentication is secured by Clerk, and payments are processed via PCI-DSS compliant Razorpay.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-900 mb-2">4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please email us at support@promptresume.com.
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
