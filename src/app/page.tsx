"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openCurriculum, setOpenCurriculum] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "bot" | "user"; text: string }>
  >([
    {
      sender: "bot",
      text: "Hi! 👋 I'm your AI Career Assistant. Ask me anything about resumes, ATS systems, cover letters, LinkedIn optimization, or the Prompt Resume toolkit!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Countdown Timer State (14 mins 45 seconds ticking down)
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 45 });

  // FOMO Purchase Toast State
  const [fomoToast, setFomoToast] = useState<{ name: string; city: string; time: string } | null>(null);

  // Lightbox Zoom Modal State
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const productSlides = [
    {
      src: "/images/promptresume.png",
      alt: "Prompt Resume Ebook Cover",
      badge: "Cover Shot",
      title: "The AI Resume Blueprint — Book Cover",
    },
    {
      src: "/images/page_2.png",
      alt: "Why This Book Exists — Page 02",
      badge: "Inside • Page 02",
      title: "Page 02 — Why This Book Exists & How to Use Prompts",
    },
    {
      src: "/images/page_3.png",
      alt: "Table of Contents",
      badge: "Inside • Contents",
      title: "Table of Contents — All 23 Chapters Overview",
    },
    {
      src: "/images/page_4.png",
      alt: "Chapter 1 Prompt Excerpt",
      badge: "Inside • Chapter 01",
      title: "Chapter 01 — ATS Compatibility Checker Prompt Sheet",
    },
  ];

  // Auto-play slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % productSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [productSlides.length]);

  // Urgency Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 14, seconds: 45 }; // Reset for continuous urgency
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live FOMO Toast Loop
  useEffect(() => {
    const notifications = [
      { name: "Rahul S.", city: "Delhi", time: "2 mins ago" },
      { name: "Priya V.", city: "Mumbai", time: "5 mins ago" },
      { name: "Ankit K.", city: "Bengaluru", time: "1 min ago" },
      { name: "Sneha M.", city: "Pune", time: "8 mins ago" },
      { name: "Aman G.", city: "Hyderabad", time: "3 mins ago" },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setFomoToast(notifications[idx % notifications.length]);
      idx++;
      setTimeout(() => setFomoToast(null), 4000);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Yes, 100%! The Prompt Resume Toolkit is designed to get you interview calls for any field — MBA, B.Tech, BBA, Finance, Marketing & Freshers. Get instant access for ₹99 today! 🚀",
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Yes, 100%! The Prompt Resume Toolkit is designed to get you interview calls for any field — MBA, B.Tech, BBA, Finance, Marketing & Freshers. Get instant access for ₹99 today! 🚀",
        },
      ]);
    }
  };

  const handleBuyClick = () => {
    window.location.href = "https://rzp.io/rzp/LVhAvNk";
  };

  const curriculumParts = [
    {
      title: "Part 1 — Foundations & ATS Architecture",
      chapters: [
        "Ch 01: Understanding ATS: The Gatekeeper You Can't See",
        "Ch 02: Resume Structure: The Anatomy of a Resume That Gets Opened",
        "Ch 03: The AI Resume Workflow: End-to-End Execution Strategy",
      ],
    },
    {
      title: "Part 2 — Core Sections Mastery",
      chapters: [
        "Ch 04: Professional Summary: Your 3-Line High-Impact Pitch",
        "Ch 05: Skills Section: Signal vs Noise Optimization",
        "Ch 06: Projects: Where Freshers & MBAs Actually Win",
        "Ch 07: Experience & Internships: Proving You Can Deliver",
        "Ch 08: Certificates & Achievements: Proof of Standing Out",
      ],
    },
    {
      title: "Part 3 — Digital Presence & Outreach",
      chapters: [
        "Ch 09: LinkedIn Profile Optimization: Your 24/7 Resume",
        "Ch 10: Cover Letters: The Undersued Differentiator",
        "Ch 11: Cold Emailing Recruiters & Hiring Managers",
        "Ch 12: Executive & MBA Customization Frameworks",
      ],
    },
    {
      title: "Part 4 — Review & AI Optimization",
      chapters: [
        "Ch 13: ATS Keyword Generator & Formatting Checker",
        "Ch 14: Action Verbs Bank & Bullet Point Generator",
        "Ch 15: Humanizing AI Output: Sounding Like a Pro, Not a Bot",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Ankit Sharma",
      role: "B.Tech Computer Science Fresher",
      text: "I sent out 40+ resumes before and got zero callbacks. After applying Chapter 4 & 13 prompts from this toolkit, my resume score jumped and I landed 3 interviews in a week!",
      rating: "⭐⭐⭐⭐⭐",
      company: "Placed at TCS Digital",
    },
    {
      name: "Priya Verma",
      role: "MBA Marketing Candidate",
      text: "The MBA leadership bullet points and LinkedIn headline prompts alone are worth 100x the ₹99 price! Highly recommended for all management grads.",
      rating: "⭐⭐⭐⭐⭐",
      company: "Interned at Deloitte",
    },
    {
      name: "Rohan Gupta",
      role: "Finance & B.Com Graduate",
      text: "The 3 Word ATS templates are so clean and easy to edit in Word. The AI prompts written specifically for ChatGPT & Claude made writing my resume effortless.",
      rating: "⭐⭐⭐⭐⭐",
      company: "Placed at Genpact",
    },
  ];

  const faqs = [
    {
      q: "What is included in the ₹99 Prompt Resume Toolkit?",
      a: "You get the complete 52-page PDF Ebook (23 chapters), 30+ ready-to-use copyable AI prompts, 3 ATS-formatted Word templates (.docx), 10+ cover letter & cold email scripts, a LinkedIn optimization guide, and a 7-category HR audit matrix.",
    },
    {
      q: "Which AI tools work with these prompts?",
      a: "Our prompts are tested and 100% compatible with ChatGPT (3.5 & GPT-4), Claude, Google Gemini, and Grok. Just copy and paste!",
    },
    {
      q: "Will I get lifetime access?",
      a: "Yes! This is a one-time payment of ₹99 with lifetime access. No monthly subscriptions or hidden charges.",
    },
    {
      q: "How will I receive the files after payment?",
      a: "Immediately after successful payment via Razorpay, you will be redirected to the instant download page to download all PDFs and DOCX files.",
    },
    {
      q: "Are the Word templates easy to edit?",
      a: "Yes! You can edit them in Microsoft Word, Google Docs, WPS Office, or any word processor on phone or laptop.",
    },
    {
      q: "What if I face any payment or download issues?",
      a: "You can click the WhatsApp button at the bottom right of the site anytime. Our support team will assist you immediately!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111827] font-sans antialiased">
      {/* Top Urgency Banner Bar */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white text-center py-2 px-4 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md">
        <span>⚡ HURRY UP! FLASH SALE IS LIVE:</span>
        <span className="bg-black/30 px-2.5 py-0.5 rounded-md tracking-wider font-mono">
          {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
        <span className="hidden md:inline">• 80% OFF (₹499 → ₹99 Only)</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-[#e5e7eb]">
        <div className="max-w-[1060px] mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            Prompt <span className="text-[#2563eb]">Resume</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#whats-inside" className="hover:text-black transition">
              What's Inside
            </a>
            <a href="#curriculum" className="hover:text-black transition">
              Curriculum
            </a>
            <a href="#pdf-preview" className="hover:text-black transition">
              Book Preview
            </a>
            <a href="#reviews" className="hover:text-black transition">
              Reviews
            </a>
            <a href="#faq" className="hover:text-black transition">
              FAQ
            </a>

            {/* Clerk Auth Integration */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[#2563eb] font-semibold hover:underline cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="bg-blue-50 text-[#2563eb] border border-blue-200 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-100 transition flex items-center gap-1.5"
              >
                <span>👤 My Account</span>
              </Link>
              <UserButton />
            </Show>

            <button
              onClick={handleBuyClick}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm cursor-pointer animate-pulse"
            >
              Buy Now – ₹99
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-5 py-4 flex flex-col gap-3">
            <a
              href="#whats-inside"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-800"
            >
              What's Inside
            </a>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-800"
            >
              Curriculum
            </a>
            <a
              href="#pdf-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-800"
            >
              Book Preview
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-800"
            >
              Reviews
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-800"
            >
              FAQ
            </a>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-left font-semibold text-[#2563eb]">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-[#2563eb] flex items-center gap-1"
              >
                👤 My Account Dashboard
              </Link>
              <UserButton />
            </Show>
            <button
              onClick={handleBuyClick}
              className="bg-[#2563eb] text-white py-2.5 rounded-lg font-semibold text-center w-full mt-2"
            >
              Get Instant Access – ₹99
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-5 max-w-[1060px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#2563eb] px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <span>⭐ 4.9/5 Rating</span>
              <span>•</span>
              <span>1,420+ Candidates Helped</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Stop Guessing What Recruiters Want. Start Using the System That Gets You Interviews.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              The AI Resume Blueprint gives students, freshers, and MBAs a step-by-step system — plus ready-to-use AI prompts — to build an ATS-proof resume and LinkedIn profile that actually gets replies.
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs">
                📘 52-Page PDF Ebook
              </span>
              <span className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs">
                ⚡ 30+ AI Prompts
              </span>
              <span className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs">
                📑 3 ATS Word Templates
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Works with <strong className="text-gray-600">ChatGPT</strong> • <strong className="text-gray-600">Claude</strong> • <strong className="text-gray-600">Gemini</strong> • <strong className="text-gray-600">Grok</strong>
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
              <button
                onClick={handleBuyClick}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-7 py-3.5 rounded-xl font-bold text-base transition shadow-md hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
              >
                Get Instant Access – ₹99 <span className="line-through opacity-70 text-xs font-normal ml-1">₹499</span>
              </button>

              <div className="text-xs text-amber-700 font-extrabold flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <span>🔥 Only 7 copies left at ₹99!</span>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-gray-500 font-medium">
              <span>🔒 Secure Checkout</span>
              <span>•</span>
              <span>⚡ Instant Access</span>
              <span>•</span>
              <span>♾️ Lifetime Access</span>
            </div>
          </div>

          {/* Interactive Product Gallery Carousel with Zoom Feature */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] space-y-3">
              <div
                onClick={() =>
                  setLightboxImage({
                    src: productSlides[activeSlide].src,
                    title: productSlides[activeSlide].title,
                  })
                }
                className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-[#090d16] cursor-pointer group"
              >
                {productSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${
                      idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      priority={idx === 0}
                    />
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-sky-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-sky-400/30">
                      {slide.badge}
                    </span>

                    {/* Zoom Overlay Indicator */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[2px]">
                      <span>🔍 Click to View Fullscreen</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {productSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-14 rounded-lg overflow-hidden border-2 transition relative ${
                      idx === activeSlide
                        ? "border-[#2563eb] opacity-100 ring-2 ring-blue-500/20"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={slide.src} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Headlines Marquee */}
      <section className="bg-[#111827] py-3.5 overflow-hidden">
        <div className="whitespace-nowrap flex gap-8 animate-marquee text-white text-sm font-semibold">
          <span>🚀 Stop Guessing What Recruiters Want</span>
          <span className="text-blue-500">•</span>
          <span>⚡ 80% OFF FLASH SALE — ₹99 ONLY (REGULAR ₹499)</span>
          <span className="text-blue-500">•</span>
          <span>📑 3 Word ATS Templates Ready</span>
          <span className="text-blue-500">•</span>
          <span>🎯 Works for MBA, Tech, Freshers & Experienced</span>
          <span className="text-blue-500">•</span>
          <span>🔥 OFFER ENDS IN {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s</span>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="whats-inside" className="py-14 px-5 max-w-[1060px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            What's Inside
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Everything You Need to Build an ATS-Proof Resume
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">📘</div>
            <h3 className="font-bold text-lg mb-1">52-Page Ebook Blueprint</h3>
            <p className="text-sm text-gray-600">23 step-by-step chapters guiding you from resume audit to interview preparation.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-1">30+ AI Prompt Sheets</h3>
            <p className="text-sm text-gray-600">Ready-to-use, copy-paste prompts to write bullet points, ATS keywords, and summaries.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">📑</div>
            <h3 className="font-bold text-lg mb-1">3 ATS Word Templates</h3>
            <p className="text-sm text-gray-600">Classic, Modern, and Internship formats (.docx) designed to pass ATS screeners.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-bold text-lg mb-1">Cover Letters & Emails</h3>
            <p className="text-sm text-gray-600">10+ tailored templates for cold emailing recruiters and follow-up messages.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-lg mb-1">LinkedIn Optimizer</h3>
            <p className="text-sm text-gray-600">Generate high-converting headlines, about sections, and experience descriptions.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-1">7-Category HR Matrix</h3>
            <p className="text-sm text-gray-600">Audit your own resume against the exact scorecard HR recruiters use to screen candidates.</p>
          </div>
        </div>
      </section>

      {/* Curriculum Breakdown Section */}
      <section id="curriculum" className="py-14 px-5 bg-white border-y border-gray-200">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
              Complete Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Table of Contents — All 23 Chapters
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Organized into 4 actionable parts designed to build your job-winning resume step-by-step.
            </p>
          </div>

          <div className="space-y-3">
            {curriculumParts.map((part, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50"
              >
                <button
                  onClick={() => setOpenCurriculum(openCurriculum === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-bold text-base flex justify-between items-center text-gray-900 bg-white"
                >
                  <span>{part.title}</span>
                  <span className="text-[#2563eb] text-xl font-extrabold">
                    {openCurriculum === idx ? "−" : "+"}
                  </span>
                </button>

                {openCurriculum === idx && (
                  <div className="px-6 py-4 space-y-2.5 border-t border-gray-100 bg-white">
                    {part.chapters.map((ch, chIdx) => (
                      <div
                        key={chIdx}
                        className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <span className="text-[#2563eb]">▸</span>
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Screenshots Preview Section with Click-to-Zoom */}
      <section id="pdf-preview" className="py-14 px-5 max-w-[1060px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            Inside The Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Sneak Peek Inside The 52-Page PDF Ebook
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Click any page screenshot below to view it in full resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {productSlides.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage({ src: slide.src, title: slide.title })}
              className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-lg transition cursor-pointer group"
            >
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900 mb-3">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[2px]">
                  <span>🔍 Click to Zoom</span>
                </div>
              </div>
              <div className="font-semibold text-xs text-gray-800 line-clamp-1">
                {slide.title}
              </div>
              <div className="text-[11px] text-[#2563eb] font-medium mt-0.5">
                Click to view high-res PDF →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Reviews & Testimonials Section */}
      <section id="reviews" className="py-14 px-5 bg-white border-y border-gray-200">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
              Student Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Trusted by 1,400+ Freshers, MBAs & Candidates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#fafafa] border border-gray-200 p-6 rounded-2xl shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-yellow-400 text-sm mb-2">{t.rating}</div>
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-4">
                    "{t.text}"
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <strong className="block text-sm text-gray-900 font-bold">{t.name}</strong>
                  <span className="block text-xs text-gray-500">{t.role}</span>
                  <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5">
                    ✓ {t.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-14 px-5 max-w-[680px] mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-semibold text-sm flex justify-between items-center text-gray-900"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 text-lg">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Catchy High-Converting Pricing Card Section */}
      <section id="pricing" className="py-14 px-5 max-w-[460px] mx-auto w-full">
        <div className="bg-white border-2 border-[#2563eb] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden ring-4 ring-blue-500/10">
          <div className="bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-6 transform rotate-45 absolute top-4 -right-10 w-40 shadow-sm">
            80% OFF
          </div>

          <span className="inline-block bg-red-50 text-red-600 text-xs font-extrabold px-3.5 py-1 rounded-full mb-4 border border-red-200">
            🔥 FLASH SALE ENDS IN {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>

          <div className="flex items-baseline justify-center gap-3 mb-1">
            <span className="text-5xl font-black text-[#2563eb] tracking-tight">₹99</span>
            <span className="text-xl text-gray-400 line-through font-bold">₹499</span>
          </div>

          <p className="text-xs text-gray-500 font-medium mb-5">
            Regular Price ₹499 • Launch Special ₹99 • Lifetime Access
          </p>

          <button
            onClick={handleBuyClick}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 px-6 rounded-xl font-extrabold text-base w-full transition shadow-lg hover:-translate-y-0.5 cursor-pointer animate-bounce"
          >
            ⚡ Get Instant Access – ₹99 Only
          </button>

          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium text-left">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>52-Page Ebook PDF (23 Chapters)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>30+ Copyable AI Prompt Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>3 Word ATS Templates (.docx)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Instant Download & Student Dashboard</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-gray-500 font-medium">
            <span>🔒 Secure Razorpay</span>
            <span>•</span>
            <span>⚡ Instant Delivery</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-200 pt-12 pb-20 md:pb-10 mt-auto">
        <div className="max-w-[1060px] mx-auto px-5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div>© {new Date().getFullYear()} Prompt Resume. All rights reserved. • New Delhi, India</div>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-gray-600">
              <Link href="/privacy-policy" className="hover:text-blue-600 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-blue-600 transition">
                Refund Policy
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-[10px] text-red-600 font-extrabold uppercase flex items-center gap-1">
            <span>🔥 80% OFF ENDS IN</span>
            <span className="font-mono">{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>
          <div className="text-base font-extrabold text-[#2563eb]">
            ₹99 <span className="text-xs text-gray-400 line-through font-normal">₹499</span>
          </div>
        </div>
        <button
          onClick={handleBuyClick}
          className="bg-[#2563eb] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md cursor-pointer animate-pulse"
        >
          Buy Now – ₹99
        </button>
      </div>

      {/* Live Social Proof Purchase Notification Toast */}
      {fomoToast && (
        <div className="fixed bottom-20 left-5 z-[9999] bg-white border border-gray-200 shadow-2xl rounded-xl p-3 flex items-center gap-3 animate-slideUp text-xs">
          <span className="text-xl">🎉</span>
          <div>
            <strong className="block text-gray-900 font-bold">
              {fomoToast.name} from {fomoToast.city}
            </strong>
            <span className="text-gray-500">Purchased Prompt Resume Toolkit ({fomoToast.time})</span>
          </div>
        </div>
      )}

      {/* Floating Action Buttons Stack (WhatsApp + AI Chatbot) */}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-3 items-center">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919999999999?text=Hi,%20I%20have%20a%20question%20about%20Prompt%20Resume"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
          aria-label="Chat on WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xl shadow-lg hover:scale-105 transition cursor-pointer"
          aria-label="Open AI Assistant"
        >
          💬
        </button>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:-right-10 text-white hover:text-gray-300 text-3xl font-bold z-50 p-2"
            >
              ✕
            </button>
            <div className="relative w-full h-full max-h-[80vh] rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="text-white text-xs sm:text-sm font-semibold mt-4 text-center bg-gray-900/80 px-4 py-2 rounded-full border border-gray-700">
              {lightboxImage.title} • (Click anywhere to close)
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Window Overlay */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[10000] flex flex-col overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <strong className="block text-sm">Prompt Resume AI</strong>
                <span className="text-[11px] text-gray-500">Career Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#2563eb] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="p-2 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about resumes, ATS..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-[#2563eb] text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
