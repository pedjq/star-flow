// @ts-ignore: Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { review_text, review_author, shop_name, persona } = await req.json();

    if (!review_text || !review_author) {
      return new Response(JSON.stringify({ error: 'review_text and review_author are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const personaLine = persona
      ? `Business voice/persona: ${persona}`
      : 'Business voice: Warm, friendly, and genuine.';

    const prompt = `You are writing a Google review reply on behalf of a business owner.

Business name: ${shop_name || 'the business'}
${personaLine}

The customer left this 5-star review:
"${review_text}"

Write a genuine, personalized reply that:
- Mentions at least one specific detail from the review (so it feels like it was actually read)
- Feels warm, human, and local — not corporate or generic
- Matches the business persona/voice described above
- Is 2-4 sentences maximum
- Does NOT start with "Thank you for your review" or "We appreciate your feedback" (too generic)

Respond with only the reply text, nothing else.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 250 },
        }),
      }
    );

    const geminiData = await res.json();

    if (!res.ok || !geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ error: 'Gemini API error', details: geminiData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = geminiData.candidates[0].content.parts[0].text.trim();

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
