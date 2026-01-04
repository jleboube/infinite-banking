import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  annualIncome: z.number().positive().optional(),
  monthlyIncome: z.number().positive().optional(),
  savingsRate: z.number().min(0).max(100).optional(),
  currentSavings: z.number().min(0).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      annualIncome: true,
      monthlyIncome: true,
      savingsRate: true,
      currentSavings: true,
      onboardingComplete: true,
      onboardingStep: true,
    },
  })

  return NextResponse.json(user)
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = profileSchema.parse(body)

    const monthlyIncome = data.annualIncome ? data.annualIncome / 12 : data.monthlyIncome

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        monthlyIncome,
      },
      select: {
        name: true,
        email: true,
        annualIncome: true,
        monthlyIncome: true,
        savingsRate: true,
        currentSavings: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
