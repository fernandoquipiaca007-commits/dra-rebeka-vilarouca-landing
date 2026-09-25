import { supabase } from './supabase';

export const META_PIXEL_ID = '978841921917089';
export const META_ACCESS_TOKEN =
  'EAAW7BoCyOHIBSnQb66JD6mckeNyEaC6b1hpRljURQ6q9K8CIe5bYzzYZBztOPNCZA8nic5W0LBuFK5diSaM5IYQivNxwi3QsMOEsDR39yxDbjZAAWJPBfQpxeUQuYpwD6yWceI9kumYXuYQODSL34eWCOrq58q0mbgrR1qd3SY5RBESkz3PSC9D4WUaZCxEaTwZDZD';

async function sha256(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
}

export async function trackLeadEvent(userData: UserData) {
  const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: 'Inscrição Palestra Aposentadoria Especial',
      status: true
    }, { eventID: eventId });
  }

  try {
    const { data, error } = await supabase.functions.invoke('meta-conversions-api', {
      body: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        event_id: eventId,
        event_source_url: typeof window !== 'undefined' ? window.location.href : ''
      }
    });

    if (error) {
      console.warn('Supabase Edge Function notice (using direct CAPI fallback):', error.message);
      await sendDirectCAPI(userData, eventId);
    } else {
      console.log('Meta CAPI via Supabase Edge Function success:', data);
    }
  } catch (err) {
    console.warn('Edge Function fallback to direct CAPI call:', err);
    await sendDirectCAPI(userData, eventId);
  }
}

async function sendDirectCAPI(userData: UserData, eventId: string) {
  try {
    const hashedEmail = userData.email ? await sha256(userData.email) : null;
    const cleanPhone = userData.phone ? userData.phone.replace(/\D/g, '') : '';
    const formattedPhone = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone) : '';
    const hashedPhone = formattedPhone ? await sha256(formattedPhone) : null;
    const firstName = userData.name ? userData.name.trim().split(' ')[0] : '';
    const hashedFirstName = firstName ? await sha256(firstName) : null;

    const payload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            fn: hashedFirstName ? [hashedFirstName] : [],
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
          },
          custom_data: {
            content_name: 'Inscrição Palestra Aposentadoria Especial'
          }
        }
      ]
    };

    const capiUrl = 'https://graph.facebook.com/v19.0/' + META_PIXEL_ID + '/events?access_token=' + META_ACCESS_TOKEN;

    const response = await fetch(capiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    console.log('Meta Direct CAPI Lead Event response:', resData);
  } catch (error) {
    console.error('Error sending Meta CAPI event:', error);
  }
}