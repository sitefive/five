import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const post = payload.record;

    // Buscar todos os inscritos da newsletter
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email');

    if (subscribersError) throw subscribersError;

    // Enviar email para cada inscrito usando o serviço de email do Supabase
    const emailPromises = subscribers.map((subscriber) => {
      return supabase.auth.admin.sendEmail(subscriber.email, {
        subject: `Novo post: ${post.title}`,
        template_id: 'newsletter-new-post',
        template_data: {
          post_title: post.title,
          post_excerpt: post.excerpt,
          post_image: post.cover_image,
          post_content: post.content.substring(0, 200) + '...',
          post_url: `https://seusite.com/blog/${post.slug}`,
          unsubscribe_url: 'https://seusite.com/unsubscribe'
        }
      });
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: 'Emails enviados com sucesso' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});