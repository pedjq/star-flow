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
    const { platform, identifier } = await req.json();

    if (!platform || !identifier) {
      return new Response(JSON.stringify({ error: 'platform and identifier are required' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let reviews: any[] = [];

    // ─── Google (Places API) ───────────────────────────────────────────────────
    if (platform === 'google') {
      const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${identifier}&fields=reviews&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== 'OK') {
        return new Response(JSON.stringify({ error: `Google API error: ${data.status}` }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const allReviews = data.result?.reviews ?? [];
      reviews = allReviews
        .filter((r: any) => r.rating >= 4 && r.text)
        .map((r: any) => ({
          id: `google-${r.author_name}-${r.time}`,
          author: r.author_name,
          text: r.text,
          rating: r.rating,
          date: r.relative_time_description,
          photo: r.profile_photo_url ?? null,
        }));

    // ─── Yelp / TripAdvisor / Facebook (Outscraper) ───────────────────────────
    } else {
      const outscraperKey = Deno.env.get('OUTSCRAPER_API_KEY');
      if (!outscraperKey) {
        return new Response(
          JSON.stringify({ error: 'OUTSCRAPER_API_KEY not configured. Add it in Supabase Edge Function secrets.' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Outscraper endpoint map — verify at https://app.outscraper.com/api-docs
      const endpointMap: Record<string, string> = {
        yelp: 'yelp-reviews',
        tripadvisor: 'tripadvisor-reviews',
        facebook: 'facebook-reviews',
      };

      const endpoint = endpointMap[platform];
      if (!endpoint) {
        return new Response(JSON.stringify({ error: `Unsupported platform: ${platform}` }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const outscraperUrl = `https://api.app.outscraper.com/${endpoint}?link=${encodeURIComponent(identifier)}&limit=20`;
      const outRes = await fetch(outscraperUrl, {
        headers: { 'X-API-KEY': outscraperKey },
      });
      const outData = await outRes.json();

      if (!outRes.ok || outData.status === 'ERROR') {
        return new Response(JSON.stringify({ error: 'Outscraper error: ' + JSON.stringify(outData) }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Outscraper returns { data: [[...reviews]] }
      const rawReviews: any[] = Array.isArray(outData.data?.[0]) ? outData.data[0] : [];
      reviews = rawReviews.map((r: any, i: number) => ({
        id: `${platform}-${r.author_id || r.reviewer_name || i}-${r.review_datetime_utc || i}`,
        author: r.reviewer_name || r.author_id || 'Anonymous',
        text: r.review_text || r.text || '',
        rating: r.reviewer_rating ?? r.rating ?? 5,
        date: r.review_datetime_utc ? r.review_datetime_utc.split('T')[0] : '',
        photo: r.reviewer_photo ?? null,
      })).filter((r: any) => r.text);
    }

    return new Response(JSON.stringify({ reviews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Exception: ' + String(err) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
