import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.NOTION_TOKEN
  const dbId = process.env.NOTION_DATABASE_ID

  const tokenStatus = !token
    ? 'missing'
    : token === 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    ? 'placeholder'
    : 'ok'

  return NextResponse.json({
    NOTION_TOKEN: tokenStatus,
    NOTION_DATABASE_ID: dbId ? 'ok' : 'missing',
    hint:
      tokenStatus !== 'ok' || !dbId
        ? 'No Vercel: Settings → Environment Variables → adicione NOTION_TOKEN e NOTION_DATABASE_ID → Redeploy'
        : null
  })
}
