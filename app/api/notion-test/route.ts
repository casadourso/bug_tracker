import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN
    const DATABASE_ID = process.env.NOTION_DATABASE_ID

    // Diagnóstico básico
    const hasToken = !!NOTION_TOKEN && NOTION_TOKEN !== 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    const hasDbId = !!DATABASE_ID

    if (!hasToken) {
      return NextResponse.json({
        ok: false,
        error: 'NOTION_TOKEN não configurado ou ainda é o placeholder',
        hint: 'Edite o arquivo .env e cole seu token real (de notion.so/my-integrations)'
      })
    }

    if (!hasDbId) {
      return NextResponse.json({
        ok: false,
        error: 'NOTION_DATABASE_ID não configurado'
      })
    }

    const notion = new Client({ auth: NOTION_TOKEN })

    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID
    }) as any

    const properties = Object.entries(database.properties || {}).map(([name, prop]: [string, any]) => ({
      name,
      type: prop.type,
      selectOptions: prop.type === 'select' ? prop.select?.options?.map((o: any) => o.name) : undefined,
      multiSelectOptions: prop.type === 'multi_select' ? prop.multi_select?.options?.map((o: any) => o.name) : undefined
    }))

    return NextResponse.json({
      ok: true,
      message: 'Conexão com Notion OK!',
      databaseTitle: database.title?.[0]?.plain_text || 'Sem título',
      properties,
      requiredByApp: [
        'Título (title)',
        'Tipo (select) - opções: 🐛 Bug, ✨ Melhoria',
        'Status (select) - opção: Novo'
      ]
    })
  } catch (err: any) {
    const msg = err?.message || err?.body?.message || String(err)
    const code = err?.code || err?.body?.code

    let hint = ''
    if (code === 'unauthorized' || msg?.toLowerCase().includes('invalid')) {
      hint = 'Token inválido. Verifique se copiou o token completo.'
    } else if (code === 'object_not_found' || err?.status === 404) {
      hint = 'Database não encontrado. No Notion: abra o database → "..." → Connections → adicione a integração.'
    }

    return NextResponse.json({
      ok: false,
      error: msg,
      code,
      hint: hint || 'Reinicie o servidor (npm run dev) após alterar o .env'
    })
  }
}
