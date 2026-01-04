'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, BookOpen, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MonitorPage() {
  const projectionYears = [
    { year: 1, cashValue: 5200, loans: 0, netWorth: 5200 },
    { year: 5, cashValue: 32000, loans: 0, netWorth: 32000 },
    { year: 10, cashValue: 78000, loans: 5000, netWorth: 73000 },
    { year: 15, cashValue: 145000, loans: 0, netWorth: 145000 },
    { year: 20, cashValue: 250000, loans: 0, netWorth: 250000 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-orange-600" />
          Monitor
        </h1>
        <p className="text-slate-600 mt-2">
          Track your progress, view projections, and learn more about IBC
        </p>
      </div>

      <Tabs defaultValue="projections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projections">Wealth Projections</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="projections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                20-Year Wealth Projection
              </CardTitle>
              <CardDescription>
                Based on $500/month contribution at 6% dividend rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-right py-3 px-4">Cash Value</th>
                      <th className="text-right py-3 px-4">Outstanding Loans</th>
                      <th className="text-right py-3 px-4">Net Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionYears.map((row) => (
                      <tr key={row.year} className="border-b">
                        <td className="py-3 px-4 font-medium">Year {row.year}</td>
                        <td className="text-right py-3 px-4 text-green-600">
                          ${row.cashValue.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-orange-600">
                          ${row.loans.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-bold">
                          ${row.netWorth.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Key Insights</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    Your cash value grows tax-free through uninterrupted compound interest
                  </li>
                  <li>Policy loans don't interrupt growth - your full cash value continues earning</li>
                  <li>
                    Death benefit provides family protection throughout the journey
                  </li>
                  <li>At year 20, you have access to $225,000+ for policy loans</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>Your IBC activity this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Premium Paid</span>
                  <span className="font-medium">$500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Loan Repayment</span>
                  <span className="font-medium">$800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dividends Earned</span>
                  <span className="font-medium text-green-600">$125</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Interest Recaptured</span>
                  <span className="font-medium text-green-600">$340</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cumulative Progress</CardTitle>
                <CardDescription>Your IBC journey so far</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Premiums Paid</span>
                  <span className="font-medium">$12,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Cash Value</span>
                  <span className="font-medium text-green-600">$11,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest Saved</span>
                  <span className="font-medium text-green-600">$4,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Debts Eliminated</span>
                  <span className="font-medium">2 of 5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learn About Infinite Banking
              </CardTitle>
              <CardDescription>
                Educational resources to master the IBC concept
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Play className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">IBC Fundamentals</h4>
                      <p className="text-sm text-slate-500">15 min video</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Learn the core concepts of Infinite Banking - how whole life policies work and
                    why they're the foundation of becoming your own banker.
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Now
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Play className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">The Debt Payoff Strategy</h4>
                      <p className="text-sm text-slate-500">20 min video</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Discover how to use policy loans to eliminate high-interest debt and recapture
                    the interest you would have paid to banks.
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Now
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Play className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cash Value Growth</h4>
                      <p className="text-sm text-slate-500">12 min video</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Understand how uninterrupted compound interest works and why policy loans don't
                    reduce your earnings.
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Now
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Play className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Advanced Strategies</h4>
                      <p className="text-sm text-slate-500">25 min video</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Learn advanced IBC techniques including financing major purchases, real estate
                    investment, and generational wealth building.
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
