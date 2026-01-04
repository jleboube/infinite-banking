'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Brain, Loader2, CheckCircle2 } from 'lucide-react'

export default function AISettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    provider: 'OPENAI',
    apiKey: '',
    selfHostedUrl: '',
    selfHostedModel: '',
  })

  async function saveConfig(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save config:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          AI Settings
        </h1>
        <p className="text-slate-600 mt-2">Configure your preferred AI provider for IBC guidance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Provider Configuration</CardTitle>
          <CardDescription>
            Choose your AI provider or configure a self-hosted solution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveConfig} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select
                value={config.provider}
                onValueChange={(value) => setConfig({ ...config, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPENAI">OpenAI (GPT-4)</SelectItem>
                  <SelectItem value="ANTHROPIC">Anthropic (Claude)</SelectItem>
                  <SelectItem value="GEMINI">Google Gemini</SelectItem>
                  <SelectItem value="GROK">xAI Grok</SelectItem>
                  <SelectItem value="SELF_HOSTED">Self-Hosted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.provider !== 'SELF_HOSTED' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
                <p className="text-xs text-slate-500">
                  Your API key is encrypted and stored securely
                </p>
              </div>
            )}

            {config.provider === 'SELF_HOSTED' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="selfHostedUrl">Self-Hosted URL</Label>
                  <Input
                    id="selfHostedUrl"
                    placeholder="http://localhost:11434/api/generate"
                    value={config.selfHostedUrl}
                    onChange={(e) => setConfig({ ...config, selfHostedUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selfHostedModel">Model Name</Label>
                  <Input
                    id="selfHostedModel"
                    placeholder="llama2"
                    value={config.selfHostedModel}
                    onChange={(e) => setConfig({ ...config, selfHostedModel: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Configuration
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
          <CardTitle>Provider Comparison</CardTitle>
          <CardDescription>Choose the best AI provider for your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">OpenAI (GPT-4)</h4>
              <p className="text-sm text-slate-600">
                Industry-leading language model with excellent financial reasoning capabilities.
                Best for detailed analysis and complex calculations.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Anthropic (Claude)</h4>
              <p className="text-sm text-slate-600">
                Known for nuanced, thoughtful responses. Excellent at explaining complex concepts
                and providing balanced perspectives.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Google Gemini</h4>
              <p className="text-sm text-slate-600">
                Google's latest AI with strong analytical capabilities. Good for data-driven
                insights and projections.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">xAI Grok</h4>
              <p className="text-sm text-slate-600">
                Real-time knowledge and unique perspective. Good for current market insights and
                trend analysis.
              </p>
            </div>
            <div className="border rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold mb-2">Self-Hosted (Ollama/LM Studio)</h4>
              <p className="text-sm text-slate-600">
                Run AI locally for maximum privacy. Supports Llama, Mistral, and other open-source
                models. Requires local setup but keeps all data on your machine.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
