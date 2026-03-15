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
    const { place_id } = await req.json();

    if (!place_id) {
      return new Response(JSON.stringify({ error: 'place_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return new Response(JSON.stringify({ error: `Google API error: ${data.status}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allReviews = data.result?.reviews ?? [];
    const fiveStarReviews = allReviews
      .filter((r: { rating: number; text?: string }) => r.rating === 5 && r.text)
      .map((r: { author_name: string; text: string; rating: number; relative_time_description: string; profile_photo_url?: string; time: number }) => ({
        id: `${r.author_name}-${r.time}`,
        author: r.author_name,
        text: r.text,
        rating: r.rating,
        date: r.relative_time_description,
        photo: r.profile_photo_url ?? null,
      }));

    return new Response(JSON.stringify({ reviews: fiveStarReviews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
