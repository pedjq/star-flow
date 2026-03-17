// @ts-ignore: Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function starsText(n: number) {
  return '⭐'.repeat(n);
}

function emailHtml(shopName: string, reviewAuthor: string, reviewText: string, rating: number, aiReply: string, replyUrl: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0d0d0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">★ StarFlow</div>
      <div style="color:#666;font-size:13px;margin-top:4px;">New review alert</div>
    </div>

    <div style="background:#18181b;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:16px;">
      <div style="font-size:20px;margin-bottom:10px;">${starsText(rating)}</div>
      <div style="color:#888;font-size:13px;margin-bottom:14px;">From <strong style="color:#fff;">${reviewAuthor}</strong> on Google</div>
      <div style="color:#d0d0d8;font-size:15px;line-height:1.65;font-style:italic;">"${reviewText || '(No written review)'}"</div>
    </div>

    <div style="background:#18181b;border:1px solid rgba(155,45,242,0.35);border-radius:16px;padding:28px;margin-bottom:28px;">
      <div style="color:#9b2df2;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:12px;">✦ Suggested Reply</div>
      <div style="color:#e0e0e8;font-size:15px;line-height:1.7;">${aiReply}</div>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${replyUrl}"
        style="display:inline-block;background:linear-gradient(135deg,#9b2df2,#2b58ff);color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:12px;font-size:16px;font-weight:600;letter-spacing:-0.2px;">
        Reply on Google →
      </a>
      <div style="color:#555;font-size:12px;margin-top:10px;">Copies your reply to clipboard · Opens Google Reviews</div>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;color:#444;font-size:12px;">
      Sent by StarFlow for ${shopName}
    </div>

  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Optional shared secret check for cron security
  const cronSecret = Deno.env.get('CRON_SECRET');
  if (cronSecret) {
    const auth = req.headers.get('x-cron-secret');
    if (auth !== cronSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const appUrl = Deno.env.get('APP_URL') || 'https://star-flow.vercel.app';

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. All shops with a place_id
    const { data: shops, error: shopsErr } = await supabase
      .from('shops')
      .select('id, name, place_id, user_id, persona')
      .not('place_id', 'is', null)
      .neq('place_id', '');

    if (shopsErr) throw new Error(shopsErr.message);
    if (!shops?.length) {
      return new Response(JSON.stringify({ ok: true, message: 'No shops with place_id' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const notified: string[] = [];

    for (const shop of shops) {
      // 2. Fetch Google reviews
      const gRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${shop.place_id}&fields=reviews&key=${googleApiKey}`
      );
      const gData = await gRes.json();
      const reviews: any[] = gData.result?.reviews || [];

      // 3. Only 4-5 star
      for (const review of reviews.filter((r: any) => r.rating >= 4)) {
        // 4. Already seen?
        const { data: existing } = await supabase
          .from('google_reviews')
          .select('id')
          .eq('shop_id', shop.id)
          .eq('review_author', review.author_name)
          .eq('review_time', review.time)
          .maybeSingle();

        if (existing) continue;

        // 5. Generate AI reply
        const replyRes = await fetch(`${supabaseUrl}/functions/v1/generate-review-response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            review_text: review.text || '',
            review_author: review.author_name,
            shop_name: shop.name,
            persona: shop.persona,
          }),
        });
        const { response: aiReply } = await replyRes.json();

        // 6. Save to DB
        const { data: inserted, error: insertErr } = await supabase
          .from('google_reviews')
          .insert({
            shop_id: shop.id,
            review_author: review.author_name,
            review_text: review.text || '',
            rating: review.rating,
            review_time: review.time,
            ai_reply: aiReply || '',
          })
          .select()
          .single();

        if (insertErr || !inserted) continue;

        // 7. Get owner email
        const { data: authData } = await supabase.auth.admin.getUserById(shop.user_id);
        const ownerEmail = authData?.user?.email;
        if (!ownerEmail) continue;

        // 8. Send email via Resend
        const replyUrl = `${appUrl}/reply/${inserted.id}`;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'StarFlow <onboarding@resend.dev>',
            to: ownerEmail,
            subject: `New ${starsText(review.rating)} review from ${review.author_name}`,
            html: emailHtml(shop.name, review.author_name, review.text || '', review.rating, aiReply || '', replyUrl),
          }),
        });

        // 9. Mark notified
        await supabase
          .from('google_reviews')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', inserted.id);

        notified.push(`${shop.name} — ${review.author_name}`);
      }
    }

    return new Response(JSON.stringify({ ok: true, notified }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
