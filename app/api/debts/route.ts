import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const debtSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'CREDIT_CARD',
    'CAR_LOAN',
    'MORTGAGE',
    'STUDENT_LOAN',
    'PERSONAL_LOAN',
    'MEDICAL',
    'OTHER',
  ]),
  originalAmount: z.number().positive(),
  currentBalance: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  minimumPayment: z.number().min(0),
  monthlyPayment: z.number().min(0).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { currentBalance: 'asc' },
  })

  return NextResponse.json(debts)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = debtSchema.parse(body)

    const existingDebts = await prisma.debt.count({
      where: { userId: session.user.id },
    })

    const debt = await prisma.debt.create({
      data: {
        ...data,
        userId: session.user.id,
        priority: existingDebts,
      },
    })

    return NextResponse.json(debt, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Debt creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
