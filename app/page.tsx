import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, TrendingUp, Wallet, Brain } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Infinite Banking Manager</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Take Control of Your Financial Future
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Leverage the Infinite Banking Concept with AI-powered guidance. Build wealth,
            eliminate debt, and become your own banker.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Your Journey <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">The Four Pillars of IBC</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Establish</CardTitle>
                <CardDescription>Set up your whole life policy foundation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  AI-guided policy recommendations based on your financial profile. Connect with
                  dividend-paying mutual companies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Utilize</CardTitle>
                <CardDescription>Put your policy to work</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Borrow against your policy at competitive rates. Pay off high-interest debt and
                  recapture interest payments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Manage</CardTitle>
                <CardDescription>Optimize your cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Track loan repayments, automate transfers, and maximize the spread between what
                  you earn and what you pay.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Monitor</CardTitle>
                <CardDescription>AI-powered insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Real-time dashboards, wealth projections, and proactive alerts. Your AI agents
                  work 24/7 for your financial success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Powered by Your Choice of AI</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Configure your preferred AI provider - OpenAI, Anthropic, Google Gemini, Grok, or
              even your own self-hosted solution. Our agentic architecture adapts to your needs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {['OpenAI', 'Anthropic', 'Google Gemini', 'Grok', 'Self-Hosted'].map((provider) => (
                <span
                  key={provider}
                  className="px-4 py-2 bg-slate-800 rounded-full text-sm font-medium"
                >
                  {provider}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Become Your Own Banker?</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">
            Join thousands who are taking control of their financial destiny with the Infinite
            Banking Concept.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p className="mb-4">
            <strong>Disclaimer:</strong> This application is for educational and simulation
            purposes only. It does not constitute financial, legal, or tax advice. Consult with
            qualified professionals before making financial decisions.
          </p>
          <p>&copy; {new Date().getFullYear()} Infinite Banking Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
