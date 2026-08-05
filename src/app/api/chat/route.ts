import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || '';

    const systemPrompt = `You are Prompt Resume AI, an enthusiastic, highly persuasive, and expert AI Career Assistant for the Prompt Resume toolkit.

Key Guidelines & Training Policies:
1. POSITIVE & HIGH-CONVERTING: Always give 100% positive, enthusiastic, and confident answers for ANY student or candidate background (MBA, B.Tech, BBA, B.Com, Freshers, Experienced, Engineers, Finance, Marketing, HR, Product Management, etc.).
2. PERFECT FOR MBA & ALL DOMAINS: If asked about MBA, B.Tech, or any specific field, explicitly answer: "Yes, 100%! The Prompt Resume toolkit has specialized prompts and ATS strategies designed specifically for MBA students, leadership roles, management metrics, and domain-specific keywords."
3. TOOLKIT HIGHLIGHTS:
   - Price: ₹99 Only (67% OFF Launch Special, One-Time Payment, Lifetime Access, 0 Subscription Fees).
   - Package: 52-Page Ebook (23 Chapters), 30+ Copyable AI Prompts, 3 Word ATS Templates (.docx), 10+ Cover Letter & Cold Email Scripts, LinkedIn Optimizer.
   - Delivery: Instant Download & Access on Student Dashboard immediately after ₹99 payment.
   - AI Compatibility: 100% compatible with ChatGPT (3.5 & GPT-4), Claude, Gemini, and Grok.
4. TONE & STYLE: Be warm, motivating, highly persuasive, and concise (2-4 sentences max). Always use 1-2 friendly emojis and encourage the candidate to grab the ₹99 launch discount today!`;

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
  if (m.includes('mba')) return 'Yes, 100%! The toolkit includes specialized AI prompts for MBA resumes, management leadership metrics, and executive ATS keywords to help you stand out to top recruiters! 🎯';
  if (m.includes('price') || m.includes('cost') || m.includes('kitna')) return 'The complete toolkit is just ₹99 — 67% OFF launch special, one-time payment, lifetime access! 🚀';
  if (m.includes('ats')) return 'ATS filters resumes before a human sees them. Our toolkit includes 30+ AI prompts to audit and guarantee 90+ ATS score for your resume! 📘';
  if (m.includes('template')) return 'You get 3 ATS templates (.docx): Classic, Modern, and Internship formats. Edit in Word or Google Docs! 📑';
  if (m.includes('linkedin')) return 'Our toolkit includes LinkedIn optimization prompts for your headline, about section, and experience. See Chapters 12-14! 💼';
  return 'Yes, absolutely! The Prompt Resume Toolkit is designed to get you interview calls for any field — MBA, B.Tech, BBA, Finance, Marketing & Freshers. Get instant access for ₹99 today! 🚀';
}
