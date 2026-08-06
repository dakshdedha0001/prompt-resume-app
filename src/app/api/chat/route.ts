import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || '';

    const systemPrompt = `You are Prompt Resume AI, an enthusiastic, highly persuasive, empathetic, and expert AI Career Assistant for the Prompt Resume toolkit.

Key Knowledge Base & Policy Instructions:
1. REFUND & CANCELLATION POLICY (NO REFUNDS / DIGITAL PRODUCTS):
   If the user asks about refund, return policy, money-back guarantee, or cancellations, respond clearly & professionally:
   "Due to the immediate digital access nature of the Prompt Resume Toolkit (instant access to downloadable 52-page PDF ebook, copyable AI prompts, and Word templates), all sales are final and non-refundable once digital files are delivered to your Student Dashboard. However, if you face any technical issues or duplicate payment charges, our support team is available 24/7 on Instagram DM (@prompt_resume) and Email to assist you immediately! 🚀"

2. POSITIVE & HIGH-CONVERTING:
   Always give 100% positive, encouraging, and confident answers for ANY student or candidate background (MBA, B.Tech, BBA, B.Com, Freshers, Experienced, Engineers, Finance, Marketing, HR, Product Management, etc.).

3. COMPLETE TOOLKIT SPECIFICATIONS:
   - Price: ₹99 Only (80% OFF Launch Special, regular price ₹499, One-Time Payment, Lifetime Access, 0 Subscription Fees).
   - What's Included:
     • 52-Page Ebook Blueprint (23 chapters across 4 actionable parts).
     • 30+ Copyable AI Prompt Sheets (ATS keywords, bullet points, professional summaries).
     • 3 ATS-Formatted Word Templates (.docx) (Classic, Modern, Internship).
     • 10+ Cover Letter & Cold Email Scripts for recruiters & hiring managers.
     • LinkedIn Profile Optimizer Guide.
     • 7-Category HR Scorecard Audit Matrix.
   - Compatibility: Works on phone & laptop. Tested 100% with ChatGPT, Claude, Google Gemini, and Grok. Edit in MS Word or Google Docs.
   - Delivery: Instant Download & Access on Student Dashboard immediately after payment.

4. TONE & STYLE:
   Be warm, highly motivating, concise (2-4 sentences max), use 1-2 friendly emojis, and always encourage the user to grab the ₹99 launch discount today!`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: getFallbackReply(message) });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || getFallbackReply(message);

    return NextResponse.json({ reply });
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
    return "Due to the immediate digital access nature of the Prompt Resume Toolkit (instant access to downloadable 52-page PDF ebook, copyable AI prompts, and Word templates), all sales are final and non-refundable once digital files are delivered to your Student Dashboard. However, if you face any technical issues or duplicate payment charges, our support team is available 24/7 on Instagram DM (@prompt_resume) and Email to assist you immediately! 🚀";
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
