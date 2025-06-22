import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function 'create-user' up and running!`)

// A interface define o formato dos dados que esperamos receber
interface UserData {
  email: string
  password?: string
  name: string
  role: string
}

Deno.serve(async (req) => {
  // Tratamento de CORS: Necessário para que o navegador permita a chamada
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Puxar os dados do novo usuário que o painel enviou
    const userData: UserData = await req.json()

    // Validação básica
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      throw new Error('Dados incompletos. Email, senha, nome e função são obrigatórios.')
    }
    
    // 2. Criar um cliente Supabase com privilégios de administrador
    // As chaves de ambiente são configuradas de forma segura no painel do Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 3. PASSO DE SEGURANÇA CRÍTICO:
    // Verificar se o usuário que está fazendo esta chamada é realmente um admin.
    // Primeiro, criamos um cliente com a autorização do usuário que fez a chamada.
    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Pegamos as informações do usuário logado
    const { data: { user } } = await supabaseUserClient.auth.getUser()
    if (!user) {
      throw new Error("Acesso negado: usuário não autenticado.");
    }

    // Agora, verificamos se ele tem a role 'admin' na nossa tabela.
    // !! IMPORTANTE !!: Confirme se sua tabela de perfis/usuários se chama 'admin_users'
    // e se a coluna de função se chama 'role'. Ajuste se necessário.
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
    
    // 4. Se a segurança passou, criar o novo usuário usando o cliente admin
    const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Já cria o usuário com email confirmado
    });
    
    if (createError) {
      // Se o erro for do Supabase (ex: email já existe), o jogamos para frente
      throw createError
    }

    // 5. Inserir os dados complementares (nome, role) na nossa tabela 'admin_users'
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: newUserData.user.id,
        name: userData.name,
        role: userData.role,
        active: true,
      })
      
    if (insertError) {
      // Se der erro aqui, é um problema mais sério, mas precisamos saber
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