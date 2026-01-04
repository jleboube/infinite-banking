import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const configSchema = z.object({
  provider: z.enum(['OPENAI', 'ANTHROPIC', 'GEMINI', 'GROK', 'SELF_HOSTED']),
  apiKey: z.string().optional(),
  selfHostedUrl: z.string().url().optional().or(z.literal('')),
  selfHostedModel: z.string().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = await prisma.aIConfiguration.findUnique({
    where: { userId: session.user.id },
    select: {
      provider: true,
      selfHostedUrl: true,
      selfHostedModel: true,
    },
  })

  return NextResponse.json(config || { provider: 'GEMINI' })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = configSchema.parse(body)

    const config = await prisma.aIConfiguration.upsert({
      where: { userId: session.user.id },
      update: {
        provider: data.provider,
        apiKey: data.apiKey || null,
        selfHostedUrl: data.selfHostedUrl || null,
        selfHostedModel: data.selfHostedModel || null,
      },
      create: {
        userId: session.user.id,
        provider: data.provider,
        apiKey: data.apiKey || null,
        selfHostedUrl: data.selfHostedUrl || null,
        selfHostedModel: data.selfHostedModel || null,
      },
    })

    return NextResponse.json({
      provider: config.provider,
      selfHostedUrl: config.selfHostedUrl,
      selfHostedModel: config.selfHostedModel,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('AI config error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
