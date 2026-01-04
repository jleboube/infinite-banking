import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { runEstablishAgent } from '@/lib/ai/agents'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const aiConfig = await prisma.aIConfiguration.findUnique({
      where: { userId: session.user.id },
    })

    const config = aiConfig
      ? {
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey || undefined,
          selfHostedUrl: aiConfig.selfHostedUrl || undefined,
          selfHostedModel: aiConfig.selfHostedModel || undefined,
        }
      : {
          provider: 'GEMINI' as const,
        }

    const recommendation = await runEstablishAgent(config, {
      annualIncome: body.annualIncome ? parseFloat(body.annualIncome) : undefined,
      savingsRate: body.savingsRate ? parseFloat(body.savingsRate) : undefined,
      currentSavings: body.currentSavings ? parseFloat(body.currentSavings) : undefined,
      age: body.age ? parseInt(body.age) : undefined,
    })

    return NextResponse.json({ recommendation })
  } catch (error) {
    console.error('AI establish error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}
