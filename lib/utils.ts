import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  )
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 12
): number {
  return (
    principal *
    Math.pow(1 + annualRate / 100 / compoundingFrequency, compoundingFrequency * years)
  )
}

export function calculateDebtPayoffTime(
  balance: number,
  monthlyPayment: number,
  annualRate: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyPayment <= balance * monthlyRate) return Infinity
  return Math.ceil(
    Math.log(monthlyPayment / (monthlyPayment - balance * monthlyRate)) /
      Math.log(1 + monthlyRate)
  )
}
