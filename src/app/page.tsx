"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignUp } = useClerk();

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      title: "The AI Resume Blueprint: Book Cover",
    },
    {
      src: "/images/page_2.png",
      alt: "Why This Book Exists: Page 02",
      badge: "Inside: Page 02",
      title: "Page 02: Why This Book Exists & How to Use Prompts",
    },
    {
      src: "/images/page_3.png",
      alt: "Table of Contents",
      badge: "Inside: Contents",
      title: "Table of Contents: All 23 Chapters Overview",
    },
    {
      src: "/images/page_4.png",
      alt: "Chapter 1 Prompt Excerpt",
      badge: "Inside: Chapter 01",
      title: "Chapter 01: ATS Compatibility Checker Prompt Sheet",
    },
  ];

  // Dynamically load Razorpay SDK Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Razorpay Standard Checkout Implementation
  const triggerRazorpayCheckout = async () => {
    const hasPaid =
      user?.publicMetadata?.has_paid === true ||
      user?.unsafeMetadata?.has_paid === true;

    if (hasPaid) {
      window.location.href = "/dashboard";
      return;
    }

    setIsProcessingPayment(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order");
      }

      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_live_TMPbTHK6smTVy5";

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Prompt Resume",
          description: "The AI Resume Blueprint & ATS Toolkit",
          image: "/favicon.ico",
          order_id: orderData.order_id,
          prefill: {
            name: user?.fullName || user?.firstName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: {
            color: "#1d1d1f",
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                window.location.href = "/dashboard?paid=true";
              } else {
                alert(
                  verifyData.message ||
                    "Payment verification failed. Please contact support."
                );
              }
            } catch (err) {
              console.error("Verification error:", err);
              window.location.href = "/dashboard?paid=true";
            } finally {
              setIsProcessingPayment(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        window.location.href = "https://rzp.io/rzp/LVhAvNk";
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err?.message || "Could not launch payment checkout. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const hasPaid =
        user.publicMetadata?.has_paid === true ||
        user.unsafeMetadata?.has_paid === true;

      const pendingBuy = sessionStorage.getItem("pending_buy") === "true";

      if (pendingBuy && !hasPaid) {
        sessionStorage.removeItem("pending_buy");
        triggerRazorpayCheckout();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % productSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [productSlides.length]);

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
            text: "Yes, 100%! The Prompt Resume Toolkit is designed to get you interview calls for any field. Get instant access today!",
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Yes, 100%! The Prompt Resume Toolkit is designed to get you interview calls for any field. Get instant access today!",
        },
      ]);
    }
  };

  const handleBuyClick = () => {
    if (!isSignedIn) {
      sessionStorage.setItem("pending_buy", "true");
      openSignUp({
        fallbackRedirectUrl: "/",
        forceRedirectUrl: "/",
      });
    } else {
      triggerRazorpayCheckout();
    }
  };

  const curriculumParts = [
    {
      title: "Part 1: Foundations & ATS Architecture",
      chapters: [
        "Ch 01: Understanding ATS: The Gatekeeper You Can't See",
        "Ch 02: Resume Structure: Anatomy of a Resume That Gets Opened",
        "Ch 03: The AI Resume Workflow: End-to-End Strategy",
      ],
    },
    {
      title: "Part 2: Core Sections Mastery",
      chapters: [
        "Ch 04: Professional Summary: Your 3-Line Pitch",
        "Ch 05: Skills Section: Signal vs Noise Optimization",
        "Ch 06: Projects: Where Freshers & MBAs Win",
        "Ch 07: Experience & Internships: Proving You Can Deliver",
        "Ch 08: Certificates & Achievements: Proof of Standing Out",
      ],
    },
    {
      title: "Part 3: Digital Presence & Outreach",
      chapters: [
        "Ch 09: LinkedIn Optimization: Your 24/7 Resume",
        "Ch 10: Cover Letters: The Undersued Differentiator",
        "Ch 11: Cold Emailing Recruiters & Hiring Managers",
        "Ch 12: Executive & MBA Customization Frameworks",
      ],
    },
    {
      title: "Part 4: Review & AI Optimization",
      chapters: [
        "Ch 13: ATS Keyword Generator & Format Checker",
        "Ch 14: Action Verbs Bank & Bullet Point Generator",
        "Ch 15: Humanizing AI Output: Sounding Like a Pro",
      ],
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
      a: "Immediately after successful payment via Razorpay, you will be redirected to your Student Dashboard to download all PDFs and DOCX files.",
    },
    {
      q: "Are the Word templates easy to edit?",
      a: "Yes! You can edit them in Microsoft Word, Google Docs, WPS Office, or any word processor on phone or laptop.",
    },
    {
      q: "What if I face any payment or download issues?",
      a: "You can click the Instagram DM button at the bottom right of the site anytime or message us @prompt_resume on Instagram. Our support team will assist you immediately!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e5e5ea] transition-all duration-300">
        <div className="max-w-[1060px] mx-auto px-5 h-[52px] flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Prompt Resume
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-[#424245]">
            <a href="#whats-inside" className="hover:text-[#1d1d1f] transition-colors">
              What's Inside
            </a>
            <a href="#curriculum" className="hover:text-[#1d1d1f] transition-colors">
              Curriculum
            </a>
            <a href="#pdf-preview" className="hover:text-[#1d1d1f] transition-colors">
              Book Preview
            </a>
            <a href="#faq" className="hover:text-[#1d1d1f] transition-colors">
              FAQ
            </a>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[#0066cc] font-medium hover:underline cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-[#1d1d1f] font-medium hover:underline cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="text-[#0066cc] font-medium hover:underline flex items-center gap-1.5"
              >
                <span>My Account</span>
              </Link>
              <UserButton />
            </Show>

            <button
              onClick={handleBuyClick}
              className="bg-[#1d1d1f] hover:bg-[#000000] text-white px-4 py-1.5 rounded-full font-medium text-[13px] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Buy Now</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#1d1d1f] hover:bg-[#e5e5ea] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fbfbfd] border-b border-[#e5e5ea] px-5 py-6 flex flex-col gap-5 shadow-sm">
            <a
              href="#whats-inside"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-[15px] text-[#1d1d1f]"
            >
              What's Inside
            </a>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-[15px] text-[#1d1d1f]"
            >
              Curriculum
            </a>
            <a
              href="#pdf-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-[15px] text-[#1d1d1f]"
            >
              Book Preview
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-[15px] text-[#1d1d1f]"
            >
              FAQ
            </a>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-left font-medium text-[#0066cc] text-[15px]">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-[#0066cc] flex items-center gap-1.5 text-[15px]"
              >
                My Account Dashboard
              </Link>
              <UserButton />
            </Show>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-5 max-w-[1060px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
              The AI Resume Blueprint
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0f172a] leading-[1.05]">
              Get the resume <br className="hidden lg:block"/> recruiters actually want.
            </h1>
            <p className="text-[17px] sm:text-[19px] text-[#475569] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              A step-by-step system with ready-to-use AI prompts to build an ATS-proof resume and LinkedIn profile that gets you interviews.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="bg-[#f1f5f9] text-[#1e293b] text-[13px] font-semibold px-4 py-1.5 rounded-full border border-[#e2e8f0]">
                52-Page Ebook
              </span>
              <span className="bg-[#f1f5f9] text-[#1e293b] text-[13px] font-semibold px-4 py-1.5 rounded-full border border-[#e2e8f0]">
                30+ AI Prompts
              </span>
              <span className="bg-[#f1f5f9] text-[#1e293b] text-[13px] font-semibold px-4 py-1.5 rounded-full border border-[#e2e8f0]">
                ATS Templates
              </span>
            </div>

            <p className="text-[13px] text-[#64748b] font-medium">
              Compatible with ChatGPT, Claude, Gemini, and Grok.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={handleBuyClick}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all cursor-pointer w-full sm:w-auto shadow-md hover:shadow-lg active:scale-98"
              >
                Buy Now for ₹99
              </button>
            </div>
            
            <div className="text-[12px] text-[#64748b] font-medium flex items-center justify-center lg:justify-start gap-1.5">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#0071e3]">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              Secured by Razorpay • Instant Access
            </div>
          </div>

          {/* Minimalist Product Gallery Carousel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] space-y-4">
              <div
                onClick={() =>
                  setLightboxImage({
                    src: productSlides[activeSlide].src,
                    title: productSlides[activeSlide].title,
                  })
                }
                className="relative h-[440px] w-full rounded-[2rem] overflow-hidden bg-white border border-[#e5e5ea] shadow-sm cursor-pointer group flex items-center justify-center"
              >
                {productSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                      idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority={idx === 0}
                    />
                    <span className="absolute top-4 right-4 bg-[#f5f5f7]/90 backdrop-blur-md text-[#1d1d1f] text-[11px] font-medium px-3 py-1 rounded-full">
                      {slide.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Minimalist Thumbnails */}
              <div className="flex justify-center gap-2.5">
                {productSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? "bg-[#1d1d1f] w-6"
                        : "bg-[#d2d2d7] hover:bg-[#86868b]"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Marquee */}
      <section className="bg-white border-y border-[#e5e5ea] py-4 overflow-hidden">
        <div className="whitespace-nowrap flex gap-12 animate-marquee text-[#1d1d1f] text-[13px] font-medium tracking-wide">
          <span>Stop Guessing What Recruiters Want</span>
          <span className="text-[#d2d2d7]">/</span>
          <span>Limited Time Launch Price: ₹99</span>
          <span className="text-[#d2d2d7]">/</span>
          <span>3 Word ATS Templates Ready</span>
          <span className="text-[#d2d2d7]">/</span>
          <span>Works for MBA, Tech, Freshers & Experienced</span>
          <span className="text-[#d2d2d7]">/</span>
          <span>Stop Guessing What Recruiters Want</span>
          <span className="text-[#d2d2d7]">/</span>
          <span>Limited Time Launch Price: ₹99</span>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="whats-inside" className="py-24 px-5 max-w-[1060px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
            Everything you need.
          </h2>
          <p className="text-[17px] text-[#475569] mt-3 font-medium">
            A complete toolkit to build an ATS-proof resume from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📘",
              title: "52-Page Ebook",
              desc: "23 step-by-step chapters guiding you from resume audit to interview preparation.",
            },
            {
              icon: "⚡",
              title: "30+ AI Prompts",
              desc: "Ready-to-use, copy-paste prompts to write bullet points, ATS keywords, and summaries.",
            },
            {
              icon: "📑",
              title: "ATS Templates",
              desc: "Classic, Modern, and Internship formats (.docx) designed to pass ATS screeners.",
            },
            {
              icon: "✉️",
              title: "Cover Letters",
              desc: "10+ tailored templates for cold emailing recruiters and follow-up messages.",
            },
            {
              icon: "💼",
              title: "LinkedIn Optimizer",
              desc: "Generate high-converting headlines, about sections, and experience descriptions.",
            },
            {
              icon: "📊",
              title: "HR Matrix",
              desc: "Audit your own resume against the exact scorecard HR recruiters use to screen candidates.",
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-[#e2e8f0] hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl mb-4 grayscale opacity-85">{feature.icon}</div>
              <h3 className="font-bold text-[17px] text-[#0f172a] mb-2">{feature.title}</h3>
              <p className="text-[14px] text-[#475569] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Breakdown Section */}
      <section id="curriculum" className="py-24 px-5 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
              The Roadmap.
            </h2>
            <p className="text-[17px] text-[#475569] mt-3 font-medium">
              Organized into 4 actionable parts to build your job-winning resume.
            </p>
          </div>

          <div className="space-y-4">
            {curriculumParts.map((part, idx) => (
              <div
                key={idx}
                className="border-b border-[#e2e8f0] pb-2 last:border-0"
              >
                <button
                  onClick={() => setOpenCurriculum(openCurriculum === idx ? null : idx)}
                  className="w-full py-4 text-left font-semibold text-[17px] flex justify-between items-center text-[#0f172a] hover:text-[#0071e3] transition-colors"
                >
                  <span>{part.title}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform duration-300 ${openCurriculum === idx ? 'rotate-180 text-[#0071e3]' : 'text-[#64748b]'}`}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openCurriculum === idx ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-2 space-y-3 pt-2">
                    {part.chapters.map((ch, chIdx) => (
                      <div
                        key={chIdx}
                        className="text-[14px] font-medium text-[#334155] flex items-start gap-3"
                      >
                        <span className="text-[#0071e3] mt-0.5">•</span>
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Screenshots Preview Section */}
      <section id="pdf-preview" className="py-24 px-5 max-w-[1060px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
            Inside the blueprint.
          </h2>
          <p className="text-[17px] text-[#475569] mt-3 font-medium">
            A sneak peek inside the 52-page PDF ebook.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productSlides.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage({ src: slide.src, title: slide.title })}
              className="group cursor-pointer"
            >
              <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-[#f8fafc] border border-[#e2e8f0] mb-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="font-semibold text-[14px] text-[#0f172a]">
                {slide.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-5 max-w-[780px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
            Questions?
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-[#e2e8f0] last:border-0"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-5 text-left font-semibold text-[16px] flex justify-between items-center text-[#0f172a] hover:text-[#0071e3] transition-colors"
              >
                <span>{faq.q}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#0071e3]' : 'text-[#64748b]'}`}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[400px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <div className="text-[15px] text-[#334155] leading-relaxed pr-8 font-normal">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clean Pricing Card Section */}
      <section id="pricing" className="py-24 px-5 max-w-[460px] mx-auto w-full">
        <div className="bg-white border border-[#e2e8f0] rounded-[2rem] p-10 text-center shadow-lg relative overflow-hidden">
          <div className="mb-2">
             <span className="text-[13px] font-bold tracking-widest text-[#0071e3] uppercase bg-[#0071e3]/10 px-3 py-1 rounded-full">Lifetime Access</span>
          </div>

          <div className="flex items-baseline justify-center gap-2 mb-2 mt-4">
            <span className="text-6xl font-bold text-[#0f172a] tracking-tight">₹99</span>
          </div>
          
          <div className="text-[15px] text-[#64748b] font-medium mb-8">
            <span className="line-through">Regular Price ₹499</span>
          </div>

          <button
            onClick={handleBuyClick}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white py-4 px-6 rounded-full font-semibold text-[16px] w-full transition-all cursor-pointer shadow-md hover:shadow-lg mb-6 active:scale-98"
          >
            Buy Now for ₹99
          </button>

          <div className="space-y-3 text-[14px] text-[#1e293b] font-medium text-left bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>52-Page Ebook PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>30+ AI Prompts</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>3 ATS Templates</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#fbfbfd] border-t border-[#e5e5ea] pt-12 pb-24 md:pb-12 mt-auto">
        <div className="max-w-[1060px] mx-auto px-5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-[12px] text-[#86868b] gap-6">
            <div>© {new Date().getFullYear()} Prompt Resume. All rights reserved. New Delhi, India.</div>
            <div className="flex flex-wrap justify-center gap-6 font-medium">
              <Link href="/privacy-policy" className="hover:text-[#1d1d1f] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#1d1d1f] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-[#1d1d1f] transition-colors">
                Refund Policy
              </Link>
              <Link href="/contact" className="hover:text-[#1d1d1f] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Buy Bar (Clean) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-[#e5e5ea] px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-[17px] font-semibold text-[#1d1d1f]">
            ₹99
          </div>
          <div className="text-[12px] text-[#86868b] font-medium">
            Lifetime Access
          </div>
        </div>
        <button
          onClick={handleBuyClick}
          className="bg-[#1d1d1f] hover:bg-[#000000] text-white px-6 py-2.5 rounded-full font-medium text-[14px] cursor-pointer transition-colors"
        >
          Buy Now
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-[999] flex flex-col gap-3 items-center">
        {/* Instagram DM Button */}
        <a
          href="https://ig.me/m/prompt_resume"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg transition-all duration-150 ease-out hover:scale-110 active:scale-95"
          aria-label="DM on Instagram"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center shadow-lg transition-all duration-150 ease-out hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16.01" />
            <line x1="16" y1="16" x2="16" y2="16.01" />
          </svg>
        </button>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[100000] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 sm:-top-8 sm:-right-8 text-[#1d1d1f] hover:text-[#86868b] p-2 transition-colors"
            >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="relative w-full h-full max-h-[80vh] rounded-2xl overflow-hidden bg-white border border-[#e5e5ea] shadow-sm">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="text-[#1d1d1f] text-[13px] font-medium mt-6 text-center">
              {lightboxImage.title}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-5 w-[340px] sm:w-[380px] bg-white border border-[#e5e5ea] rounded-2xl shadow-xl z-[10000] flex flex-col overflow-hidden animate-fadeIn">
          <div className="px-5 py-4 border-b border-[#e5e5ea] flex justify-between items-center bg-[#fbfbfd]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-[14px]">AI</div>
              <div>
                <strong className="block text-[14px] font-semibold text-[#1d1d1f]">Career Assistant</strong>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="p-5 h-[320px] overflow-y-auto space-y-4 bg-white">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1d1d1f] text-white rounded-br-sm"
                      : "bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="p-3 border-t border-[#e5e5ea] flex gap-2 bg-[#fbfbfd]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2.5 text-[14px] bg-white border border-[#e5e5ea] rounded-full outline-none focus:border-[#1d1d1f] transition-colors"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}

      {/* Hidden Razorpay Payment Button Container for Overlay Checkout Modal */}
      <form id="rzp-payment-form" className="hidden" />
    </div>
  );
}
