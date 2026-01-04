import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import {
  Wallet,
  TrendingUp,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Circle,
} from 'lucide-react'

async function getUserData(userId: string) {
  const [user, policies, debts, loans] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { aiConfig: true },
    }),
    prisma.policy.findMany({ where: { userId } }),
    prisma.debt.findMany({ where: { userId } }),
    prisma.policyLoan.findMany({ where: { userId } }),
  ])

  return { user, policies, debts, loans }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const { user, policies, debts, loans } = await getUserData(session.user.id)

  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0)
  const totalCashValue = policies.reduce((sum, p) => sum + p.cashValue, 0)
  const totalLoans = loans.filter((l) => l.status === 'ACTIVE').reduce((sum, l) => sum + l.currentBalance, 0)
  const availableToBorrow = policies.reduce((sum, p) => sum + p.availableLoanAmount, 0)

  const onboardingSteps = [
    { label: 'Create Account', completed: true },
    { label: 'Configure AI', completed: !!user?.aiConfig },
    { label: 'Add Financial Profile', completed: !!user?.annualIncome },
    { label: 'Set Up Policy', completed: policies.length > 0 },
    { label: 'Add Debts', completed: debts.length > 0 },
  ]

  const completedSteps = onboardingSteps.filter((s) => s.completed).length
  const progress = (completedSteps / onboardingSteps.length) * 100

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Banker'}!</h1>
        <p className="text-slate-600">Your Infinite Banking journey at a glance</p>
      </div>

      {progress < 100 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Complete Your Setup</CardTitle>
            <CardDescription>
              {completedSteps} of {onboardingSteps.length} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="flex flex-wrap gap-4">
              {onboardingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400" />
                  )}
                  <span className={step.completed ? 'text-green-700' : 'text-slate-600'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/establish">
              <Button className="mt-4 gap-2">
                Continue Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cash Value</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(totalCashValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Wallet className="h-4 w-4" />
              <span>Across {policies.length} policies</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available to Borrow</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {formatCurrency(availableToBorrow)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <TrendingUp className="h-4 w-4" />
              <span>60-90% of cash value</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding Policy Loans</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {formatCurrency(totalLoans)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="h-4 w-4" />
              <span>{loans.filter((l) => l.status === 'ACTIVE').length} active loans</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total External Debt</CardDescription>
            <CardTitle className="text-2xl text-red-600">{formatCurrency(totalDebt)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="h-4 w-4" />
              <span>{debts.filter((d) => !d.isPaidOff).length} active debts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your IBC management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/utilize">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Simulate Policy Loan
              </Button>
            </Link>
            <Link href="/dashboard/establish">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Wallet className="h-4 w-4" />
                Add New Policy
              </Button>
            </Link>
            <Link href="/dashboard/manage">
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Record Payment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The IBC Cycle</CardTitle>
            <CardDescription>How Infinite Banking builds wealth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Fund Your Policy</p>
                  <p className="text-slate-600">
                    Direct savings into your dividend-paying whole life policy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Borrow at Low Rates</p>
                  <p className="text-slate-600">
                    Access 60-90% of cash value at 5-6% simple interest
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Pay Off High-Interest Debt</p>
                  <p className="text-slate-600">Eliminate credit cards and loans charging 15-25%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Recapture & Repeat</p>
                  <p className="text-slate-600">
                    Redirect freed payments to repay policy loan, building wealth
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
