// js/quiz.js — Financial Literacy Quiz + Before/After Scoring, Retakes & Learning Progress (Phase 2)

// ============================================================================
// 1. EXPANDED FINANCIAL LITERACY QUESTION BANKS (20+ Questions Per Pool)
// Covering: Budgeting, Emergency Fund, Compounding, Diversification, Risk vs Return, Debt
// ============================================================================

const QUIZ_QUESTION_BANKS = {
    before: [
        // --- Budgeting ---
        {
            id: 'b_budget_01',
            category: 'budgeting',
            questionKey: 'quiz_b_q1',
            questionFallback: 'What is the main purpose of creating a monthly budget?',
            options: [
                { key: 'quiz_b_q1_o1', text: 'To spend all earnings before the month ends', isCorrect: false },
                { key: 'quiz_b_q1_o2', text: 'To plan and track income, essentials, savings, and investments', isCorrect: true },
                { key: 'quiz_b_q1_o3', text: 'To eliminate all entertainment and lifestyle spending completely', isCorrect: false },
                { key: 'quiz_b_q1_o4', text: 'To qualify for higher loan limits from commercial banks', isCorrect: false }
            ]
        },
        {
            id: 'b_budget_02',
            category: 'budgeting',
            questionKey: 'quiz_b_q2_new',
            questionFallback: 'Under the standard 50/30/20 budgeting framework, what does the 50% category cover?',
            options: [
                { key: 'quiz_b_q2_o1_new', text: 'Stock market investments and cryptocurrency trading', isCorrect: false },
                { key: 'quiz_b_q2_o2_new', text: 'Essential living needs like rent, groceries, utilities, and healthcare', isCorrect: true },
                { key: 'quiz_b_q2_o3_new', text: 'Dining out, vacation travel, and entertainment subscriptions', isCorrect: false },
                { key: 'quiz_b_q2_o4_new', text: 'High-risk speculative financial schemes', isCorrect: false }
            ]
        },
        {
            id: 'b_budget_03',
            category: 'budgeting',
            questionKey: 'quiz_b_q3_new',
            questionFallback: 'What is the fundamental difference between a financial "Need" and a "Want"?',
            options: [
                { key: 'quiz_b_q3_o1_new', text: 'Needs are luxury items; Wants are daily basic necessities', isCorrect: false },
                { key: 'quiz_b_q3_o2_new', text: 'Needs are essentials for survival and health; Wants are lifestyle preferences', isCorrect: true },
                { key: 'quiz_b_q3_o3_new', text: 'There is no difference between needs and wants in personal finance', isCorrect: false },
                { key: 'quiz_b_q3_o4_new', text: 'Needs should be funded using high-interest personal loans', isCorrect: false }
            ]
        },
        {
            id: 'b_budget_04',
            category: 'budgeting',
            questionKey: 'quiz_b_q4',
            questionFallback: 'Which method is most effective for building regular monthly savings discipline?',
            options: [
                { key: 'quiz_b_q4_o1', text: 'Saving whatever random leftover cash remains at the end of the month', isCorrect: false },
                { key: 'quiz_b_q4_o2', text: 'Automating savings and investments first when income arrives (Pay Yourself First)', isCorrect: true },
                { key: 'quiz_b_q4_o3', text: 'Stopping all necessary insurance coverage and utility payments', isCorrect: false },
                { key: 'quiz_b_q4_o4', text: 'Relying exclusively on annual bonus windfalls', isCorrect: false }
            ]
        },

        // --- Emergency Fund ---
        {
            id: 'b_emergency_01',
            category: 'emergency_fund',
            questionKey: 'quiz_b_q2',
            questionFallback: 'Why is building an emergency fund essential before investing aggressively?',
            options: [
                { key: 'quiz_b_q2_o1', text: 'To fund luxury gadget purchases and holiday vacations', isCorrect: false },
                { key: 'quiz_b_q2_o2', text: 'To protect against unforeseen life shocks without resorting to high-interest debt', isCorrect: true },
                { key: 'quiz_b_q2_o3', text: 'To double your monthly income within a single financial quarter', isCorrect: false },
                { key: 'quiz_b_q2_o4', text: 'To avoid paying monthly utility bills', isCorrect: false }
            ]
        },
        {
            id: 'b_emergency_02',
            category: 'emergency_fund',
            questionKey: 'quiz_b_q3',
            questionFallback: 'What is the widely recommended size for a personal emergency fund reserve?',
            options: [
                { key: 'quiz_b_q3_o1', text: '1 week of grocery expenses', isCorrect: false },
                { key: 'quiz_b_q3_o2', text: '3 to 6 months of essential living expenses', isCorrect: true },
                { key: 'quiz_b_q3_o3', text: 'Exactly 5 years of total annual salary', isCorrect: false },
                { key: 'quiz_b_q3_o4', text: '₹1,000 regardless of your monthly expense level', isCorrect: false }
            ]
        },
        {
            id: 'b_emergency_03',
            category: 'emergency_fund',
            questionKey: 'quiz_b_em3',
            questionFallback: 'Where should your emergency reserve money ideally be stored?',
            options: [
                { key: 'quiz_b_em3_o1', text: 'In high-risk volatile penny stocks or crypto coins', isCorrect: false },
                { key: 'quiz_b_em3_o2', text: 'In safe, highly liquid accounts like sweep-in FDs or liquid funds', isCorrect: true },
                { key: 'quiz_b_em3_o3', text: 'In illiquid real estate land with a 10-year lock-in', isCorrect: false },
                { key: 'quiz_b_em3_o4', text: 'Locked in non-withdrawable pension plans', isCorrect: false }
            ]
        },
        {
            id: 'b_emergency_04',
            category: 'emergency_fund',
            questionKey: 'quiz_b_em4',
            questionFallback: 'Which scenario is a valid reason to withdraw money from your Emergency Fund?',
            options: [
                { key: 'quiz_b_em4_o1', text: 'Buying the latest smartphone during a festive flash sale', isCorrect: false },
                { key: 'quiz_b_em4_o2', text: 'Sudden unexpected medical hospitalization or temporary income disruption', isCorrect: true },
                { key: 'quiz_b_em4_o3', text: 'Funding an impulsive weekend holiday with friends', isCorrect: false },
                { key: 'quiz_b_em4_o4', text: 'Speculative day trading in futures and options', isCorrect: false }
            ]
        },

        // --- Compounding ---
        {
            id: 'b_compound_01',
            category: 'compounding',
            questionKey: 'quiz_b_q6',
            questionFallback: 'What is compound growth (compounding) in long-term wealth creation?',
            options: [
                { key: 'quiz_b_q6_o1', text: 'Earning interest only on the initial principal deposited', isCorrect: false },
                { key: 'quiz_b_q6_o2', text: 'Earning returns on both the original principal and accumulated past returns', isCorrect: true },
                { key: 'quiz_b_q6_o3', text: 'A penalty fee charged by commercial banks for saving', isCorrect: false },
                { key: 'quiz_b_q6_o4', text: 'Paying double income tax on your savings', isCorrect: false }
            ]
        },
        {
            id: 'b_compound_02',
            category: 'compounding',
            questionKey: 'quiz_b_cmp2',
            questionFallback: 'Who benefits the most from the compounding effect in investing?',
            options: [
                { key: 'quiz_b_cmp2_o1', text: 'Someone who waits until age 50 to make their first investment', isCorrect: false },
                { key: 'quiz_b_cmp2_o2', text: 'An investor who starts early and stays invested consistently over decades', isCorrect: true },
                { key: 'quiz_b_cmp2_o3', text: 'Someone who constantly withdraws all gains every few weeks', isCorrect: false },
                { key: 'quiz_b_cmp2_o4', text: 'Someone who keeps 100% of their savings in cash at home', isCorrect: false }
            ]
        },
        {
            id: 'b_compound_03',
            category: 'compounding',
            questionKey: 'quiz_b_cmp3',
            questionFallback: 'What happens when you reinvest returns instead of spending them immediately?',
            options: [
                { key: 'quiz_b_cmp3_o1', text: 'Your principal shrinks and compound growth slows down', isCorrect: false },
                { key: 'quiz_b_cmp3_o2', text: 'Your asset base expands, accelerating the future exponential growth rate', isCorrect: true },
                { key: 'quiz_b_cmp3_o3', text: 'Your bank account automatically closes', isCorrect: false },
                { key: 'quiz_b_cmp3_o4', text: 'Inflation doubles immediately', isCorrect: false }
            ]
        },

        // --- Diversification ---
        {
            id: 'b_diversify_01',
            category: 'diversification',
            questionKey: 'quiz_b_q7',
            questionFallback: 'What is asset diversification in personal investing?',
            options: [
                { key: 'quiz_b_q7_o1', text: 'Investing 100% of your net worth into a single speculative stock', isCorrect: false },
                { key: 'quiz_b_q7_o2', text: 'Spreading investments across different assets (equity, debt, gold) to balance risk', isCorrect: true },
                { key: 'quiz_b_q7_o3', text: 'Keeping all savings hidden in physical cash at home', isCorrect: false },
                { key: 'quiz_b_q7_o4', text: 'Opening 10 bank accounts at the same local branch', isCorrect: false }
            ]
        },
        {
            id: 'b_diversify_02',
            category: 'diversification',
            questionKey: 'quiz_b_div2',
            questionFallback: 'What is the main danger of putting all your money into a single company\'s shares?',
            options: [
                { key: 'quiz_b_div2_o1', text: 'Your portfolio automatically receives government tax exemptions', isCorrect: false },
                { key: 'quiz_b_div2_o2', text: 'Extreme concentration risk — if that company crashes, you could lose everything', isCorrect: true },
                { key: 'quiz_b_div2_o3', text: 'The stock market will stop trading that company forever', isCorrect: false },
                { key: 'quiz_b_div2_o4', text: 'There is zero financial risk in single-company investing', isCorrect: false }
            ]
        },
        {
            id: 'b_diversify_03',
            category: 'diversification',
            questionKey: 'quiz_b_div3',
            questionFallback: 'Why is holding both equity (growth) and debt/FD (stability) recommended?',
            options: [
                { key: 'quiz_b_div3_o1', text: 'To guarantee that stock market crashes never happen again', isCorrect: false },
                { key: 'quiz_b_div3_o2', text: 'Debt provides capital stability and income cushion when stock markets fluctuate', isCorrect: true },
                { key: 'quiz_b_div3_o3', text: 'To avoid filing an annual income tax return', isCorrect: false },
                { key: 'quiz_b_div3_o4', text: 'Because banks mandate buying both for account holders', isCorrect: false }
            ]
        },

        // --- Risk vs Return ---
        {
            id: 'b_risk_01',
            category: 'risk_return',
            questionKey: 'quiz_b_q8',
            questionFallback: 'What is the relationship between financial risk and potential investment return?',
            options: [
                { key: 'quiz_b_q8_o1', text: 'High potential returns are always guaranteed with zero financial risk', isCorrect: false },
                { key: 'quiz_b_q8_o2', text: 'Higher potential returns generally involve higher risk and volatility', isCorrect: true },
                { key: 'quiz_b_q8_o3', text: 'Savings accounts consistently beat stock market returns over 20 years', isCorrect: false },
                { key: 'quiz_b_q8_o4', text: 'Risk and investment return have no correlation in finance', isCorrect: false }
            ]
        },
        {
            id: 'b_risk_02',
            category: 'risk_return',
            questionKey: 'quiz_b_risk2',
            questionFallback: 'For a short-term goal needed within 6–12 months, which option is most appropriate?',
            options: [
                { key: 'quiz_b_risk2_o1', text: 'High-risk small cap equity stocks or intraday crypto trading', isCorrect: false },
                { key: 'quiz_b_risk2_o2', text: 'Low-risk capital preservation options like Fixed Deposits or Liquid Funds', isCorrect: true },
                { key: 'quiz_b_risk2_o3', text: 'Purchasing commercial real estate land', isCorrect: false },
                { key: 'quiz_b_risk2_o4', text: 'Speculative lottery derivatives', isCorrect: false }
            ]
        },
        {
            id: 'b_risk_03',
            category: 'risk_return',
            questionKey: 'quiz_b_risk3',
            questionFallback: 'Why is inflation considered a "hidden risk" for cash kept idle at home or in zero-interest accounts?',
            options: [
                { key: 'quiz_b_risk3_o1', text: 'Paper notes physically evaporate over time', isCorrect: false },
                { key: 'quiz_b_risk3_o2', text: 'Rising prices gradually erode the purchasing power of your money over time', isCorrect: true },
                { key: 'quiz_b_risk3_o3', text: 'Cash automatically doubles every single year', isCorrect: false },
                { key: 'quiz_b_risk3_o4', text: 'Inflation only affects foreign currencies, not Indian Rupees', isCorrect: false }
            ]
        },

        // --- Debt Management ---
        {
            id: 'b_debt_01',
            category: 'debt',
            questionKey: 'quiz_b_q9',
            questionFallback: 'Why is high-interest debt (like credit card rolling balances) dangerous to financial health?',
            options: [
                { key: 'quiz_b_q9_o1', text: 'It automatically improves your credit bureau score', isCorrect: false },
                { key: 'quiz_b_q9_o2', text: 'Compound interest works against you, compounding debt balances rapidly', isCorrect: true },
                { key: 'quiz_b_q9_o3', text: 'Credit card companies never charge any interest or penalties', isCorrect: false },
                { key: 'quiz_b_q9_o4', text: 'Commercial banks forgive all debts after six months', isCorrect: false }
            ]
        },
        {
            id: 'b_debt_02',
            category: 'debt',
            questionKey: 'quiz_b_dbt2',
            questionFallback: 'What happens if you continuously pay only the "Minimum Amount Due" on credit card bills?',
            options: [
                { key: 'quiz_b_dbt2_o1', text: 'Your entire loan balance is cleared without extra cost', isCorrect: false },
                { key: 'quiz_b_dbt2_o2', text: 'Hefty interest (36–42% p.a.) is charged on remaining balance, trapping you in long-term debt', isCorrect: true },
                { key: 'quiz_b_dbt2_o3', text: 'The bank rewards you with free shares', isCorrect: false },
                { key: 'quiz_b_dbt2_o4', text: 'Your credit limit increases with zero fees', isCorrect: false }
            ]
        },

        // --- Vridhi Framework & Goal Planning ---
        {
            id: 'b_goal_01',
            category: 'goal_planning',
            questionKey: 'quiz_b_q5',
            questionFallback: 'What makes a personal financial goal actionable and achievable?',
            options: [
                { key: 'quiz_b_q5_o1', text: 'Leaving the target amount and deadline completely undefined', isCorrect: false },
                { key: 'quiz_b_q5_o2', text: 'Having a specific target amount, clear deadline, and planned monthly allocation', isCorrect: true },
                { key: 'quiz_b_q5_o3', text: 'Relying entirely on lottery or gambling winnings', isCorrect: false },
                { key: 'quiz_b_q5_o4', text: 'Changing the target milestone every single week', isCorrect: false }
            ]
        },
        {
            id: 'b_framework_01',
            category: 'wealth_pillar',
            questionKey: 'quiz_b_q10',
            questionFallback: 'In Vridhi\'s 20-20-30-30 framework, what is the role of the 30% Wealth Generation pillar?',
            options: [
                { key: 'quiz_b_q10_o1', text: 'Covering regular home rent and grocery purchases', isCorrect: false },
                { key: 'quiz_b_q10_o2', text: 'Investing systematically in compounding assets like mutual funds and SIPs for long-term growth', isCorrect: true },
                { key: 'quiz_b_q10_o3', text: 'Uncontrolled impulsive shopping and gambling', isCorrect: false },
                { key: 'quiz_b_q10_o4', text: 'Keeping cash in physical wallets', isCorrect: false }
            ]
        }
    ],

    after: [
        // --- Budgeting ---
        {
            id: 'a_budget_01',
            category: 'budgeting',
            questionKey: 'quiz_a_q1',
            questionFallback: 'How does maintaining a disciplined monthly budget benefit long-term financial health?',
            options: [
                { key: 'quiz_a_q1_o1', text: 'It completely eliminates nationwide inflation', isCorrect: false },
                { key: 'quiz_a_q1_o2', text: 'It controls discretionary leaks and ensures savings and investments are funded first', isCorrect: true },
                { key: 'quiz_a_q1_o3', text: 'It requires keeping all money exclusively in physical cash', isCorrect: false },
                { key: 'quiz_a_q1_o4', text: 'It completely prohibits spending any money on your family', isCorrect: false }
            ]
        },
        {
            id: 'a_budget_02',
            category: 'budgeting',
            questionKey: 'quiz_a_bg2',
            questionFallback: 'If your monthly income increases due to an increment, what is the smartest financial move?',
            options: [
                { key: 'quiz_a_bg2_o1', text: 'Double all luxury discretionary spending immediately (lifestyle inflation)', isCorrect: false },
                { key: 'quiz_a_bg2_o2', text: 'Increase your monthly savings and investment SIP allocations proportionally', isCorrect: true },
                { key: 'quiz_a_bg2_o3', text: 'Stop tracking monthly expenses entirely', isCorrect: false },
                { key: 'quiz_a_bg2_o4', text: 'Take out new high-interest consumer personal loans', isCorrect: false }
            ]
        },
        {
            id: 'a_budget_03',
            category: 'budgeting',
            questionKey: 'quiz_a_q4',
            questionFallback: 'Why is automated monthly investing (SIP) more effective than manual market timing?',
            options: [
                { key: 'quiz_a_q4_o1', text: 'It guarantees the stock market will never experience a red day', isCorrect: false },
                { key: 'quiz_a_q4_o2', text: 'It removes emotional bias and uses Rupee Cost Averaging across market cycles', isCorrect: true },
                { key: 'quiz_a_q4_o3', text: 'It requires checking stock prices every single minute of the day', isCorrect: false },
                { key: 'quiz_a_q4_o4', text: 'It is exclusively available for millionaires', isCorrect: false }
            ]
        },
        {
            id: 'a_budget_04',
            category: 'budgeting',
            questionKey: 'quiz_a_bg4',
            questionFallback: 'In Vridhi\'s educational framework, how are your four budget pillars structured?',
            options: [
                { key: 'quiz_a_bg4_o1', text: '100% into speculative day trading', isCorrect: false },
                { key: 'quiz_a_bg4_o2', text: 'Secure Savings, Emergency Shield, Home Essentials, and Wealth Generation', isCorrect: true },
                { key: 'quiz_a_bg4_o3', text: 'All money into buying lottery tickets and shopping', isCorrect: false },
                { key: 'quiz_a_bg4_o4', text: 'Zero savings and 100% consumer debt', isCorrect: false }
            ]
        },

        // --- Emergency Fund ---
        {
            id: 'a_emergency_01',
            category: 'emergency_fund',
            questionKey: 'quiz_a_q2',
            questionFallback: 'What is the primary function of an Emergency Shield in financial planning?',
            options: [
                { key: 'quiz_a_q2_o1', text: 'To finance speculative stock tips from unverified social media channels', isCorrect: false },
                { key: 'quiz_a_q2_o2', text: 'To provide a financial cushion for unexpected medical bills or job transitions', isCorrect: true },
                { key: 'quiz_a_q2_o3', text: 'To pay for international luxury holidays every quarter', isCorrect: false },
                { key: 'quiz_a_q2_o4', text: 'To replace health and term life insurance entirely', isCorrect: false }
            ]
        },
        {
            id: 'a_emergency_02',
            category: 'emergency_fund',
            questionKey: 'quiz_a_q3',
            questionFallback: 'If your essential monthly household expenses are ₹25,000, what is your recommended emergency fund?',
            options: [
                { key: 'quiz_a_q3_o1', text: '₹5,000 in cash', isCorrect: false },
                { key: 'quiz_a_q3_o2', text: '₹75,000 to ₹1,50,000 (3 to 6 months of essential expenses)', isCorrect: true },
                { key: 'quiz_a_q3_o3', text: '₹25,00,000 in locked real estate land', isCorrect: false },
                { key: 'quiz_a_q3_o4', text: 'Zero rupees, because credit cards can replace emergency savings', isCorrect: false }
            ]
        },
        {
            id: 'a_emergency_03',
            category: 'emergency_fund',
            questionKey: 'quiz_a_em3',
            questionFallback: 'Why is an equity mutual fund unsuitable as your ONLY emergency fund reserve?',
            options: [
                { key: 'quiz_a_em3_o1', text: 'Equity funds are illegal in India', isCorrect: false },
                { key: 'quiz_a_em3_o2', text: 'Market downturns could force you to sell shares at a loss during an urgent emergency', isCorrect: true },
                { key: 'quiz_a_em3_o3', text: 'Equity funds never pay dividends', isCorrect: false },
                { key: 'quiz_a_em3_o4', text: 'Banks charge a 90% fee on equity redemptions', isCorrect: false }
            ]
        },
        {
            id: 'a_emergency_04',
            category: 'emergency_fund',
            questionKey: 'quiz_a_em4',
            questionFallback: 'What should be your immediate priority after using money from your Emergency Fund?',
            options: [
                { key: 'quiz_a_em4_o1', text: 'Ignore it and increase luxury discretionary spending', isCorrect: false },
                { key: 'quiz_a_em4_o2', text: 'Replenish the emergency reserve through monthly allocations until full buffer is restored', isCorrect: true },
                { key: 'quiz_a_em4_o3', text: 'Close your bank savings accounts', isCorrect: false },
                { key: 'quiz_a_em4_o4', text: 'Take out a gold loan to gamble in stocks', isCorrect: false }
            ]
        },

        // --- Compounding & Long-term Growth ---
        {
            id: 'a_compound_01',
            category: 'compounding',
            questionKey: 'quiz_a_q6',
            questionFallback: 'Why does investing for 25 years generate exponentially more wealth than investing for just 5 years?',
            options: [
                { key: 'quiz_a_q6_o1', text: 'Because commercial banks pay a secret bonus only in the 25th year', isCorrect: false },
                { key: 'quiz_a_q6_o2', text: 'Because compounding yields exponential growth as accumulated returns generate their own returns', isCorrect: true },
                { key: 'quiz_a_q6_o3', text: 'Because tax rates drop to 0% after 5 years', isCorrect: false },
                { key: 'quiz_a_q6_o4', text: 'Because long-term investing has zero inflation impact', isCorrect: false }
            ]
        },
        {
            id: 'a_compound_02',
            category: 'compounding',
            questionKey: 'quiz_a_cmp2',
            questionFallback: 'What is the "Rule of 72" commonly used for in personal finance planning?',
            options: [
                { key: 'quiz_a_cmp2_o1', text: 'Determining the exact age a person must retire from work', isCorrect: false },
                { key: 'quiz_a_cmp2_o2', text: 'Estimating the number of years needed to double an investment at a given annual return rate', isCorrect: true },
                { key: 'quiz_a_cmp2_o3', text: 'Calculating the maximum number of credit cards a person can own', isCorrect: false },
                { key: 'quiz_a_cmp2_o4', text: 'Calculating income tax deductions under Section 80C', isCorrect: false }
            ]
        },
        {
            id: 'a_compound_03',
            category: 'compounding',
            questionKey: 'quiz_a_cmp3',
            questionFallback: 'In a Systematic Investment Plan (SIP), how does Rupee Cost Averaging work during a market dip?',
            options: [
                { key: 'quiz_a_cmp3_o1', text: 'It cancels your SIP to prevent buying any units', isCorrect: false },
                { key: 'quiz_a_cmp3_o2', text: 'Your fixed monthly investment automatically buys more mutual fund units at lower NAV prices', isCorrect: true },
                { key: 'quiz_a_cmp3_o3', text: 'It converts your equity mutual fund into physical gold bars', isCorrect: false },
                { key: 'quiz_a_cmp3_o4', text: 'It locks your money for 50 years', isCorrect: false }
            ]
        },

        // --- Diversification & Instruments ---
        {
            id: 'a_diversify_01',
            category: 'diversification',
            questionKey: 'quiz_a_q7',
            questionFallback: 'What is the primary benefit of investing in a broad Index Fund (like Nifty 50)?',
            options: [
                { key: 'quiz_a_q7_o1', text: 'Guaranteed 100% profit within 7 days with zero volatility', isCorrect: false },
                { key: 'quiz_a_q7_o2', text: 'Low-cost, broad diversification across top market companies without single-stock risk', isCorrect: true },
                { key: 'quiz_a_q7_o3', text: 'Exemption from paying any utility or electricity bills', isCorrect: false },
                { key: 'quiz_a_q7_o4', text: 'It eliminates the need for emergency fund reserves', isCorrect: false }
            ]
        },
        {
            id: 'a_diversify_02',
            category: 'diversification',
            questionKey: 'quiz_a_div2',
            questionFallback: 'Why do investors allocate 5% to 10% of their long-term portfolio to Sovereign Gold Bonds (SGB) or Gold?',
            options: [
                { key: 'quiz_a_div2_o1', text: 'Because gold is guaranteed to double every single quarter', isCorrect: false },
                { key: 'quiz_a_div2_o2', text: 'Gold acts as a classic hedge against inflation and currency depreciation during market crises', isCorrect: true },
                { key: 'quiz_a_div2_o3', text: 'Because gold carries zero tax in every circumstance', isCorrect: false },
                { key: 'quiz_a_div2_o4', text: 'To avoid having a bank account', isCorrect: false }
            ]
        },
        {
            id: 'a_diversify_03',
            category: 'diversification',
            questionKey: 'quiz_a_div3',
            questionFallback: 'Which instrument offers capital safety, government backing, and tax deductions under Section 80C?',
            options: [
                { key: 'quiz_a_div3_o1', text: 'High-risk penny stock day trading', isCorrect: false },
                { key: 'quiz_a_div3_o2', text: 'Public Provident Fund (PPF) and National Savings Certificate (NSC)', isCorrect: true },
                { key: 'quiz_a_div3_o3', text: 'Unregulated peer-to-peer crypto lending schemes', isCorrect: false },
                { key: 'quiz_a_div3_o4', text: 'Credit card reward points', isCorrect: false }
            ]
        },

        // --- Risk vs Return ---
        {
            id: 'a_risk_01',
            category: 'risk_return',
            questionKey: 'quiz_a_q8',
            questionFallback: 'For a long-term goal 10+ years away (like retirement), which asset class offers the best inflation-beating potential?',
            options: [
                { key: 'quiz_a_q8_o1', text: 'Cash currency notes kept inside a locker at home', isCorrect: false },
                { key: 'quiz_a_q8_o2', text: 'Diversified equity mutual funds / broad market equities', isCorrect: true },
                { key: 'quiz_a_q8_o3', text: '7-day short term bank fixed deposit', isCorrect: false },
                { key: 'quiz_a_q8_o4', text: 'Unregistered lottery tickets', isCorrect: false }
            ]
        },
        {
            id: 'a_risk_02',
            category: 'risk_return',
            questionKey: 'quiz_a_rsk2',
            questionFallback: 'If an investment scheme promises "Guaranteed 50% monthly profit with zero risk", what is it most likely?',
            options: [
                { key: 'quiz_a_rsk2_o1', text: 'A genuine high-quality government initiative', isCorrect: false },
                { key: 'quiz_a_rsk2_o2', text: 'A fraudulent scam or Ponzi scheme that carries extreme risk of total loss', isCorrect: true },
                { key: 'quiz_a_rsk2_o3', text: 'A standard bank fixed deposit product', isCorrect: false },
                { key: 'quiz_a_rsk2_o4', text: 'A standard mutual fund scheme regulated by SEBI', isCorrect: false }
            ]
        },
        {
            id: 'a_risk_03',
            category: 'risk_return',
            questionKey: 'quiz_a_rsk3',
            questionFallback: 'What is the role of time horizon when investing in equity markets?',
            options: [
                { key: 'quiz_a_rsk3_o1', text: 'Time horizon has no impact on equity volatility', isCorrect: false },
                { key: 'quiz_a_rsk3_o2', text: 'Longer investment horizons (7+ years) significantly reduce the probability of negative returns', isCorrect: true },
                { key: 'quiz_a_rsk3_o3', text: 'Long horizons always cause loss of principal', isCorrect: false },
                { key: 'quiz_a_rsk3_o4', text: 'Short-term trading is safer than long-term compounding', isCorrect: false }
            ]
        },

        // --- Debt Management ---
        {
            id: 'a_debt_01',
            category: 'debt',
            questionKey: 'quiz_a_q9',
            questionFallback: 'When managing multiple debts, what is the most cost-effective mathematical strategy (Debt Avalanche)?',
            options: [
                { key: 'quiz_a_q9_o1', text: 'Taking more high-interest loans to gamble in the stock market', isCorrect: false },
                { key: 'quiz_a_q9_o2', text: 'Prioritizing repayment of debts with the highest interest rates first to minimize interest drag', isCorrect: true },
                { key: 'quiz_a_q9_o3', text: 'Ignoring all loan repayments and increasing discretionary shopping', isCorrect: false },
                { key: 'quiz_a_q9_o4', text: 'Closing all bank accounts and fleeing', isCorrect: false }
            ]
        },
        {
            id: 'a_debt_02',
            category: 'debt',
            questionKey: 'quiz_a_dbt2',
            questionFallback: 'Why is maintaining a high credit bureau score (CIBIL 750+) valuable in India?',
            options: [
                { key: 'quiz_a_dbt2_o1', text: 'It guarantees free groceries from local merchants', isCorrect: false },
                { key: 'quiz_a_dbt2_o2', text: 'It qualifies you for faster loan approvals and significantly lower interest rates on home/business loans', isCorrect: true },
                { key: 'quiz_a_dbt2_o3', text: 'It makes paying income tax illegal', isCorrect: false },
                { key: 'quiz_a_dbt2_o4', text: 'It automatically pays your monthly credit card bills', isCorrect: false }
            ]
        },

        // --- Holistic Financial Literacy ---
        {
            id: 'a_framework_01',
            category: 'framework',
            questionKey: 'quiz_a_q10',
            questionFallback: 'Why is balancing essential expenses, emergency protection, and compounding wealth creation so powerful?',
            options: [
                { key: 'quiz_a_q10_o1', text: 'It fulfills present needs, shields against sudden shocks, and builds generational independence', isCorrect: true },
                { key: 'quiz_a_q10_o2', text: 'It guarantees that prices will never increase in the economy', isCorrect: false },
                { key: 'quiz_a_q10_o3', text: 'It removes the need for ever working or budgeting again', isCorrect: false },
                { key: 'quiz_a_q10_o4', text: 'It prohibits spending any money on nutritious food', isCorrect: false }
            ]
        },
        {
            id: 'a_framework_02',
            category: 'framework',
            questionKey: 'quiz_a_q5',
            questionFallback: 'In Vridhi\'s Smart Goal Planner, what happens when you increase your monthly allocation towards a goal?',
            options: [
                { key: 'quiz_a_q5_o1', text: 'You reach your target milestone earlier and reduce the monthly savings shortfall', isCorrect: true },
                { key: 'quiz_a_q5_o2', text: 'Your goal deadline automatically extends by 10 years', isCorrect: false },
                { key: 'quiz_a_q5_o3', text: 'Your target amount doubles automatically', isCorrect: false },
                { key: 'quiz_a_q5_o4', text: 'The goal is automatically deleted from your profile', isCorrect: false }
            ]
        }
    ]
};

// ============================================================================
// 2. QUIZ STATE & HELPER FUNCTIONS
// ============================================================================
// Quiz State
let quizState = {
    authenticated: false,
    beforeQuiz: null,
    afterQuiz: null,
    improvementPoints: null,
    historyData: null,
    activeMode: null, // 'before' | 'after' | null
    currentQuestionIndex: 0,
    answers: {}, // { questionIndex: selectedOptionIndex }
    activeQuestions: [], // Shuffled 10 questions with shuffled options for this attempt
    comparisonChart: null,
    historyProgressChart: null
};
window.quizState = quizState;

// Fisher-Yates Array Shuffle (pure and non-mutating)
function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a randomized attempt: Pick 10 random questions from bank, shuffle their options
function generateQuizQuestions(mode) {
    const bank = QUIZ_QUESTION_BANKS[mode] || [];
    // 1. Shuffle question pool
    const shuffledBank = shuffleArray(bank);
    // 2. Pick 10 unique questions
    const selected = shuffledBank.slice(0, 10);
    // 3. Shuffle options for each selected question using Fisher-Yates
    return selected.map(q => ({
        id: q.id,
        category: q.category,
        questionKey: q.questionKey,
        questionFallback: q.questionFallback,
        options: shuffleArray(q.options.map(opt => ({ ...opt })))
    }));
}

// Helper: Translation accessor (safely calls i18n window.t without global shadowing)
function getQuizText(key, fallback = '') {
    if (typeof window.t === 'function' && window.t !== getQuizText) {
        const val = window.t(key);
        if (val && val !== key) return val;
    }
    return fallback || key;
}

// Helper: Format ISO date string
function formatAttemptDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

// Helper: Score level badge & label
function getScoreLevelInfo(percentage) {
    const p = parseFloat(percentage) || 0;
    if (p >= 80) {
        return {
            labelKey: 'score_level_strong',
            defaultLabel: 'Strong Understanding',
            badgeClass: 'badge-strong'
        };
    } else if (p >= 60) {
        return {
            labelKey: 'score_level_good',
            defaultLabel: 'Good Understanding',
            badgeClass: 'badge-good'
        };
    } else if (p >= 40) {
        return {
            labelKey: 'score_level_basic',
            defaultLabel: 'Basic Understanding',
            badgeClass: 'badge-basic'
        };
    } else {
        return {
            labelKey: 'score_level_getting_started',
            defaultLabel: 'Getting Started',
            badgeClass: 'badge-started'
        };
    }
}

// ============================================================================
// 3. QUIZ ACTIONS: START, RETAKE, RESET, NAVIGATE, SUBMIT
// ============================================================================

// Start / Retake a specific Quiz (Before or After)
window.startQuiz = function(mode = 'before') {
    quizState.activeMode = mode;
    quizState.currentQuestionIndex = 0;
    quizState.answers = {};
    quizState.activeQuestions = generateQuizQuestions(mode);
    window.renderQuizUI();
    const container = document.getElementById('quiz-section-container');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Retake alias
window.retakeQuiz = function(mode = 'before') {
    window.startQuiz(mode);
};

// Reset All & Start Fresh: resets the current quiz session and launches Question 1 of Before Quiz (preserves DB history)
window.resetAllQuiz = function() {
    quizState.beforeQuiz = null;
    quizState.afterQuiz = null;
    quizState.improvementPoints = null;
    window.startQuiz('before');
};

// Select Option
window.selectQuizOption = function(optionIndex) {
    const currentIndex = quizState.currentQuestionIndex;
    quizState.answers[currentIndex] = optionIndex;
    window.renderQuizUI();
};

// Next Question
window.nextQuizQuestion = function() {
    const currentIndex = quizState.currentQuestionIndex;
    if (quizState.answers[currentIndex] === undefined) {
        showQuizError(getQuizText('please_select_answer', 'Please select an answer to continue.'));
        return;
    }
    hideQuizError();
    quizState.currentQuestionIndex++;
    window.renderQuizUI();
};

// Previous Question
window.prevQuizQuestion = function() {
    if (quizState.currentQuestionIndex > 0) {
        hideQuizError();
        quizState.currentQuestionIndex--;
        window.renderQuizUI();
    }
};

function showQuizError(msg) {
    const el = document.getElementById('quiz-error-msg');
    if (el && el.style) {
        el.textContent = msg;
        el.style.display = 'block';
    }
}

function hideQuizError() {
    const el = document.getElementById('quiz-error-msg');
    if (el && el.style) {
        el.style.display = 'none';
    }
}

// Submit Quiz
window.submitQuiz = async function() {
    const mode = quizState.activeMode;
    const questions = quizState.activeQuestions || [];
    const total = questions.length || 10;

    // Check all questions answered
    for (let i = 0; i < total; i++) {
        if (quizState.answers[i] === undefined) {
            quizState.currentQuestionIndex = i;
            window.renderQuizUI();
            showQuizError(getQuizText('please_answer_all', `Please answer Question ${i + 1} before submitting.`));
            return;
        }
    }

    // Calculate score using isCorrect on each shuffled option
    let score = 0;
    questions.forEach((q, idx) => {
        const selectedOptIdx = quizState.answers[idx];
        if (selectedOptIdx !== undefined && q.options[selectedOptIdx] && q.options[selectedOptIdx].isCorrect) {
            score++;
        }
    });

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = getQuizText('submitting', 'Submitting...');
    }

    try {
        const payload = {
            survey_type: mode,
            quiz_score: score,
            quiz_total: total
        };

        const res = await fetch('/api/survey/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            quizState.activeMode = null;
            quizState.activeQuestions = [];
            quizState.answers = {};
            await window.initQuiz();
            document.getElementById('quiz-section-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            alert(result.error || 'Failed to submit quiz. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '✓ ' + getQuizText('submit_quiz', 'Submit Quiz');
            }
        }
    } catch (err) {
        console.error("Submission error:", err);
        alert('Network error while submitting quiz. Please try again.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '✓ ' + getQuizText('submit_quiz', 'Submit Quiz');
        }
    }
};

// ============================================================================
// 4. MAIN UI RENDERER & CARDS
// ============================================================================

window.renderQuizUI = function() {
    const container = document.getElementById('quiz-section-container');
    if (!container) return;

    // 1. Active Quiz Taking Mode (Question 1 to 10)
    if (quizState.activeMode) {
        renderActiveQuiz(container);
        return;
    }

    // 2. Build Card State
    let cardHTML = '';
    if (quizState.beforeQuiz && quizState.afterQuiz) {
        cardHTML = getComparisonCardHTML();
    } else if (quizState.beforeQuiz && !quizState.afterQuiz) {
        cardHTML = getBeforeCompletedCardHTML();
    } else {
        cardHTML = getInitialCardHTML();
    }

    // 3. Build Historical Attempts Component
    const historyHTML = getHistorySectionHTML();

    // 4. Inject into container
    container.innerHTML = cardHTML + historyHTML;

    // 5. Trigger Chart.js visualizations
    if (quizState.beforeQuiz && quizState.afterQuiz) {
        const bPct = Math.round(parseFloat(quizState.beforeQuiz.score_percentage) || 0);
        const aPct = Math.round(parseFloat(quizState.afterQuiz.score_percentage) || 0);
        setTimeout(() => {
            renderQuizChart(bPct, aPct);
        }, 50);
    }

    if (quizState.historyData && quizState.historyData.attempts && quizState.historyData.attempts.length > 0) {
        setTimeout(() => {
            renderQuizHistoryChart();
        }, 60);
    }
};

// Initial State (Before Quiz card)
function getInitialCardHTML() {
    return `
        <div class="quiz-card welcome-card">
            <div class="quiz-card-header">
                <div class="quiz-badge">📝 ${getQuizText('quiz_badge_before', 'Phase 1: Initial Assessment')}</div>
                <h3>${getQuizText('quiz_before_title', 'Financial Literacy — Before Quiz')}</h3>
                <p class="quiz-subtitle">${getQuizText('quiz_before_desc', 'This quiz helps us understand your current financial awareness. Your answers will be used to compare your understanding before and after using Vridhi.')}</p>
            </div>
            <div class="quiz-info-grid">
                <div class="quiz-info-item">
                    <span class="info-icon">⏱️</span>
                    <strong>10 Questions</strong>
                    <small>Multiple Choice (Randomized)</small>
                </div>
                <div class="quiz-info-item">
                    <span class="info-icon">📊</span>
                    <strong>Baseline Score</strong>
                    <small>Initial Awareness</small>
                </div>
                <div class="quiz-info-item">
                    <span class="info-icon">🌱</span>
                    <strong>No Negative Marking</strong>
                    <small>For Educational Learning</small>
                </div>
            </div>
            <div class="quiz-action-bar">
                <button id="start-before-quiz-btn" class="quiz-btn primary-btn btn-start-before-quiz" data-quiz-start="before" onclick="window.startQuiz('before')">
                    📝 ${getQuizText('take_before_quiz_btn', 'Take Before Quiz')}
                </button>
            </div>
        </div>
    `;
}

// Active Question Renderer
function renderActiveQuiz(container) {
    const mode = quizState.activeMode;
    const questions = quizState.activeQuestions || [];
    const total = questions.length || 10;
    const currentIndex = quizState.currentQuestionIndex;
    const q = questions[currentIndex];

    if (!q) return;

    const progressPct = Math.round(((currentIndex + 1) / total) * 100);
    const selectedOption = quizState.answers[currentIndex];
    const isLast = currentIndex === total - 1;

    const modeTitle = mode === 'before' 
        ? getQuizText('quiz_before_title', 'Financial Literacy — Before Quiz')
        : getQuizText('quiz_after_title', 'Financial Literacy — After Quiz');

    let optionsHTML = '';
    q.options.forEach((opt, idx) => {
        const isChecked = selectedOption === idx;
        const optText = getQuizText(opt.key, opt.text);
        optionsHTML += `
            <label class="quiz-option-label ${isChecked ? 'selected' : ''}" data-option-idx="${idx}" onclick="window.selectQuizOption(${idx})">
                <input type="radio" name="quiz_opt" value="${idx}" ${isChecked ? 'checked' : ''} style="display:none;">
                <span class="quiz-radio-indicator">${isChecked ? '●' : '○'}</span>
                <span class="quiz-option-text">${optText}</span>
            </label>
        `;
    });

    const questionTitle = getQuizText(q.questionKey, q.questionFallback);

    container.innerHTML = `
        <div class="quiz-card active-quiz-card">
            <div class="active-quiz-header">
                <div class="quiz-title-row">
                    <span class="quiz-badge">${mode === 'before' ? 'Before Quiz' : 'After Quiz'}</span>
                    <h4>${modeTitle}</h4>
                </div>
                <div class="quiz-progress-text">
                    ${getQuizText('question', 'Question')} <strong>${currentIndex + 1}</strong> ${getQuizText('of', 'of')} ${total}
                </div>
            </div>

            <div class="quiz-progress-track">
                <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
            </div>

            <div class="quiz-question-container">
                <h3 class="quiz-question-title">${questionTitle}</h3>
                <div class="quiz-options-list">
                    ${optionsHTML}
                </div>
            </div>

            <div id="quiz-error-msg" class="quiz-validation-error" style="display:none;"></div>

            <div class="quiz-nav-row">
                <button class="quiz-btn outline-btn" onclick="window.prevQuizQuestion()" ${currentIndex === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                    ← ${getQuizText('previous', 'Previous')}
                </button>
                
                ${isLast 
                    ? `<button class="quiz-btn primary-btn submit-btn" onclick="window.submitQuiz()">
                         ✓ ${getQuizText('submit_quiz', 'Submit Quiz')}
                       </button>`
                    : `<button class="quiz-btn primary-btn" onclick="window.nextQuizQuestion()">
                         ${getQuizText('next', 'Next')} →
                       </button>`
                }
            </div>
        </div>
    `;
}

// Before Quiz Completed State Card
function getBeforeCompletedCardHTML() {
    const b = quizState.beforeQuiz;
    const score = b.quiz_score !== null ? b.quiz_score : 0;
    const total = b.quiz_total || 10;
    const pct = b.score_percentage !== null ? Math.round(b.score_percentage) : Math.round((score / total) * 100);
    const level = getScoreLevelInfo(pct);

    return `
        <div class="quiz-card result-summary-card">
            <div class="quiz-card-header">
                <div class="quiz-badge">✅ ${getQuizText('before_quiz_completed', 'Before Quiz Completed')}</div>
                <h3>${getQuizText('before_quiz_score_title', 'Your Initial Financial Awareness Score')}</h3>
                <p class="quiz-subtitle">${getQuizText('before_quiz_completed_desc', 'You have completed the initial assessment. Explore Vridhi\'s educational courses, simulator, and tools below to deepen your knowledge. When ready, take the After Quiz to measure your progress!')}</p>
            </div>
            
            <div class="quiz-score-overview">
                <div class="score-pill-card">
                    <span class="score-label">${getQuizText('before_score', 'Before Quiz Score')}</span>
                    <div class="score-value">${score} <span class="score-total">/ ${total}</span></div>
                    <div class="score-percentage-tag">${pct}%</div>
                    <div class="score-level-badge ${level.badgeClass}">${getQuizText(level.labelKey, level.defaultLabel)}</div>
                </div>
                <div class="learning-step-card">
                    <h4>🎯 ${getQuizText('next_steps_title', 'Next Steps in Your Learning Journey')}</h4>
                    <ol class="steps-list">
                        <li><strong>1. ${getQuizText('step_1_title', 'Watch Crash Courses')}</strong>: Learn budgeting, mutual funds, and emergency planning in the video modules below.</li>
                        <li><strong>2. ${getQuizText('step_2_title', 'Experiment with Tools')}</strong>: Try the What-If Simulator and Smart Goal Planner in your dashboard.</li>
                        <li><strong>3. ${getQuizText('step_3_title', 'Take the After Quiz')}</strong>: Measure your growth and see your Before vs After score comparison.</li>
                    </ol>
                </div>
            </div>

            <div class="quiz-action-bar" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                <button id="start-after-quiz-btn" class="quiz-btn primary-btn btn-start-after-quiz" data-quiz-start="after" onclick="window.startQuiz('after')">
                    🚀 ${getQuizText('take_after_quiz_btn', 'Take After Quiz Now')}
                </button>
                <button id="retake-before-quiz-single-btn" class="quiz-btn outline-btn" onclick="window.retakeQuiz('before')">
                    🔄 ${getQuizText('retake_before_quiz_btn', 'Retake Before Quiz')}
                </button>
                <a href="#video-courses" class="quiz-btn secondary-btn" onclick="document.querySelector('.video-grid')?.scrollIntoView({behavior:'smooth'});">
                    📚 ${getQuizText('explore_courses_btn', 'Explore Video Crash Courses')}
                </a>
            </div>
        </div>
    `;
}

// Comparison Results Card (Both Before & After completed)
function getComparisonCardHTML() {
    const b = quizState.beforeQuiz;
    const a = quizState.afterQuiz;
    const bPct = Math.round(parseFloat(b.score_percentage) || 0);
    const aPct = Math.round(parseFloat(a.score_percentage) || 0);
    const diff = aPct - bPct;
    const bLevel = getScoreLevelInfo(bPct);
    const aLevel = getScoreLevelInfo(aPct);

    let diffText = '';
    let diffClass = '';
    if (diff > 0) {
        diffText = `+${diff} percentage points`;
        diffClass = 'diff-positive';
    } else if (diff < 0) {
        diffText = `${diff} percentage points`;
        diffClass = 'diff-negative';
    } else {
        diffText = `0 percentage points (Maintained)`;
        diffClass = 'diff-neutral';
    }

    return `
        <div class="quiz-card comparison-card">
            <div class="quiz-card-header">
                <div class="quiz-badge">🌟 ${getQuizText('learning_journey_badge', 'Financial Learning Journey')}</div>
                <h3>${getQuizText('learning_journey_title', 'Your Financial Learning Progress')}</h3>
                <p class="quiz-subtitle">${getQuizText('learning_journey_subtitle', 'Here is how your financial awareness improved from your initial assessment to your post-learning quiz with Vridhi.')}</p>
            </div>

            <!-- Score Cards Grid -->
            <div class="comparison-stats-grid">
                <div class="comp-stat-box before-box">
                    <span class="comp-box-tag">${getQuizText('before_quiz', 'Before Quiz')}</span>
                    <div class="comp-score-number">${bPct}%</div>
                    <div class="comp-score-sub">${b.quiz_score}/${b.quiz_total} ${getQuizText('correct_answers', 'Correct')}</div>
                    <div class="score-level-badge ${bLevel.badgeClass}">${getQuizText(bLevel.labelKey, bLevel.defaultLabel)}</div>
                </div>

                <div class="comp-stat-box improvement-box">
                    <span class="comp-box-tag">${getQuizText('score_improvement', 'Learning Improvement')}</span>
                    <div class="comp-diff-number ${diffClass}">${diffText}</div>
                    <p class="comp-diff-note">${getQuizText('improvement_note', 'Difference in score between Before and After quizzes.')}</p>
                </div>

                <div class="comp-stat-box after-box">
                    <span class="comp-box-tag">${getQuizText('after_quiz', 'After Quiz')}</span>
                    <div class="comp-score-number">${aPct}%</div>
                    <div class="comp-score-sub">${a.quiz_score}/${a.quiz_total} ${getQuizText('correct_answers', 'Correct')}</div>
                    <div class="score-level-badge ${aLevel.badgeClass}">${getQuizText(aLevel.labelKey, aLevel.defaultLabel)}</div>
                </div>
            </div>

            <!-- Chart.js Visualization -->
            <div class="quiz-chart-container">
                <h4 style="margin-bottom: 12px; color: var(--secondary); font-size: 1rem;">📊 ${getQuizText('score_comparison_chart', 'Before vs After Score Comparison')}</h4>
                <div style="height: 240px; position: relative;">
                    <canvas id="quizComparisonChart"></canvas>
                </div>
            </div>

            <!-- Educational Narrative & Community Impact Note -->
            <div class="quiz-summary-narrative">
                <p>
                    ${diff > 0 
                        ? `🎉 <strong>${getQuizText('congratulations', 'Congratulations!')}</strong> Your quiz score increased by <strong>${diff} percentage points</strong>. You demonstrated stronger understanding across key financial concepts including budgeting, compounding, emergency funds, and investment diversification.`
                        : `💡 <strong>${getQuizText('great_effort', 'Great effort!')}</strong> You have established consistent financial literacy principles. Continue exploring Vridhi's financial tools to maintain your discipline.`
                    }
                </p>
                <div class="community-impact-callout">
                    <span>👥 ${getQuizText('community_impact_contributed', 'Your completed assessments contribute anonymously to Vridhi\'s Community Engagement Project impact research.')}</span>
                    <a href="/index.html#community" class="quiz-btn outline-btn" style="margin-top: 8px;">
                        🌐 ${getQuizText('view_community_impact_btn', 'View Community Impact Dashboard')} &rarr;
                    </a>
                </div>
            </div>

            <!-- Retake & Reset Actions (Requirement 1 & 9) -->
            <div class="quiz-retake-actions" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; justify-content: center;">
                <button id="retake-before-quiz-btn" class="quiz-btn outline-btn" onclick="window.retakeQuiz('before')">
                    🔄 ${getQuizText('retake_before_quiz_btn', 'Retake Before Quiz')}
                </button>
                <button id="retake-after-quiz-btn" class="quiz-btn primary-btn" onclick="window.retakeQuiz('after')">
                    🔄 ${getQuizText('retake_after_quiz_btn', 'Retake After Quiz')}
                </button>
                <button id="reset-all-quiz-btn" class="quiz-btn secondary-btn" onclick="window.resetAllQuiz()">
                    ↺ ${getQuizText('reset_all_quiz_btn', 'Reset All & Start Fresh')}
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// 5. ATTEMPT HISTORY & PROGRESS COMPONENT
// ============================================================================

function getHistorySectionHTML() {
    const h = quizState.historyData;
    const hasAttempts = h && h.attempts && h.attempts.length > 0;

    if (!hasAttempts) {
        return `
            <div class="quiz-history-card">
                <div class="history-empty-state">
                    <p style="font-size:1.05rem;color:var(--secondary);font-weight:700;margin:0 0 6px 0;">📊 ${getQuizText('quiz_history_title', 'Quiz Attempt History & Learning Progress')}</p>
                    <p style="margin:0;">${getQuizText('quiz_history_empty', 'Complete your first Before and After Quiz to start tracking your financial-literacy progress.')}</p>
                </div>
            </div>
        `;
    }

    const summary = h.summary || {};
    const totalPairs = summary.totalPairs || h.attempts.length;
    const latestBeforeStr = summary.latestBeforeScore !== null ? `${summary.latestBeforeScore}%` : '—';
    const latestAfterStr = summary.latestAfterScore !== null ? `${summary.latestAfterScore}%` : '—';
    
    let latestImpStr = getQuizText('not_available', 'Not available');
    if (summary.latestImprovementPoints !== null) {
        const sign = summary.latestImprovementPoints > 0 ? '+' : '';
        latestImpStr = `${sign}${summary.latestImprovementPoints} ${getQuizText('pts_label', 'percentage points')}`;
    }

    // Table Rows HTML
    let rowsHTML = '';
    h.attempts.forEach((item) => {
        const attemptNum = item.attemptNumber;
        const b = item.before;
        const a = item.after;
        const dateStr = formatAttemptDate(b?.createdAt || a?.createdAt);

        const beforeCell = b ? `${b.percentage}% (${b.score}/${b.total})` : '—';
        const afterCell = a ? `${a.percentage}% (${a.score}/${a.total})` : `<span style="color:#64748b;font-style:italic;">${getQuizText('pending_after', 'Pending After Quiz')}</span>`;

        let impCell = `<span style="color:#64748b;font-style:italic;">${getQuizText('not_available', 'Not available')}</span>`;
        if (item.improvementPoints !== null) {
            const diff = item.improvementPoints;
            if (diff > 0) {
                impCell = `<strong class="diff-positive">+${diff} ${getQuizText('pts_label', 'percentage points')}</strong>`;
            } else if (diff < 0) {
                impCell = `<strong class="diff-negative">${diff} ${getQuizText('pts_label', 'percentage points')}</strong>`;
            } else {
                impCell = `<strong class="diff-neutral">0 ${getQuizText('pts_label', 'percentage points')} (Maintained)</strong>`;
            }
        }

        rowsHTML += `
            <tr>
                <td><strong>Attempt ${attemptNum}</strong></td>
                <td>${dateStr}</td>
                <td>${beforeCell}</td>
                <td>${afterCell}</td>
                <td>${impCell}</td>
            </tr>
        `;
    });

    return `
        <div class="quiz-history-card">
            <div class="quiz-card-header">
                <div class="quiz-badge" style="background:rgba(10,35,66,0.08);color:var(--secondary);border-color:rgba(10,35,66,0.2);">📈 Historical Tracking</div>
                <h3>${getQuizText('quiz_history_title', 'Quiz Attempt History & Learning Progress')}</h3>
                <p class="quiz-subtitle">${getQuizText('quiz_history_subtitle', 'Track how your financial literacy understanding has evolved across each learning attempt.')}</p>
            </div>

            <!-- Summary Metrics Cards -->
            <div class="history-summary-grid">
                <div class="history-summary-box">
                    <span class="label">${getQuizText('total_attempts', 'Total Attempts')}</span>
                    <span class="val">${totalPairs}</span>
                </div>
                <div class="history-summary-box">
                    <span class="label">${getQuizText('latest_before_score', 'Latest Before Score')}</span>
                    <span class="val" style="color:var(--secondary);">${latestBeforeStr}</span>
                </div>
                <div class="history-summary-box">
                    <span class="label">${getQuizText('latest_after_score', 'Latest After Score')}</span>
                    <span class="val" style="color:#50C878;">${latestAfterStr}</span>
                </div>
                <div class="history-summary-box">
                    <span class="label">${getQuizText('latest_improvement', 'Latest Improvement')}</span>
                    <span class="val" style="font-size:1.15rem;color:${summary.latestImprovementPoints > 0 ? '#16a34a' : (summary.latestImprovementPoints < 0 ? '#dc2626' : 'var(--secondary)')};">${latestImpStr}</span>
                </div>
            </div>

            <!-- Responsive Attempts Table -->
            <div class="history-table-responsive">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>${getQuizText('attempt_col', 'Attempt')}</th>
                            <th>${getQuizText('date_col', 'Date')}</th>
                            <th>${getQuizText('before_quiz', 'Before Quiz')}</th>
                            <th>${getQuizText('after_quiz', 'After Quiz')}</th>
                            <th>${getQuizText('improvement_pts_col', 'Percentage-Point Improvement')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>

            <!-- Progress Visualization Chart (Line Chart) -->
            <div class="quiz-chart-container">
                <h4 style="margin-bottom: 12px; color: var(--secondary); font-size: 1rem;">${getQuizText('score_trend_chart', '📈 Multi-Attempt Score Trend')}</h4>
                <div style="height: 240px; position: relative;">
                    <canvas id="quizProgressHistoryChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

// Render Comparison Bar Chart
function renderQuizChart(beforePct, afterPct) {
    const ctx = document.getElementById('quizComparisonChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (quizState.comparisonChart) {
        quizState.comparisonChart.destroy();
    }

    const beforeLabel = getQuizText('before_quiz', 'Before Quiz');
    const afterLabel = getQuizText('after_quiz', 'After Quiz');
    const scoreLabel = getQuizText('score_percentage', 'Score (%)');

    quizState.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [beforeLabel, afterLabel],
            datasets: [{
                label: scoreLabel,
                data: [beforePct, afterPct],
                backgroundColor: [
                    'rgba(10, 35, 66, 0.75)',   // Secondary Navy
                    'rgba(80, 200, 120, 0.85)'  // Primary Emerald
                ],
                borderColor: [
                    '#0A2342',
                    '#50C878'
                ],
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(val) { return val + '%'; },
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Render Progress History Line Chart
function renderQuizHistoryChart() {
    const ctx = document.getElementById('quizProgressHistoryChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (quizState.historyProgressChart) {
        quizState.historyProgressChart.destroy();
    }

    const attempts = quizState.historyData?.attempts || [];
    if (attempts.length === 0) return;

    const labels = attempts.map(a => `Attempt ${a.attemptNumber}`);
    const beforeData = attempts.map(a => a.before ? a.before.percentage : null);
    const afterData = attempts.map(a => a.after ? a.after.percentage : null);

    const beforeLabel = getQuizText('before_quiz', 'Before Quiz');
    const afterLabel = getQuizText('after_quiz', 'After Quiz');

    quizState.historyProgressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: beforeLabel,
                    data: beforeData,
                    borderColor: '#0A2342',
                    backgroundColor: 'rgba(10, 35, 66, 0.1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#0A2342',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.25,
                    spanGaps: true
                },
                {
                    label: afterLabel,
                    data: afterData,
                    borderColor: '#50C878',
                    backgroundColor: 'rgba(80, 200, 120, 0.15)',
                    borderWidth: 3,
                    pointBackgroundColor: '#50C878',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.25,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 14,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y !== null ? context.parsed.y + '%' : 'Pending'}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(val) { return val + '%'; },
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.03)'
                    }
                }
            }
        }
    });
}

// Initialize Quiz (fetches latest status AND history)
window.initQuiz = async function() {
    const container = document.getElementById('quiz-section-container');
    if (!container) return;

    try {
        const res = await fetch('/api/survey/status', { credentials: 'same-origin' });
        const data = await res.json();

        if (data.success && data.data) {
            quizState.authenticated = data.data.authenticated;
            quizState.beforeQuiz = data.data.beforeQuiz;
            quizState.afterQuiz = data.data.afterQuiz;
            quizState.improvementPoints = data.data.improvementPoints;
        }

        if (quizState.authenticated) {
            try {
                const histRes = await fetch('/api/survey/history', { credentials: 'same-origin' });
                const histData = await histRes.json();
                if (histData.success && histData.data) {
                    quizState.historyData = histData.data;
                }
            } catch (err) {
                console.error("Error fetching quiz history:", err);
            }
        }
    } catch (err) {
        console.error("Error fetching quiz status:", err);
    }

    // Only render default if user is not in the middle of active quiz
    if (!quizState.activeMode) {
        window.renderQuizUI();
    }
};

// Event Delegation to guarantee all button clicks work regardless of rendering timing
document.addEventListener('click', (e) => {
    // 1. Take Before Quiz button
    const beforeBtn = e.target.closest('#start-before-quiz-btn, .btn-start-before-quiz, [data-quiz-start="before"]');
    if (beforeBtn) {
        e.preventDefault();
        window.startQuiz('before');
        return;
    }

    // 2. Take After Quiz button
    const afterBtn = e.target.closest('#start-after-quiz-btn, .btn-start-after-quiz, [data-quiz-start="after"]');
    if (afterBtn) {
        e.preventDefault();
        window.startQuiz('after');
        return;
    }

    // 3. Retake Before Quiz button
    const retakeBeforeBtn = e.target.closest('#retake-before-quiz-btn, #retake-before-quiz-single-btn');
    if (retakeBeforeBtn) {
        e.preventDefault();
        window.retakeQuiz('before');
        return;
    }

    // 4. Retake After Quiz button
    const retakeAfterBtn = e.target.closest('#retake-after-quiz-btn');
    if (retakeAfterBtn) {
        e.preventDefault();
        window.retakeQuiz('after');
        return;
    }

    // 5. Reset All & Start Fresh button
    const resetAllBtn = e.target.closest('#reset-all-quiz-btn');
    if (resetAllBtn) {
        e.preventDefault();
        window.resetAllQuiz();
        return;
    }

    // 6. Option Selection
    const optLabel = e.target.closest('.quiz-option-label');
    if (optLabel && optLabel.hasAttribute('data-option-idx')) {
        const idx = parseInt(optLabel.getAttribute('data-option-idx'), 10);
        if (!isNaN(idx)) {
            window.selectQuizOption(idx);
        }
    }
});

// Auto-run on DOM ready or immediate if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.initQuiz();
    });
} else {
    window.initQuiz();
}
