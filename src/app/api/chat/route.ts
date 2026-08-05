import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || '';

    const systemPrompt = `You are Prompt Resume AI, a helpful, professional, and friendly AI Career Assistant for the Prompt Resume toolkit.
The toolkit costs ₹99 (one-time purchase, lifetime access). It includes a 52-page PDF ebook (23 chapters), 30+ ready-to-use copyable AI prompts, 3 Word ATS resume templates (.docx), cover letter templates, and a LinkedIn optimizer.
Always give concise, helpful responses (2-3 sentences max) about resumes, ATS optimization, cover letters, LinkedIn, or the Prompt Resume toolkit.`;

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
  if (m.includes('price') || m.includes('cost') || m.includes('kitna')) return 'The complete toolkit is just ₹99 — one-time purchase, lifetime access! 🎯';
  if (m.includes('ats')) return 'ATS filters resumes before a human sees them. Our toolkit has AI prompts to audit your resume for ATS compatibility — check Chapters 1-5! 📘';
  if (m.includes('template')) return 'You get 3 ATS templates (.docx): Classic, Modern, and Internship formats. Edit in Word or Google Docs! 📑';
  if (m.includes('linkedin')) return 'Our toolkit includes LinkedIn optimization prompts for your headline, about section, and experience. See Chapters 12-14! 💼';
  return 'Great question! The Prompt Resume Toolkit covers ATS optimization, LinkedIn, cover letters, and more — all with ready-to-use AI prompts. Ask me anything specific! 🚀';
}
