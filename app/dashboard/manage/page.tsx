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
import { TrendingUp, ArrowUpDown, Loader2, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ManagePage() {
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState({
    type: 'POLICY_LOAN_REPAYMENT',
    amount: '',
    description: '',
  })

  async function recordTransaction(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          amount: parseFloat(transaction.amount),
        }),
      })
      setTransaction({
        type: 'POLICY_LOAN_REPAYMENT',
        amount: '',
        description: '',
      })
    } catch (error) {
      console.error('Failed to record transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const cashFlowSummary = {
    monthlyIncome: 7500,
    policyPremium: 500,
    loanRepayment: 800,
    debtPayments: 450,
    otherExpenses: 4500,
    surplus: 1250,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          Manage
        </h1>
        <p className="text-slate-600 mt-2">
          Track transactions, manage loans, and optimize your cash flow
        </p>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Record Transaction</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="loans">Active Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Record Transaction
              </CardTitle>
              <CardDescription>
                Log policy premiums, loan repayments, and other transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={recordTransaction} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="txType">Transaction Type</Label>
                    <Select
                      value={transaction.type}
                      onValueChange={(value) => setTransaction({ ...transaction, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POLICY_PREMIUM">Policy Premium Payment</SelectItem>
                        <SelectItem value="POLICY_LOAN_DISBURSEMENT">Loan Disbursement</SelectItem>
                        <SelectItem value="POLICY_LOAN_REPAYMENT">Loan Repayment</SelectItem>
                        <SelectItem value="DEBT_PAYMENT">Debt Payment</SelectItem>
                        <SelectItem value="DIVIDEND_CREDIT">Dividend Credit</SelectItem>
                        <SelectItem value="SAVINGS_DEPOSIT">Savings Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="500"
                      value={transaction.amount}
                      onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Monthly premium payment"
                      value={transaction.description}
                      onChange={(e) =>
                        setTransaction({ ...transaction, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Record Transaction
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Monthly Cash Flow Summary
              </CardTitle>
              <CardDescription>Track your income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Monthly Income</span>
                  <span className="text-green-600 font-bold">
                    +{formatCurrency(cashFlowSummary.monthlyIncome)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Policy Premium</span>
                    <span className="text-red-600">
                      -{formatCurrency(cashFlowSummary.policyPremium)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Policy Loan Repayment</span>
                    <span className="text-red-600">
                      -{formatCurrency(cashFlowSummary.loanRepayment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">External Debt Payments</span>
                    <span className="text-red-600">
                      -{formatCurrency(cashFlowSummary.debtPayments)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Other Expenses</span>
                    <span className="text-red-600">
                      -{formatCurrency(cashFlowSummary.otherExpenses)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t">
                  <span className="font-medium">Monthly Surplus</span>
                  <span className="text-green-600 font-bold">
                    {formatCurrency(cashFlowSummary.surplus)}
                  </span>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Tip:</strong> Consider redirecting{' '}
                  {formatCurrency(cashFlowSummary.surplus)} of your monthly surplus to accelerate
                  policy loan repayment or increase policy funding.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Active Policy Loans</CardTitle>
              <CardDescription>Track and manage your outstanding policy loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <p>No active policy loans</p>
                <p className="text-sm mt-2">
                  Go to the Utilize tab to simulate and request a policy loan
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
