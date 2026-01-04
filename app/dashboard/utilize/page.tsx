'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Plus, Loader2, Sparkles, Calculator } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function UtilizePage() {
  const [loading, setLoading] = useState(false)
  const [aiStrategy, setAiStrategy] = useState('')
  const [debt, setDebt] = useState({
    name: '',
    type: 'CREDIT_CARD',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    minimumPayment: '',
  })
  const [simulation, setSimulation] = useState({
    loanAmount: '',
    purpose: 'DEBT_PAYOFF',
  })
  const [simulationResult, setSimulationResult] = useState<{
    monthlyPayment: number
    totalInterest: number
    payoffMonths: number
    interestSavings: number
  } | null>(null)

  async function addDebt(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...debt,
          originalAmount: parseFloat(debt.originalAmount),
          currentBalance: parseFloat(debt.currentBalance),
          interestRate: parseFloat(debt.interestRate),
          minimumPayment: parseFloat(debt.minimumPayment),
        }),
      })
      setDebt({
        name: '',
        type: 'CREDIT_CARD',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        minimumPayment: '',
      })
    } catch (error) {
      console.error('Failed to add debt:', error)
    } finally {
      setLoading(false)
    }
  }

  function runSimulation() {
    const loanAmount = parseFloat(simulation.loanAmount)
    const policyRate = 5.5
    const originalRate = 18

    const monthlyPolicyRate = policyRate / 100 / 12
    const monthlyOriginalRate = originalRate / 100 / 12
    const months = 36

    const policyPayment =
      (loanAmount * monthlyPolicyRate * Math.pow(1 + monthlyPolicyRate, months)) /
      (Math.pow(1 + monthlyPolicyRate, months) - 1)
    const originalPayment =
      (loanAmount * monthlyOriginalRate * Math.pow(1 + monthlyOriginalRate, months)) /
      (Math.pow(1 + monthlyOriginalRate, months) - 1)

    const policyTotalInterest = policyPayment * months - loanAmount
    const originalTotalInterest = originalPayment * months - loanAmount

    setSimulationResult({
      monthlyPayment: policyPayment,
      totalInterest: policyTotalInterest,
      payoffMonths: months,
      interestSavings: originalTotalInterest - policyTotalInterest,
    })
  }

  async function getStrategy() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/debt-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      setAiStrategy(data.strategy)
    } catch (error) {
      console.error('Failed to get strategy:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-green-600" />
          Utilize
        </h1>
        <p className="text-slate-600 mt-2">
          Put your policy to work: borrow, pay off debt, and recapture interest
        </p>
      </div>

      <Tabs defaultValue="debts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="debts">Manage Debts</TabsTrigger>
          <TabsTrigger value="simulate">Loan Simulator</TabsTrigger>
          <TabsTrigger value="strategy">AI Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="debts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Debt
              </CardTitle>
              <CardDescription>Track your debts to build your payoff strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addDebt} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtName">Debt Name</Label>
                    <Input
                      id="debtName"
                      placeholder="Chase Credit Card"
                      value={debt.name}
                      onChange={(e) => setDebt({ ...debt, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtType">Type</Label>
                    <Select
                      value={debt.type}
                      onValueChange={(value) => setDebt({ ...debt, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="CAR_LOAN">Car Loan</SelectItem>
                        <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                        <SelectItem value="STUDENT_LOAN">Student Loan</SelectItem>
                        <SelectItem value="PERSONAL_LOAN">Personal Loan</SelectItem>
                        <SelectItem value="MEDICAL">Medical</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentBalance">Current Balance ($)</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                      placeholder="5000"
                      value={debt.currentBalance}
                      onChange={(e) => setDebt({ ...debt, currentBalance: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="18.9"
                      value={debt.interestRate}
                      onChange={(e) => setDebt({ ...debt, interestRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumPayment">Minimum Payment ($)</Label>
                    <Input
                      id="minimumPayment"
                      type="number"
                      placeholder="150"
                      value={debt.minimumPayment}
                      onChange={(e) => setDebt({ ...debt, minimumPayment: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Plus className="h-4 w-4" />
                  Add Debt
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulate">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Policy Loan Simulator
                </CardTitle>
                <CardDescription>
                  See how borrowing from your policy saves on interest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="10000"
                    value={simulation.loanAmount}
                    onChange={(e) => setSimulation({ ...simulation, loanAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select
                    value={simulation.purpose}
                    onValueChange={(value) => setSimulation({ ...simulation, purpose: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEBT_PAYOFF">Pay Off Debt</SelectItem>
                      <SelectItem value="INVESTMENT">Investment</SelectItem>
                      <SelectItem value="PURCHASE">Major Purchase</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={runSimulation} className="w-full gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate
                </Button>
              </CardContent>
            </Card>

            {simulationResult && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Simulation Results</CardTitle>
                  <CardDescription>Based on 5.5% policy loan vs 18% credit card</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Monthly Payment</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(simulationResult.monthlyPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Payoff Period</p>
                      <p className="text-xl font-bold">{simulationResult.payoffMonths} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Interest (Policy)</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(simulationResult.totalInterest)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Interest Savings</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(simulationResult.interestSavings)}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg text-sm text-green-800">
                    By using your policy loan instead of keeping high-interest debt, you save{' '}
                    <strong>{formatCurrency(simulationResult.interestSavings)}</strong> in interest
                    while your cash value continues earning dividends!
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Debt Payoff Strategy
              </CardTitle>
              <CardDescription>
                Get a personalized strategy to eliminate debt using your policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={getStrategy} disabled={loading} className="mb-4 gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Generate Strategy
              </Button>
              {aiStrategy && (
                <div className="p-4 bg-slate-50 rounded-lg whitespace-pre-wrap text-sm">
                  {aiStrategy}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
