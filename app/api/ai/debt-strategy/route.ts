import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { runDebtPayoffAgent } from '@/lib/ai/agents'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [aiConfig, debts, policies] = await Promise.all([
      prisma.aIConfiguration.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.debt.findMany({
        where: { userId: session.user.id, isPaidOff: false },
        orderBy: { currentBalance: 'asc' },
      }),
      prisma.policy.findMany({
        where: { userId: session.user.id },
      }),
    ])

    const config = aiConfig
      ? {
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey || undefined,
          selfHostedUrl: aiConfig.selfHostedUrl || undefined,
          selfHostedModel: aiConfig.selfHostedModel || undefined,
        }
      : {
          provider: 'OPENAI' as const,
        }

    const availableLoanAmount = policies.reduce((sum, p) => sum + p.availableLoanAmount, 0)

    const strategy = await runDebtPayoffAgent(
      config,
      debts.map((d) => ({
        name: d.name,
        balance: d.currentBalance,
        rate: d.interestRate,
        minimumPayment: d.minimumPayment,
      })),
      availableLoanAmount
    )

    return NextResponse.json({ strategy })
  } catch (error) {
    console.error('AI debt strategy error:', error)
    return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 })
  }
}
