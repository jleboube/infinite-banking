'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Wallet,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Settings,
  BarChart3,
  CreditCard,
  LogOut,
  Brain,
} from 'lucide-react'

interface DashboardNavProps {
  user: {
    name?: string | null
    email: string
  }
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/establish', label: 'Establish', icon: Shield },
  { href: '/dashboard/utilize', label: 'Utilize', icon: CreditCard },
  { href: '/dashboard/manage', label: 'Manage', icon: TrendingUp },
  { href: '/dashboard/monitor', label: 'Monitor', icon: BarChart3 },
  { href: '/dashboard/ai-settings', label: 'AI Settings', icon: Brain },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold hidden sm:block">IBM</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn('gap-2', isActive && 'bg-slate-100')}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user.name || user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
