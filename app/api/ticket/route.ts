import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '06157c2e-128c-4f6d-8452-61d2c981b74b'

export async function POST(request: NextRequest) {
  // Valida credenciais do Notion
  if (!NOTION_TOKEN || NOTION_TOKEN === 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
    return NextResponse.json({
      success: false,
      error: 'Configure o NOTION_TOKEN no arquivo .env. Crie uma integração em notion.so/my-integrations e adicione o token.'
    }, { status: 500 })
  }

  const notion = new Client({ auth: NOTION_TOKEN })

  try {
    const body = await request.json()
    
    const {
      type,
      title,
      reporter,
      screen,
      severity,
      profiles,
      description,
      steps,
      expected,
      actual,
      device
    } = body

    // Mapeia severidade para o formato do Notion
    const severityMap: Record<string, string> = {
      'P0': 'P0 — Crítico',
      'P1': 'P1 — Alto',
      'P2': 'P2 — Médio',
      'P3': 'P3 — Baixo'
    }

    // Monta o conteúdo da página
    const children: any[] = []
    
    if (description) {
      children.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Descrição' } }]
        }
      })
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: description } }]
        }
      })
    }

    if (steps && type === 'bug') {
      children.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Passos para Reproduzir' } }]
        }
      })
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: steps } }]
        }
      })
    }

    if (expected) {
      children.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ 
            type: 'text', 
            text: { content: type === 'bug' ? 'Comportamento Esperado' : 'Como deveria funcionar' } 
          }]
        }
      })
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: expected } }]
        }
      })
    }

    if (actual && type === 'bug') {
      children.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Comportamento Atual' } }]
        }
      })
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: actual } }]
        }
      })
    }

    // Cria a página no Notion
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      icon: {
        type: 'emoji',
        emoji: type === 'bug' ? '🐛' : '✨'
      },
      properties: {
        'Título': {
          title: [{ text: { content: title } }]
        },
        'Tipo': {
          select: { name: type === 'bug' ? '🐛 Bug' : '✨ Melhoria' }
        },
        'Status': {
          select: { name: 'Novo' }
        },
        ...(type === 'bug' && severity && {
          'Severidade': {
            select: { name: severityMap[severity] || 'P2 — Médio' }
          }
        }),
        ...(screen && {
          'Tela': {
            select: { name: screen }
          }
        }),
        ...(profiles && profiles.length > 0 && {
          'Perfis Afetados': {
            multi_select: profiles.map((p: string) => ({ name: p }))
          }
        }),
        ...(reporter && {
          'Reportado por': {
            rich_text: [{ text: { content: reporter } }]
          }
        }),
        ...(device && {
          'Dispositivo': {
            rich_text: [{ text: { content: device } }]
          }
        }),
        ...(description && {
          'Descrição': {
            rich_text: [{ text: { content: description.substring(0, 2000) } }]
          }
        }),
      },
      children: children.length > 0 ? children : undefined
    })

    // Monta URL do ticket
    const pageUrl = `https://notion.so/${response.id.replace(/-/g, '')}`

    return NextResponse.json({
      success: true,
      url: pageUrl,
      id: response.id
    })

  } catch (error: any) {
    console.error('Erro ao criar ticket no Notion:', error)

    // Mensagens amigáveis para erros comuns do Notion
    let userMessage = error.message || 'Erro ao conectar com o Notion'
    if (error.code === 'unauthorized' || error.message?.includes('Invalid token')) {
      userMessage = 'Token do Notion inválido. Verifique o NOTION_TOKEN no .env'
    } else if (error.code === 'object_not_found' || error.message?.includes('Could not find')) {
      userMessage = 'Database não encontrado. Verifique o NOTION_DATABASE_ID e se a integração tem acesso ao database'
    } else if (error.message?.includes('validation_error')) {
      userMessage = 'Estrutura do database incompatível. Confira se as propriedades (Título, Tipo, Status, etc.) existem no Notion'
    }

    return NextResponse.json({
      success: false,
      error: userMessage
    }, { status: 500 })
  }
}
