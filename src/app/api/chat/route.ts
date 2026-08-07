import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || '';
    const grokApiKey = process.env.GROQ_API_KEY || '';

    let systemPrompt = `You are Prompt Resume AI, an enthusiastic, highly persuasive, empathetic, and expert AI Career Assistant for the Prompt Resume toolkit.

Key Knowledge Base & Policy Instructions:
1. REFUND & CANCELLATION POLICY (NO REFUNDS / DIGITAL PRODUCTS):
   If the user asks about refund, return policy, money-back guarantee, or cancellations, respond clearly & professionally:
   "Due to the immediate digital access nature of the Prompt Resume Toolkit (instant access to downloadable 52-page PDF ebook, copyable AI prompts, and Word templates), all sales are final and non-refundable once digital files are delivered to your Dashboard. However, if you face any technical issues or duplicate payment charges, our support team is available 24/7 on Instagram DM (@prompt_resume) and Email to assist you immediately! 🚀"`;

    systemPrompt += (
      " Always give 100% positive, encouraging, and confident answers for ANY candidate background (MBA, B.Tech, BBA, B.Com, Freshers, Experienced, Engineers, Finance, Marketing, HR, Product Management, etc.)."
    );
    systemPrompt += (
      " Highlight key benefits: 23 Chapters, 30+ Copy-Paste AI Prompts, 3 ATS-formatted Word Templates (.docx), 10+ Cover Letter & Cold Email Scripts, LinkedIn Optimization Guide, HR Scorecard Matrix. Instant Delivery for ₹99 ONLY!"
    );
    systemPrompt += (
      " Answer clearly, concisely, politely, and keep responses short (max 2-3 sentences). Always include a call-to-action encouraging them to get the ₹99 toolkit!"
    );
    systemPrompt += (
      " FAQ Answers summary: - Compatibility: ChatGPT, Claude, Gemini, Grok. - Pricing: ₹99 One-time, Lifetime access. - Delivery: Instant Download & Access on Dashboard immediately after payment."
    );

    try {
      const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${grokApiKey}`,
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (grokRes.ok) {
        const data = await grokRes.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    } catch (err) {
      console.error("Grok AI Chat API error:", err);
    }

    return NextResponse.json({ reply: getFallbackReply(message) });
  } catch (error) {
    return NextResponse.json({ reply: getFallbackReply('') });
  }
}

function getFallbackReply(msg: string): string {
  const m = msg.toLowerCase();
  if (
    m.includes('refund') ||
    m.includes('return') ||
    m.includes('money back') ||
    m.includes('guarantee') ||
    m.includes('wapas') ||
    m.includes('cancel')
  ) {
    return "Due to the immediate digital access nature of the Prompt Resume Toolkit (instant access to downloadable 52-page PDF ebook, copyable AI prompts, and Word templates), all sales are final and non-refundable once digital files are delivered to your Dashboard. However, if you face any technical issues or duplicate payment charges, our support team is available 24/7 on Instagram DM (@prompt_resume) and Email to assist you immediately! 🚀";
  }
  if (m.includes('mba')) {
    return 'Yes, 100%! The toolkit includes specialized AI prompts for MBA resumes, management leadership metrics, and executive ATS keywords to help you stand out to top recruiters! 🎯';
  }
  if (m.includes('price') || m.includes('cost') || m.includes('kitna') || m.includes('kitne')) {
    return 'The complete toolkit is just ₹99 — 80% OFF launch special (regular ₹499), one-time payment with lifetime access! 🚀';
  }
  if (m.includes('ats')) {
    return 'ATS filters resumes before a human sees them. Our toolkit includes 30+ AI prompts to audit and guarantee 90+ ATS score for your resume! 📘';
  }
  if (m.includes('template')) {
    return 'You get 3 ATS templates (.docx): Classic, Modern, and Internship formats. Edit in Word or Google Docs! 📑';
  }
  if (m.includes('linkedin')) {
    return 'Our toolkit includes LinkedIn optimization prompts for your headline, about section, and experience bullet points! 💼';
  }
  return 'Yes, 100%! The Prompt Resume Toolkit is designed to get you interview calls for any field — MBA, B.Tech, BBA, Finance, Marketing & Freshers. Get instant access for ₹99 today! 🚀';
}
