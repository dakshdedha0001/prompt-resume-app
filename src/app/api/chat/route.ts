import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY || "";

    const systemPrompt = `You are Prompt Resume AI, a highly intelligent, empathetic, persuasive, and expert AI Career Assistant for the Prompt Resume Toolkit (promptresume.shop).

INSTRUCTIONS:
1. DIRECT & SPECIFIC: Always answer the user's specific question directly first. Do NOT give robotic or repetitive generic answers. Adapt to their specific field (e.g. B.Tech, MBA, Finance, Marketing, Design, Freshers, Experienced).
2. TONE & LANGUAGE: Friendly, highly encouraging, conversational, and natural. Match the user's language (English or Hinglish).
3. REFUND POLICY: If asked about refund/return/cancellation:
   "Due to immediate digital file delivery (PDF Ebook & ATS Word Templates), all sales are final once files are unlocked on your Dashboard. If you face any payment or download issues, our support team is available 24/7 on Instagram DM (@prompt_resume) to assist you!"
4. SAMPLE PROMPT DEMO: If asked for a sample prompt, demo prompt, example prompt, "prompt batao", "sample dikhao", or "show me a prompt", share this real sample prompt from Chapter 04 of our PDF Ebook:
   "Act as an ATS Specialist & Resume Writer. Rewrite my raw experience bullet point for a [Job Title] role: '[Paste your raw work/project details]'. Add strong action verbs, quantifiable metrics (%, $, numbers), and top ATS keywords for [Target Industry]. Keep it concise and high-impact."
   And tell them the ₹99 toolkit contains 30+ such copyable prompts for every section!
5. TOOLKIT HIGHLIGHTS:
   - Price: ₹99 launch offer (regular ₹499, one-time payment, lifetime access).
   - Includes: 52-Page PDF Ebook (23 chapters), 30+ copyable AI prompts, 3 ATS Word templates (.docx), 10+ cover letter & cold email scripts, LinkedIn guide, and 7-category HR matrix.
   - Compatibility: Works with ChatGPT, Claude, Gemini, and Grok on mobile & laptop.
   - Delivery: Instant access on Dashboard immediately after Razorpay payment.
6. BREVITY: Keep responses helpful, direct, and concise (2-4 sentences max).`;

    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (err) {
        console.error("Groq AI API Error:", err);
      }
    }

    // Fallback smart rule-based responder
    return NextResponse.json({ reply: getFallbackReply(message) });
  } catch (error) {
    return NextResponse.json({ reply: getFallbackReply("") });
  }
}

function getFallbackReply(msg: string): string {
  const m = msg.toLowerCase();

  // Sample Prompt Request
  if (
    m.includes("sample") ||
    m.includes("example") ||
    m.includes("demo") ||
    m.includes("prompt batao") ||
    m.includes("prompt dikhao") ||
    m.includes("show me a prompt") ||
    m.includes("kaise prompt") ||
    m.includes("prompt text")
  ) {
    return 'Here is a real sample prompt from Chapter 04 of our PDF Ebook:\n\n"Act as an ATS Specialist & Professional Resume Writer. Rewrite my raw experience bullet point for a [Target Role]: [Paste your raw work/project details]. Add strong action verbs, quantifiable metrics (%, $, numbers), and top ATS keywords for [Target Industry]. Keep it concise and high-impact."\n\nOur ₹99 toolkit includes 30+ such ready-to-use copyable prompts for summaries, projects, skills, cover letters, and LinkedIn! 🚀';
  }

  // Refund / Cancellation
  if (
    m.includes("refund") ||
    m.includes("return") ||
    m.includes("money back") ||
    m.includes("guarantee") ||
    m.includes("wapas") ||
    m.includes("cancel")
  ) {
    return "Due to the immediate digital access nature of our PDF Ebook and Word templates, all sales are final once delivered to your Dashboard. If you face any download or payment issues, our support team is active 24/7 on Instagram DM (@prompt_resume) to resolve it immediately!";
  }

  // Price & Payment
  if (
    m.includes("price") ||
    m.includes("cost") ||
    m.includes("kitna") ||
    m.includes("kitne") ||
    m.includes("charge") ||
    m.includes("rupee") ||
    m.includes("rs") ||
    m.includes("pay")
  ) {
    return "The complete Prompt Resume Toolkit is currently available for just ₹99 (80% OFF launch special, regular ₹499). It is a one-time payment with lifetime access and no hidden subscription fees! 🚀";
  }

  // Tech / B.Tech / Developer / Coding
  if (
    m.includes("tech") ||
    m.includes("developer") ||
    m.includes("coding") ||
    m.includes("software") ||
    m.includes("b.tech") ||
    m.includes("btech") ||
    m.includes("cs") ||
    m.includes("it")
  ) {
    return "Yes! The toolkit includes specialized tech prompts to showcase GitHub projects, tech stacks, frameworks, and quantifiable bullet points that pass ATS screeners at companies like TCS, Infosys, Wipro, and tech startups! 💻";
  }

  // MBA / Management / Business
  if (
    m.includes("mba") ||
    m.includes("bba") ||
    m.includes("management") ||
    m.includes("business") ||
    m.includes("consulting")
  ) {
    return "Absolutely! We provide dedicated MBA & executive prompts focused on leadership metrics, ROI figures, strategy, and business impact to help management candidates stand out to top corporate recruiters! 🎯";
  }

  // Fresher / Student / College
  if (
    m.includes("fresher") ||
    m.includes("college") ||
    m.includes("experience nahi") ||
    m.includes("no experience") ||
    m.includes("student")
  ) {
    return "Perfect for freshers! Chapter 06 & 07 guide you step-by-step on how to turn academic projects, internships, coursework, and extracurricular activities into impressive, ATS-proof resume bullet points! 🎓";
  }

  // ATS / Score / Screening
  if (m.includes("ats") || m.includes("score") || m.includes("pass") || m.includes("system")) {
    return "ATS (Applicant Tracking Systems) screen out over 75% of resumes automatically. Our 3 ATS Word templates (.docx) and keyword generator prompts ensure your resume achieves a 90+ ATS score! 📑";
  }

  // Templates
  if (m.includes("template") || m.includes("word") || m.includes("docx") || m.includes("format")) {
    return "You get 3 fully editable ATS Word templates (.docx): Classic, Modern, and Internship formats. You can edit them easily on Microsoft Word, Google Docs, or WPS Office on phone or laptop! 📑";
  }

  // LinkedIn / Outreach / Cover Letter / Email
  if (
    m.includes("linkedin") ||
    m.includes("cover letter") ||
    m.includes("email") ||
    m.includes("recruiter")
  ) {
    return "Along with the resume prompts, you get a full LinkedIn Profile Optimization guide plus 10+ ready-made cover letter & cold email scripts to reach out directly to recruiters and hiring managers! ✉️";
  }

  // Downloads / Delivery
  if (
    m.includes("download") ||
    m.includes("kaise mil") ||
    m.includes("delivery") ||
    m.includes("access")
  ) {
    return "Immediately after completing your ₹99 payment via Razorpay, you are redirected to your Dashboard to download all PDF and Word (.docx) files instantly! ⚡";
  }

  // AI Tools Compatibility
  if (
    m.includes("chatgpt") ||
    m.includes("claude") ||
    m.includes("gemini") ||
    m.includes("grok") ||
    m.includes("ai")
  ) {
    return "Our prompts are 100% tested and compatible with ChatGPT, Claude, Google Gemini, and Grok. Just copy the prompts from the PDF ebook, paste into your favorite AI tool, and get customized resume bullet points instantly! 🤖";
  }

  // Default specific response
  return "The Prompt Resume Toolkit gives you a 52-page PDF ebook, 30+ copyable AI prompts, 3 ATS Word templates, LinkedIn guide, and cover letter scripts. You can get instant access for ₹99 today on the site! 🚀";
}
