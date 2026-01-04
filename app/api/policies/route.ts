import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const policySchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  policyNumber: z.string().optional(),
  monthlyPremium: z.number().positive(),
  deathBenefit: z.number().positive(),
  cashValue: z.number().min(0).optional(),
  dividendRate: z.number().min(0).max(20).optional(),
  guaranteedRate: z.number().min(0).max(20).optional(),
  loanRate: z.number().min(0).max(20).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const policies = await prisma.policy.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(policies)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = policySchema.parse(body)

    const availableLoanAmount = (data.cashValue || 0) * 0.9

    const policy = await prisma.policy.create({
      data: {
        ...data,
        userId: session.user.id,
        cashValue: data.cashValue || 0,
        availableLoanAmount,
        dividendRate: data.dividendRate || 6.0,
        guaranteedRate: data.guaranteedRate || 4.0,
        loanRate: data.loanRate || 5.0,
      },
    })

    return NextResponse.json(policy, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Policy creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
