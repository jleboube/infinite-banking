'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Loader2, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    annualIncome: '',
    savingsRate: '10',
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile({
            name: data.name || '',
            email: data.email || '',
            annualIncome: data.annualIncome?.toString() || '',
            savingsRate: data.savingsRate?.toString() || '10',
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const payload = {
        name: profile.name || undefined,
        annualIncome: profile.annualIncome ? parseFloat(profile.annualIncome) : undefined,
        savingsRate: profile.savingsRate ? parseFloat(profile.savingsRate) : undefined,
      }
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-slate-600" />
          Settings
        </h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income ($)</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  placeholder="75000"
                  value={profile.annualIncome}
                  onChange={(e) => setProfile({ ...profile, annualIncome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savingsRate">Target Savings Rate (%)</Label>
                <Input
                  id="savingsRate"
                  type="number"
                  placeholder="10"
                  value={profile.savingsRate}
                  onChange={(e) => setProfile({ ...profile, savingsRate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              {saved && (
                <span className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved successfully
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-slate-500">Download all your IBC data as JSON</p>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-slate-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
