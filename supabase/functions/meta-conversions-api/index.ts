import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, phone, event_id, event_source_url } = await req.json();

    const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID') || '978841921917089';
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN') || 'EAAW7BoCyOHIBSnQb66JD6mckeNyEaC6b1hpRljURQ6q9K8CIe5bYzzYZBztOPNCZA8nic5W0LBuFK5diSaM5IYQivNxwi3QsMOEsDR39yxDbjZAAWJPBfQpxeUQuYpwD6yWceI9kumYXuYQODSL34eWCOrq58q0mbgrR1qd3SY5RBESkz3PSC9D4WUaZCxEaTwZDZD';

    const hashedEmail = email ? await sha256(email) : null;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const formattedPhone = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone) : '';
    const hashedPhone = formattedPhone ? await sha256(formattedPhone) : null;
    const firstName = name ? name.trim().split(' ')[0] : '';
    const hashedFirstName = firstName ? await sha256(firstName) : null;

    const eventId = event_id || 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const payload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: event_source_url || '',
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            fn: hashedFirstName ? [hashedFirstName] : [],
          },
          custom_data: {
            content_name: 'Inscrição Palestra Aposentadoria Especial'
          }
        }
      ]
    };

    const capiUrl = 'https://graph.facebook.com/v19.0/' + META_PIXEL_ID + '/events?access_token=' + META_ACCESS_TOKEN;

    const res = await fetch(capiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, metaResponse: data, event_id: eventId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});