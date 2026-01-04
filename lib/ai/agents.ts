import { generateAIResponse, AIProvider } from './providers'

interface AgentConfig {
  provider: AIProvider
  apiKey?: string
  selfHostedUrl?: string
  selfHostedModel?: string
}

const IBC_CONTEXT = `
You are an expert in the Infinite Banking Concept (IBC), a financial strategy that uses dividend-paying whole life insurance policies as a personal banking system.

Key IBC principles:
1. Whole life insurance from mutual companies provides guaranteed cash value growth, dividends (typically 5.7-6.6%), and death benefit protection.
2. Policy loans allow borrowing against cash value at low rates (5-6% simple interest) while the full cash value continues to earn dividends.
3. The strategy involves paying off high-interest debt with policy loans, then redirecting freed-up payments to repay the policy loan.
4. This "recycling and recapturing" of interest payments builds wealth over time through uninterrupted compound growth.
5. Benefits include tax-free growth, asset protection, and becoming your own banker.

Always provide educational guidance, not financial advice. Encourage users to consult with qualified professionals.
`

export async function runEstablishAgent(
  config: AgentConfig,
  userProfile: {
    annualIncome?: number
    savingsRate?: number
    currentSavings?: number
    age?: number
  }
): Promise<string> {
  const prompt = `
Based on the following user profile, provide recommendations for establishing their Infinite Banking setup:

Annual Income: ${userProfile.annualIncome ? `$${userProfile.annualIncome.toLocaleString()}` : 'Not provided'}
Savings Rate: ${userProfile.savingsRate ? `${userProfile.savingsRate}%` : 'Not provided'}
Current Savings: ${userProfile.currentSavings ? `$${userProfile.currentSavings.toLocaleString()}` : 'Not provided'}
Age: ${userProfile.age || 'Not provided'}

Please provide:
1. Recommended monthly premium range based on their income and savings capacity
2. Key features to look for in a whole life policy
3. Questions they should ask potential insurance providers
4. Timeline expectations for building cash value
`

  return generateAIResponse(
    config,
    [{ role: 'user', content: prompt }],
    IBC_CONTEXT +
      '\n\nYou are the Establish Agent, helping users set up their Infinite Banking foundation.'
  )
}

export async function runDebtPayoffAgent(
  config: AgentConfig,
  debts: Array<{
    name: string
    balance: number
    rate: number
    minimumPayment: number
  }>,
  availableLoanAmount: number
): Promise<string> {
  const debtList = debts
    .map(
      (d) =>
        `- ${d.name}: $${d.balance.toLocaleString()} at ${d.rate}% APR, minimum payment $${d.minimumPayment}`
    )
    .join('\n')

  const prompt = `
Analyze the following debts and recommend an IBC-based payoff strategy:

Current Debts:
${debtList}

Available Policy Loan Amount: $${availableLoanAmount.toLocaleString()}

Please provide:
1. Recommended payoff order (lowest balance first for quick wins)
2. How much to borrow from the policy
3. Projected monthly cash flow freed up after debt elimination
4. Repayment schedule for the policy loan
5. Interest savings compared to traditional payoff
`

  return generateAIResponse(
    config,
    [{ role: 'user', content: prompt }],
    IBC_CONTEXT +
      '\n\nYou are the Debt Payoff Agent, helping users eliminate debt using policy loans strategically.'
  )
}

export async function runCashFlowAgent(
  config: AgentConfig,
  monthlyIncome: number,
  monthlyExpenses: { category: string; amount: number }[],
  policyPremium: number,
  loanRepayment: number
): Promise<string> {
  const expenseList = monthlyExpenses
    .map((e) => `- ${e.category}: $${e.amount.toLocaleString()}`)
    .join('\n')

  const prompt = `
Analyze the following cash flow situation and provide optimization recommendations:

Monthly Income: $${monthlyIncome.toLocaleString()}

Monthly Expenses:
${expenseList}

Policy Premium: $${policyPremium.toLocaleString()}
Policy Loan Repayment: $${loanRepayment.toLocaleString()}

Please provide:
1. Current savings rate analysis
2. Opportunities to increase policy funding
3. Strategies to accelerate policy loan repayment
4. Long-term wealth projection based on current trajectory
`

  return generateAIResponse(
    config,
    [{ role: 'user', content: prompt }],
    IBC_CONTEXT + '\n\nYou are the Cash Flow Agent, helping users optimize their money flow.'
  )
}

export async function runProjectionAgent(
  config: AgentConfig,
  currentCashValue: number,
  monthlyContribution: number,
  dividendRate: number,
  yearsToProject: number
): Promise<string> {
  const prompt = `
Generate a wealth projection based on the following parameters:

Current Cash Value: $${currentCashValue.toLocaleString()}
Monthly Contribution: $${monthlyContribution.toLocaleString()}
Expected Dividend Rate: ${dividendRate}%
Projection Period: ${yearsToProject} years

Please provide:
1. Year-by-year cash value growth projection
2. Total dividends earned over the period
3. Comparison to traditional savings accounts
4. Potential loan capacity at each milestone
5. Death benefit growth projection
`

  return generateAIResponse(
    config,
    [{ role: 'user', content: prompt }],
    IBC_CONTEXT +
      '\n\nYou are the Projection Agent, helping users visualize their long-term wealth building.'
  )
}
