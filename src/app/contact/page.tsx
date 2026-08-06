import Link from "next/link";

export default function ContactUs() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Contact Us & Support</h1>
        <p className="text-sm text-gray-600 mb-8">
          Have a question about the Prompt Resume Toolkit or need help with your order? Reach out to us below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs">
            <div className="text-3xl mb-3">📧</div>
            <strong className="block text-base font-bold text-gray-900 mb-1">Email Support</strong>
            <p className="text-xs text-gray-500 mb-3">Response time: Within 24 hours</p>
            <a href="mailto:support@promptresume.com" className="text-[#2563eb] font-semibold text-sm hover:underline">
              support@promptresume.com
            </a>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs">
            <div className="text-3xl mb-3">📸</div>
            <strong className="block text-base font-bold text-gray-900 mb-1">Instant Instagram DM Support</strong>
            <p className="text-xs text-gray-500 mb-3">Fastest response @prompt_resume</p>
            <a
              href="https://ig.me/m/prompt_resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition"
            >
              Message @prompt_resume on Instagram →
            </a>
          </div>
        </div>

        <div className="mt-10 bg-gray-100 p-6 rounded-2xl text-xs text-gray-600 space-y-1">
          <strong className="block text-sm text-gray-900 font-bold mb-2">Operating Address:</strong>
          <p>Prompt Resume Blueprint System</p>
          <p>New Delhi, India — 110001</p>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Prompt Resume. All rights reserved.
      </footer>
    </div>
  );
}
