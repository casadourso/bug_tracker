import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN
    const DATABASE_ID = process.env.NOTION_DATABASE_ID

    if (!NOTION_TOKEN) {
      return NextResponse.json({
        ok: false,
        error: 'NOTION_TOKEN não configurado',
        tokenLength: 0
      })
    }

    // Teste 1: Chamada direta à API (sem SDK) para isolar o problema
    const testAuth = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    })

    const authBody = await testAuth.json()

    if (!testAuth.ok) {
      return NextResponse.json({
        ok: false,
        error: authBody.message || 'Token rejeitado pela API Notion',
        status: testAuth.status,
        code: authBody.code,
        tokenPrefix: NOTION_TOKEN.substring(0, 15) + '...',
        tokenLength: NOTION_TOKEN.length,
        hint: testAuth.status === 401
          ? 'Token inválido. Tente: 1) Deletar a integração e criar uma nova 2) Verificar se está no workspace correto (Clinica Casa do Urso)'
          : undefined
      })
    }

    // Teste 2: Acessar o database
    if (!DATABASE_ID) {
      return NextResponse.json({
        ok: true,
        authOk: true,
        message: 'Token OK! Mas NOTION_DATABASE_ID não configurado.'
      })
    }

    const testDb = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    })

    const dbBody = await testDb.json()

    if (!testDb.ok) {
      return NextResponse.json({
        ok: false,
        authOk: true,
        databaseOk: false,
        error: dbBody.message || 'Erro ao acessar database',
        code: dbBody.code,
        hint: dbBody.code === 'object_not_found'
          ? 'Database não encontrado ou integração sem acesso. No Notion: abra o database → ••• → Connections → adicione "Bug Tracker"'
          : undefined
      })
    }

    const props = Object.entries(dbBody.properties || {}).map(([name, p]: [string, any]) => ({
      name,
      type: p.type
    }))

    return NextResponse.json({
      ok: true,
      authOk: true,
      databaseOk: true,
      message: 'Tudo OK! Conexão funcionando.',
      databaseTitle: dbBody.title?.[0]?.plain_text,
      properties: props
    })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message || String(err)
    })
  }
}
