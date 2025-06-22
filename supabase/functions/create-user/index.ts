import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log(`Function 'create-user' up and running!`)

// Headers de CORS definidos diretamente aqui, sem precisar de outro arquivo.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
}

// A interface define o formato dos dados que esperamos receber
interface UserData {
  email: string
  password?: string
  name: string
  role: string
}

Deno.serve(async (req) => {
  // Tratamento de CORS para a chamada do navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Puxar os dados do novo usuário que o painel enviou
    const userData: UserData = await req.json()

    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      throw new Error('Dados incompletos. Email, senha, nome e função são obrigatórios.')
    }
    
    // 2. Criar um cliente Supabase com privilégios de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 3. PASSO DE SEGURANÇA CRÍTICO: Verificar se quem chama é admin
    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    const { data: { user } } = await supabaseUserClient.auth.getUser()
    if (!user) {
      throw new Error("Acesso negado: usuário não autenticado.");
    }

    // !! IMPORTANTE !!: Confirme se sua tabela se chama 'admin_users'
    const { data: adminProfile, error: profileError } = await supabaseUserClient
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !adminProfile || adminProfile.role !== 'admin') {
       return new Response(JSON.stringify({ error: 'Acesso negado: Requer privilégios de administrador.' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
    }
    
    // 4. Se a segurança passou, criar o novo usuário usando o método oficial
    const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });
    
    if (createError) {
      throw createError
    }

    // 5. Inserir os dados complementares na sua tabela 'admin_users'
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: newUserData.user.id,
        name: userData.name,
        role: userData.role,
        active: true,
      })
      
    if (insertError) {
      console.error("Erro ao inserir em admin_users:", insertError)
      throw new Error(`Usuário criado na autenticação, mas falha ao criar perfil: ${insertError.message}`)
    }

    // 6. Se tudo deu certo, retornar sucesso!
    return new Response(JSON.stringify({ message: "Usuário criado com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // Se qualquer um dos passos acima falhar, caímos aqui
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})