'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Building2, Plus, Loader2, Sparkles } from 'lucide-react'

export default function EstablishPage() {
  const [loading, setLoading] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState('')
  const [profile, setProfile] = useState({
    annualIncome: '',
    savingsRate: '10',
    currentSavings: '',
    age: '',
  })
  const [policy, setPolicy] = useState({
    name: '',
    company: '',
    monthlyPremium: '',
    deathBenefit: '',
    dividendRate: '6.0',
    guaranteedRate: '4.0',
    loanRate: '5.0',
  })

  async function getRecommendation() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/establish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      setAiRecommendation(data.recommendation)
    } catch (error) {
      console.error('Failed to get recommendation:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePolicy(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...policy,
          monthlyPremium: parseFloat(policy.monthlyPremium),
          deathBenefit: parseFloat(policy.deathBenefit),
          dividendRate: parseFloat(policy.dividendRate),
          guaranteedRate: parseFloat(policy.guaranteedRate),
          loanRate: parseFloat(policy.loanRate),
        }),
      })
      if (res.ok) {
        setPolicy({
          name: '',
          company: '',
          monthlyPremium: '',
          deathBenefit: '',
          dividendRate: '6.0',
          guaranteedRate: '4.0',
          loanRate: '5.0',
        })
      }
    } catch (error) {
      console.error('Failed to save policy:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          Establish
        </h1>
        <p className="text-slate-600 mt-2">
          Set up your whole life insurance policy foundation for Infinite Banking
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Financial Profile</TabsTrigger>
          <TabsTrigger value="policy">Add Policy</TabsTrigger>
          <TabsTrigger value="recommendation">AI Recommendation</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Financial Profile</CardTitle>
              <CardDescription>
                Tell us about your finances to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="75000"
                    value={profile.annualIncome}
                    onChange={(e) => setProfile({ ...profile, annualIncome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsRate">Savings Rate (%)</Label>
                  <Input
                    id="savingsRate"
                    type="number"
                    placeholder="10"
                    value={profile.savingsRate}
                    onChange={(e) => setProfile({ ...profile, savingsRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">Current Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="10000"
                    value={profile.currentSavings}
                    onChange={(e) => setProfile({ ...profile, currentSavings: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="35"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={() => {}} className="mt-4">
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Add Whole Life Policy
              </CardTitle>
              <CardDescription>
                Enter details about your dividend-paying whole life insurance policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePolicy} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyName">Policy Name</Label>
                    <Input
                      id="policyName"
                      placeholder="My Primary Policy"
                      value={policy.name}
                      onChange={(e) => setPolicy({ ...policy, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Insurance Company</Label>
                    <Input
                      id="company"
                      placeholder="e.g., MassMutual, Northwestern Mutual"
                      value={policy.company}
                      onChange={(e) => setPolicy({ ...policy, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPremium">Monthly Premium ($)</Label>
                    <Input
                      id="monthlyPremium"
                      type="number"
                      placeholder="500"
                      value={policy.monthlyPremium}
                      onChange={(e) => setPolicy({ ...policy, monthlyPremium: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deathBenefit">Death Benefit ($)</Label>
                    <Input
                      id="deathBenefit"
                      type="number"
                      placeholder="500000"
                      value={policy.deathBenefit}
                      onChange={(e) => setPolicy({ ...policy, deathBenefit: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dividendRate">Dividend Rate (%)</Label>
                    <Input
                      id="dividendRate"
                      type="number"
                      step="0.1"
                      value={policy.dividendRate}
                      onChange={(e) => setPolicy({ ...policy, dividendRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanRate">Policy Loan Rate (%)</Label>
                    <Input
                      id="loanRate"
                      type="number"
                      step="0.1"
                      value={policy.loanRate}
                      onChange={(e) => setPolicy({ ...policy, loanRate: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="gap-2" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Plus className="h-4 w-4" />
                  Add Policy
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Policy Recommendation
              </CardTitle>
              <CardDescription>
                Get personalized guidance based on your financial profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={getRecommendation} disabled={loading} className="mb-4 gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Get Recommendation
              </Button>
              {aiRecommendation && (
                <div className="p-4 bg-slate-50 rounded-lg whitespace-pre-wrap text-sm">
                  {aiRecommendation}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
