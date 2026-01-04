import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const transactionSchema = z.object({
  type: z.enum([
    'POLICY_PREMIUM',
    'POLICY_LOAN_DISBURSEMENT',
    'POLICY_LOAN_REPAYMENT',
    'DEBT_PAYMENT',
    'CASH_VALUE_INCREASE',
    'DIVIDEND_CREDIT',
    'INTEREST_CHARGE',
    'SAVINGS_DEPOSIT',
  ]),
  amount: z.number().positive(),
  description: z.string().optional(),
  policyId: z.string().optional(),
  debtId: z.string().optional(),
  loanId: z.string().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { transactionDate: 'desc' },
    take: 50,
    include: {
      policy: { select: { name: true } },
      debt: { select: { name: true } },
      loan: { select: { id: true, purpose: true } },
    },
  })

  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = transactionSchema.parse(body)

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Transaction creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
