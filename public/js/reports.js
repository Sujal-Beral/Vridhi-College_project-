/**
 * public/js/reports.js
 * Comprehensive Research & Reports module for Vridhi Learn.
 * Provides authentic, educational financial research briefs and regulatory insights.
 */

const REPORTS_DATA = [
  {
    id: "power-of-compounding-india",
    title: "The Power of Compounding & Systematic Investing in India",
    category: "Investing",
    categoryKey: "filter_investing",
    source: "NISM / AMFI / Vridhi Research Brief",
    officialSource: "Association of Mutual Funds in India (AMFI)",
    year: "2025–2026",
    readTime: "4 min read",
    sourceUrl: "https://www.amfiindia.com/investor-corner/knowledge-center/power-of-compounding.html",
    description: "How rupee-cost averaging and early long-term SIP allocations turn modest monthly savings into sustainable long-term wealth across Indian market cycles.",
    takeaways: [
      "Compounding works exponentially over time: returns in year 20 are substantially larger than returns in year 5.",
      "Rupee-Cost Averaging through SIPs buys more mutual fund units when markets dip and fewer when markets peak.",
      "Starting at age 25 vs 35 can result in more than double the wealth at age 60 for the exact same total invested amount.",
      "The 'Rule of 72' provides a quick estimation of how many years it takes to double your money (72 ÷ Expected Annual Return %)."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Albert Einstein famously called compound interest the "eighth wonder of the world." In personal finance, compounding is the process where earnings on an investment generate additional earnings over time. For Indian retail investors, disciplined systematic investing (SIP) in diversified equity index funds and mutual funds has emerged as one of the most accessible avenues for wealth creation.</p>

      <h3>Why It Matters for Indian Households</h3>
      <p>Historically, Indian household wealth was predominantly concentrated in physical assets like real estate and physical gold, or low-yield bank fixed deposits. While traditional savings offer stability, compounding in inflation-beating asset classes is necessary to preserve long-term purchasing power against healthcare inflation, education costs, and lifestyle goals.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The Mathematics of Compounding</h4>
      <p>Unlike simple interest (which grows linearly), compound interest grows exponentially according to the formula:</p>
      <p style="background: #f8fafc; padding: 12px; border-left: 4px solid var(--primary); font-family: monospace; border-radius: 4px;">
        A = P × (1 + r/n)^(nt)
      </p>
      <p>In simple terms, in the first 5 years, growth feels slow because you are primarily accumulating principal. Between years 10 to 25, the accumulated interest dwarfs the principal invested.</p>

      <h4>2. The Cost of Delaying: A Real Scenario</h4>
      <p>Consider two individuals investing ₹5,000 per month at an assumed long-term CAGR of 12%:</p>
      <ul>
        <li><strong>Investor A (Starts at 25):</strong> Invests ₹5,000/mo for 35 years (Total Invested: ₹21 Lakhs). Value at age 60: <strong>~₹3.24 Crores</strong>.</li>
        <li><strong>Investor B (Starts at 35):</strong> Invests ₹5,000/mo for 25 years (Total Invested: ₹15 Lakhs). Value at age 60: <strong>~₹94.8 Lakhs</strong>.</li>
      </ul>
      <p>A delay of 10 years results in a <strong>₹2.29 Crore difference</strong>, even though Investor B only saved ₹6 Lakhs less in out-of-pocket contributions.</p>

      <h4>3. Rupee-Cost Averaging & Market Volatility</h4>
      <p>Market corrections are natural and expected. Systematic Investment Plans (SIPs) automatically exploit volatility: when markets decline, the fixed monthly SIP buys more units at lower NAVs, which enhances total returns when the cycle rebounds.</p>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li><strong>Automate Your SIPs:</strong> Schedule mutual fund SIP debits within 2-3 days of your monthly salary credit date ("Pay Yourself First").</li>
        <li><strong>Step-Up Annually:</strong> Increase your SIP amount by 10% each year as your income grows to dramatically accelerate goal achievement.</li>
        <li><strong>Stay Invested During Volatility:</strong> Avoid pausing SIPs during market downturns, as downturns offer the lowest acquisition costs.</li>
      </ul>
    `
  },
  {
    id: "rbi-financial-literacy-inclusion",
    title: "RBI Financial Literacy & Household Inclusion Insights",
    category: "Financial Literacy",
    categoryKey: "filter_finlit",
    source: "Reserve Bank of India (RBI)",
    officialSource: "Reserve Bank of India — Financial Education Initiative",
    year: "2025",
    readTime: "5 min read",
    sourceUrl: "https://www.rbi.org.in/Scripts/BS_ViewFinancialLiteracy.aspx",
    description: "An overview of the National Strategy for Financial Education (NSFE) and key behavioral insights for Indian household budgeting, formal credit, and consumer rights.",
    takeaways: [
      "The RBI's NSFE framework emphasizes 5 core capabilities: Active Budgeting, Emergency Cushioning, Prudent Credit, Risk Mitigation, and Future Planning.",
      "Informal borrowing (money lenders, unverified apps) exposes families to predatory rates exceeding 36–120% APR.",
      "The Reserve Bank's Ombudsman Scheme provides free, binding dispute resolution for aggrieved banking and digital payment consumers.",
      "Financial literacy is not just knowledge of products, but the daily discipline of tracking expenses and maintaining positive cash flow."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Under the National Strategy for Financial Education (NSFE 2020–2025), the Reserve Bank of India, alongside SEBI, IRDAI, and PFRDA, outlined a comprehensive blueprint to empower Indian citizens with fundamental financial competencies. The strategy moves beyond basic bank account opening (financial access) to sustainable usage and behavioral change.</p>

      <h3>Why It Matters</h3>
      <p>Rapid smartphone adoption and instant payment systems (UPI) have simplified money transfers, but digital access without financial literacy creates new vulnerabilities, such as over-indebtedness via 'Buy Now Pay Later' (BNPL) schemes and fraudulent investment scams.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The 5 Core Financial Competencies (RBI Framework)</h4>
      <ul>
        <li><strong>Active Budgeting:</strong> Developing the habit of documenting monthly inflows and categorizing outflows into essentials vs. discretionary desires.</li>
        <li><strong>Building a Safety Cushion:</strong> Maintaining liquid emergency savings before committing to illiquid or high-risk market instruments.</li>
        <li><strong>Prudent Credit Usage:</strong> Restricting debt to productive asset creation (e.g., education, affordable housing) and avoiding high-cost revolving consumer loans.</li>
        <li><strong>Appropriate Insurance:</strong> Protecting dependents against catastrophic shocks using life and health policies rather than using insurance as an investment.</li>
        <li><strong>Retirement & Legacy Planning:</strong> Establishing pension accounts (EPF/NPS) from the very first year of employment.</li>
      </ul>

      <h4>2. Consumer Protection & Safe Banking Practices</h4>
      <p>The RBI has instituted strict guidelines on digital lending and customer liability:</p>
      <ul>
        <li><strong>Zero Liability Policy:</strong> If unauthorized electronic banking transactions are reported within 3 working days, the customer's liability is zero.</li>
        <li><strong>RBI Integrated Ombudsman:</strong> If a bank or NBFC fails to resolve a valid grievance within 30 days, customers can file a complaint directly at <em>cms.rbi.org.in</em> at no cost.</li>
      </ul>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Keep your banking PIN, OTP, and UPI passwords strictly confidential; no bank official or regulatory authority ever asks for passwords.</li>
        <li>Check your credit score (CIBIL/Experian/Equifax/CRIF) once every 6 months for unauthorized inquiries or inaccuracies.</li>
        <li>Adopt a structured budget rule (such as Vridhi's 20-20-30-30 framework) to ensure disciplined cash allocation.</li>
      </ul>
    `
  },
  {
    id: "sebi-investor-behavior-market-trends",
    title: "SEBI Retail Investor Behavior & Market Participation",
    category: "Investing",
    categoryKey: "filter_investing",
    source: "Securities and Exchange Board of India (SEBI)",
    officialSource: "SEBI Investor Education & Research Division",
    year: "2025",
    readTime: "5 min read",
    sourceUrl: "https://www.sebi.gov.in/reports-and-statistics.html",
    description: "Analysis of India's surge in Demat accounts and mutual fund folios, contrasting long-term equity compounding with speculative derivative trading risks.",
    takeaways: [
      "Over 16+ Crore Demat accounts exist in India, reflecting unprecedented retail participation in the domestic capital market.",
      "SEBI study revealed that 93% of individual retail traders in the Equity Futures & Options (F&O) segment incurred net financial losses.",
      "Disciplined, long-term equity mutual fund and index investors demonstrated significantly higher wealth preservation and growth.",
      "Regulated grievance redressal is available through SEBI SCORES 2.0 and the SMART ODR platform for securities disputes."
    ],
    content: `
      <h3>Introduction</h3>
      <p>The Securities and Exchange Board of India (SEBI) regulates securities markets to protect investor interests and promote fair, transparent market development. In recent years, digital onboarding, zero-brokerage models, and financial technology platforms have democratized equity investing across Tier-2 and Tier-3 Indian cities.</p>

      <h3>Why It Matters</h3>
      <p>While direct market access allows retail investors to participate in India's macroeconomic growth, speculative activities (such as intraday trading and derivative options) without formal risk modeling frequently result in severe capital erosion for retail participants.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The SEBI Study on Derivative Trading (F&O)</h4>
      <p>SEBI's landmark empirical studies on individual traders in the Equity F&O segment revealed critical cautionary metrics:</p>
      <ul>
        <li><strong>Loss Ratio:</strong> Approximately 9 out of 10 individual traders (93%) suffered average net trading losses exceeding ₹1.25 Lakhs.</li>
        <li><strong>Transaction Cost Drag:</strong> Retail traders spent an additional 15% to 30% of their gross trading losses on brokerage, STT, exchange fees, and GST.</li>
        <li><strong>Key Takeaway:</strong> F&O is an institutional risk-hedging tool with zero-sum characteristics, whereas diversified equity investing creates positive-sum wealth over multi-year horizons.</li>
      </ul>

      <h4>2. The Rise of Systematic Equity Participation</h4>
      <p>In contrast to speculative trading, retail monthly SIP inflows crossed ₹20,000+ Crores per month. Domestic institutional investors (DIIs) powered by retail SIPs have acted as a resilient counterbalance to volatile foreign portfolio flows (FPIs), stabilizing the Indian equity ecosystem.</p>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li><strong>Separate Investing from Speculation:</strong> Treat equity mutual funds and broad index funds as 5+ year wealth builders, not lottery tickets.</li>
        <li><strong>Verify Registered Intermediaries:</strong> Never rely on unverified Telegram, WhatsApp, or social media "stock tips." Verify SEBI-registered Research Analysts and Investment Advisers on SEBI's official portal.</li>
        <li><strong>Use SCORES for Complaints:</strong> If a listed company, registrar, or stock broker fails to address an issue, lodge an escalated complaint on SEBI SCORES (<em>scores.sebi.gov.in</em>).</li>
      </ul>
    `
  },
  {
    id: "inflation-vs-real-returns",
    title: "Inflation vs. Real Returns: Protecting Household Purchasing Power",
    category: "Macroeconomics",
    categoryKey: "filter_macro",
    source: "Ministry of Finance / RBI / Vridhi Research Brief",
    officialSource: "Ministry of Statistics and Programme Implementation (MoSPI)",
    year: "2025–2026",
    readTime: "4 min read",
    sourceUrl: "https://www.mospi.gov.in/cpi",
    description: "Understanding headline Consumer Price Index (CPI) inflation, nominal vs. real returns, taxation drag on fixed deposits, and why asset diversification is essential.",
    takeaways: [
      "Headline nominal interest rates do not reflect true wealth growth: Real Return = Nominal Return - Inflation Rate - Taxes.",
      "A 7.0% Fixed Deposit in a 30% tax bracket yields ~4.9% post-tax; with 5.5% inflation, the real return is -0.6% (capital erosion).",
      "Lifestyle inflation in healthcare and higher education in India consistently trends at 8%–12% per year.",
      "A balanced multi-asset allocation (Equities, Debt, Gold, PF) is essential to outpace inflation across life milestones."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Inflation is often described as the "invisible tax" on savers. It represents the rate at which the general level of prices for goods and services rises, eroding the purchasing power of each rupee. Evaluating investment options solely by their nominal return without adjusting for inflation and income tax leads to a false sense of financial security.</p>

      <h3>Why It Matters for Indian Families</h3>
      <p>If ₹1,00,000 can buy a basket of household goods and medical services today, at a steady 6% annual inflation rate, that identical basket will cost <strong>₹1,79,084 in 10 years</strong> and <strong>₹3,20,713 in 20 years</strong>. Money stored in cash or sub-inflation instruments loses more than two-thirds of its real value over two decades.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The Real Return Formula</h4>
      <p>To determine if your savings are actually growing in purchasing power:</p>
      <p style="background: #f8fafc; padding: 12px; border-left: 4px solid var(--primary); font-family: monospace; border-radius: 4px;">
        Real Post-Tax Return ≈ [Nominal Return × (1 - Tax Rate)] - Inflation Rate
      </p>

      <h4>2. Asset Class Comparison (Historical Indian Context)</h4>
      <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Asset Class</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Nominal Return (Avg)</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Tax Efficiency</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Real Inflation Hedge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Cash / Savings Bank</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">2.7% – 3.5%</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Taxed at slab (above ₹10k)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">❌ Highly Negative (-2% to -3%)</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Bank Fixed Deposit (FD)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">6.5% – 7.2%</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Taxed at marginal slab</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">⚠️ Neutral to Negative Post-Tax</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Public Provident Fund (PPF)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">7.1% (Govt set)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">EEE (100% Tax-Free)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">✔️ Moderately Positive (~+1.5%)</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Diversified Equities / Index</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">11.0% – 13.0% (10yr+)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">12.5% LTCG (above ₹1.25L)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">🚀 Strongly Positive (+5% to +6%)</td>
          </tr>
        </tbody>
      </table>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li><strong>Short-Term (< 3 Years):</strong> Prioritize capital safety and liquidity using High-Yield FDs, Liquid Funds, and Arbitrage Funds.</li>
        <li><strong>Long-Term (> 5–10 Years):</strong> Allocate at least 50%–70% of long-term wealth into diversified equity index funds to maintain positive real returns.</li>
        <li><strong>Plan for Education/Medical Inflation:</strong> Apply an 8%–10% inflation estimate when calculating future goals like children's higher education.</li>
      </ul>
    `
  },
  {
    id: "emergency-funds-insurance-protection",
    title: "Emergency Funds & Insurance Protection in Urban India",
    category: "Insurance",
    categoryKey: "filter_insurance",
    source: "IRDAI / Vridhi Research Brief",
    officialSource: "Insurance Regulatory and Development Authority of India (IRDAI)",
    year: "2025–2026",
    readTime: "4 min read",
    sourceUrl: "https://irdai.gov.in",
    description: "Addressing financial vulnerability by establishing 3–6 months liquid emergency reserves, pure-risk term life policies, and comprehensive family health covers.",
    takeaways: [
      "An Emergency Fund must cover 3 to 6 months of mandatory household expenses in easily accessible liquid instruments.",
      "Pure Term Insurance provides 10–20x income coverage at a fraction of the cost of traditional endowment or money-back plans.",
      "Employer-provided group health insurance ceases immediately upon job transition or layoff; standalone personal health cover is mandatory.",
      "Do not combine investment with insurance: keeping them separate maximizes both protection cover and investment compounding."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Financial planning is built on defense before offense. Before pursuing wealth creation in the stock market or real estate, every household requires an impenetrable safety shield. A sudden medical emergency, job loss, or business interruption should never force a family into high-interest distress borrowing or premature liquidation of long-term investments.</p>

      <h3>Why It Matters</h3>
      <p>In India, out-of-pocket medical expenditure remains a significant cause of household debt. According to insurance industry studies, over 65% of urban breadwinners are severely under-insured, holding nominal policy covers of ₹5–10 Lakhs that fail to protect family living standards over 10+ years.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. Sizing and Parking Your Emergency Shield</h4>
      <p>In Vridhi's 20-20-30-30 framework, the Emergency Shield pillar is calibrated to essential living costs:</p>
      <ul>
        <li><strong>Calculation:</strong> Monthly Essential Expenses (Rent + EMIs + Utilities + Food + Basic Premiums) × 6 Months.</li>
        <li><strong>Where to Park:</strong> Split into 50% in a dedicated High-Interest Savings Account / Sweep-in FD and 50% in an Instant-Redemption Liquid Mutual Fund.</li>
        <li><strong>Golden Rule:</strong> This fund is strictly reserved for unforeseen emergencies, not discretionary vacation bookings or festive shopping.</li>
      </ul>

      <h4>2. The Two Pillars of Risk Protection</h4>
      <ul>
        <li><strong>Pure Term Life Insurance:</strong> If you have financial dependents, purchase a pure term policy offering 15x to 20x your annual income until age 60–65. Avoid ULIPs and Endowment plans that offer low coverage (₹5 Lakhs) for high premiums.</li>
        <li><strong>Family Floater Health Insurance:</strong> Secure a comprehensive base health policy of ₹10–25 Lakhs with Super Top-up provisions. Ensure the policy has minimal room-rent sub-limits and covers pre- and post-hospitalization costs.</li>
      </ul>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Buy term and health insurance when you are young and healthy; premiums lock in at lower rates and you avoid pre-existing disease waiting periods.</li>
        <li>Never conceal medical history or lifestyle habits (e.g. smoking) during policy proposals to prevent claim rejection at critical times.</li>
        <li>Review your coverage whenever major life events occur (marriage, childbirth, home loan acquisition).</li>
      </ul>
    `
  },
  {
    id: "new-vs-old-tax-regime-comparison",
    title: "New vs. Old Income Tax Regime: Practical Decision Framework",
    category: "Tax",
    categoryKey: "filter_tax",
    source: "Income Tax Department / Ministry of Finance",
    officialSource: "Income Tax Department, Government of India",
    year: "2025–2026",
    readTime: "5 min read",
    sourceUrl: "https://incometaxindia.gov.in",
    description: "A comprehensive structural comparison of the revised concessional slab rates under Section 115BAC versus traditional Chapter VI-A exemptions (80C, 80D, HRA).",
    takeaways: [
      "The New Tax Regime (Section 115BAC) is the default tax regime, offering lower progressive slab rates and a higher rebate under Section 87A.",
      "Salaried individuals with total deductions (80C, 80D, HRA, Home Loan Interest) below ₹3.75 Lakhs generally pay significantly lower tax under the New Regime.",
      "Under the New Regime, standard deduction for salaried employees and pensioners is ₹75,000.",
      "Salaried taxpayers can switch between regimes every financial year at the time of filing their ITR (Form 16/ITR-1/ITR-2)."
    ],
    content: `
      <h3>Introduction</h3>
      <p>The Government of India introduced and subsequently enhanced the New Concessional Tax Regime under Section 115BAC to simplify tax filing, reduce compliance disputes, and lower marginal tax rates for the majority of individual taxpayers without requiring compulsory lock-in investments.</p>

      <h3>Why It Matters</h3>
      <p>Many taxpayers lock away capital into 5-year tax-saver FDs or low-yield insurance policies simply to save tax under Section 80C. Understanding the breakeven deduction threshold empowers individuals to optimize their genuine take-home salary and invest for returns rather than solely for tax deductions.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. Core Structural Differences</h4>
      <ul>
        <li><strong>New Tax Regime (Default):</strong> Concessional progressive tax brackets, standard deduction of ₹75,000, and full tax rebate for taxable incomes up to ₹7.0 Lakhs (effective tax zero for salaried up to ₹7.75 Lakhs). Almost all Chapter VI-A deductions (80C, 80D, 80TTA, HRA, LTA) are foregone.</li>
        <li><strong>Old Tax Regime (Optional):</strong> Higher tax slabs, but allows deductions for Section 80C (up to ₹1.5L), Section 80D (health insurance up to ₹25k/₹50k), Section 24(b) (Home loan interest up to ₹2L), HRA exemptions, and NPS Section 80CCD(1B) (up to ₹50k).</li>
      </ul>

      <h4>2. The Breakeven Rule of Thumb</h4>
      <p>For an individual earning ₹12 Lakhs to ₹15 Lakhs gross income:</p>
      <ul>
        <li>If your total eligible deductions exceed <strong>₹3.75 Lakhs to ₹4.0 Lakhs</strong> (e.g. substantial HRA in metro cities + ₹1.5L 80C + ₹2L Home loan interest), the <strong>Old Regime</strong> may result in lower tax.</li>
        <li>If your deductions are modest (only standard deduction + ₹1.5L 80C), the <strong>New Regime</strong> saves substantial tax money and leaves more monthly liquid cash in your hands.</li>
      </ul>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li><strong>Simulate Before Choosing:</strong> Use official income tax calculators on <em>incometaxindia.gov.in</em> or HR portals at the start of each fiscal year.</li>
        <li><strong>Do Not Buy Bad Financial Products for Tax:</strong> Never buy an inefficient financial product with a 15-year lock-in just to save ₹15,000 in 80C tax under the Old Regime.</li>
        <li><strong>Verify Current Finance Act Rules:</strong> Tax rules and slab structures are revised in annual Union Budgets; always verify the current assessment year guidelines.</li>
      </ul>
    `
  },
  {
    id: "digital-payments-upi-microcredit",
    title: "Digital Lending, UPI & Micro-Credit Trends in India",
    category: "Digital Finance",
    categoryKey: "filter_digital",
    source: "NPCI / RBI",
    officialSource: "National Payments Corporation of India (NPCI)",
    year: "2025",
    readTime: "4 min read",
    sourceUrl: "https://www.npci.org.in/what-we-do/upi/product-overview",
    description: "How Unified Payments Interface (UPI 2.0), Credit on UPI, and RBI's Digital Lending Guidelines are reshaping domestic retail commerce and consumer credit safety.",
    takeaways: [
      "UPI processes over 15+ Billion transactions monthly, making India the global leader in real-time retail digital payments.",
      "The integration of RuPay Credit Cards and Pre-Sanctioned Bank Credit lines onto UPI enables seamless micro-credit at merchant QR codes.",
      "RBI Digital Lending Guidelines mandate that all loan disbursals and repayments must execute directly between borrower and bank accounts without intermediary pool accounts.",
      "Borrowers must receive a standardized Key Fact Statement (KFS) stating the All-Inclusive Annual Percentage Rate (APR) before loan execution."
    ],
    content: `
      <h3>Introduction</h3>
      <p>India's digital public infrastructure (often termed the "India Stack")—comprising Aadhaar, e-KYC, DigiLocker, Account Aggregator (AA), and UPI—has transformed how citizens manage payments, access micro-loans, and transfer remittances across the country.</p>

      <h3>Why It Matters</h3>
      <p>Instant frictionless credit enables small merchants and salaried individuals to manage short-term working capital needs. However, the proliferation of predatory instant loan apps, aggressive collection tactics, and hidden platform fees necessitated strict regulatory standards by the Reserve Bank of India.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. Credit on UPI Architecture</h4>
      <p>NPCI enabled the linking of RuPay Credit Cards and pre-approved formal credit lines with UPI apps (Google Pay, PhonePe, Paytm, BHIM). Users can scan standard merchant QR codes and draw credit with standard interest-free billing cycles (up to 45–50 days), reducing dependence on costly offline credit cards.</p>

      <h4>2. RBI Digital Lending Directives (Consumer Safeguards)</h4>
      <ul>
        <li><strong>Direct Account-to-Account Disbursal:</strong> Third-party Loan Service Providers (LSPs) cannot touch loan capital. Disbursals must flow directly from the regulated Bank/NBFC to the customer's bank account.</li>
        <li><strong>Mandatory Key Fact Statement (KFS):</strong> Lenders must disclose the exact total cost of credit, processing fees, penal charges, and effective APR upfront in simple language.</li>
        <li><strong>Cooling-off / Look-up Period:</strong> Borrowers have an exit window during which they can cancel the digital loan without penal fees by paying back only the principal and proportionate APR.</li>
      </ul>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Never install unverified APK files from social media ads promising "Instant ₹50,000 loan without PAN/Aadhaar check." Only borrow from entities registered with RBI.</li>
        <li>Avoid using revolving credit on UPI for non-essential lifestyle expenses; treat credit lines as liquidity buffers rather than free income.</li>
        <li>Remember that every UPI transaction requires entering your UPI PIN <strong>only to SEND money</strong>, never to RECEIVE funds.</li>
      </ul>
    `
  },
  {
    id: "retirement-readiness-nps-epf",
    title: "Retirement Readiness: National Pension System (NPS) & EPF",
    category: "Retirement",
    categoryKey: "filter_retirement",
    source: "PFRDA / EPFO / Vridhi Research Brief",
    officialSource: "Pension Fund Regulatory and Development Authority (PFRDA)",
    year: "2025–2026",
    readTime: "5 min read",
    sourceUrl: "https://www.pfrda.org.in",
    description: "Combining mandatory Employee Provident Fund (EPF) savings with voluntary Tier-1 NPS contributions for ultra-low-cost, market-linked pension accumulation.",
    takeaways: [
      "Retirement is the only major financial milestone for which no bank will grant an education loan or personal loan; early planning is non-negotiable.",
      "NPS is one of the lowest-cost investment structures globally, with fund management charges as low as 0.03% to 0.09% per annum.",
      "An active choice in NPS allows up to 75% allocation to corporate equity (Asset Class E) for aggressive long-term compounding.",
      "At age 60, up to 60% of the accumulated NPS corpus can be withdrawn completely tax-free, while the remaining 40% provides a regular monthly annuity."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Due to increasing life expectancy and the transition from joint family structures to nuclear households in urban India, self-funded retirement planning has become a paramount financial objective. Relying solely on a bank savings account or traditional gratuity is inadequate to sustain 25–30 years of retirement living expenses.</p>

      <h3>Why It Matters</h3>
      <p>With an average annual inflation of 6%, a household needing ₹40,000 per month today will require <strong>~₹2.30 Lakhs per month in 30 years</strong> to sustain the exact same standard of living. Building a multi-crore retirement nest egg requires systematic compounding over 25–35 working years.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The Dual-Pillar Retirement Model</h4>
      <ul>
        <li><strong>Pillar 1: Employees' Provident Fund (EPF):</strong> Sovereign-backed, mandatory for formal sector salaried employees. Offers stable, declared annual interest (historically 8.1%–8.25%) with EEE tax exemption up to annual statutory thresholds.</li>
        <li><strong>Pillar 2: National Pension System (NPS Tier-1):</strong> Regulated by PFRDA. Offers customizable asset allocation across Equities (E), Corporate Bonds (C), and Government Securities (G). Offers additional tax deductions under Section 80CCD(1B) up to ₹50,000 over and above Section 80C under the Old Tax Regime.</li>
      </ul>

      <h4>2. Active Choice vs. Auto Choice in NPS</h4>
      <p>Subscribers can choose between two investment modes:</p>
      <ul>
        <li><strong>Active Choice:</strong> You decide your asset mix (up to 75% in Equity Class E up to age 50, gradually tapered down to manage risk).</li>
        <li><strong>Auto Choice (Lifecycle Funds):</strong> The system automatically shifts allocation from equity to government bonds as you age (Aggressive LC-75, Moderate LC-50, or Conservative LC-25).</li>
      </ul>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Maintain your EPF account when switching employers using your Universal Account Number (UAN); avoid prematurely withdrawing EPF balances during job changes.</li>
        <li>Open a voluntary NPS Tier-1 account online via e-NPS using your PAN and Aadhaar in under 15 minutes.</li>
        <li>Calculate your targeted retirement corpus early: a widely used benchmark is aiming for 25x to 30x your projected annual retirement expenditure.</li>
      </ul>
    `
  },
  {
    id: "sovereign-gold-bonds-asset-allocation",
    title: "Sovereign Gold Bonds (SGB) & Asset Allocation in India",
    category: "Investing",
    categoryKey: "filter_investing",
    source: "Reserve Bank of India (RBI)",
    officialSource: "Reserve Bank of India — Government Securities & SGB FAQ",
    year: "2025",
    readTime: "4 min read",
    sourceUrl: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=109",
    description: "Evaluating gold as a macroeconomic inflation hedge, comparing physical gold vs. Sovereign Gold Bonds with coupon yield and complete capital gains tax exemption upon maturity.",
    takeaways: [
      "Gold has historically demonstrated a low or negative correlation with equities, reducing overall portfolio volatility during global market distress.",
      "Sovereign Gold Bonds (SGBs) issued by the RBI pay a fixed 2.50% annual interest on the initial investment amount, paid semi-annually.",
      "Redemption of SGBs at maturity (8 years) by an individual is 100% exempt from capital gains tax under Section 47 of the Income Tax Act.",
      "Financial planners generally recommend allocating 5% to 10% of a portfolio to gold as an insurance hedge against currency depreciation."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Gold holds profound cultural, emotional, and economic significance in Indian society. From an investment perspective, gold serves as a store of value, a hedge against domestic currency depreciation, and a safe-haven asset during geopolitical and macroeconomic crises.</p>

      <h3>Why It Matters</h3>
      <p>Traditional physical gold (jewelry, coins) incurs substantial costs: making charges (8%–25%), storage/locker risks, purity deductions upon resale, and Goods and Services Tax (3% GST). Sovereign Gold Bonds and Gold ETFs offer paper/demat alternatives that eliminate storage costs and impurity risks.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. Physical Gold vs. Sovereign Gold Bonds (SGBs)</h4>
      <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Feature</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Physical Gold (Jewelry)</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">Sovereign Gold Bonds (SGB)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Making / Storage Charges</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">High (8% - 25% + Locker Fees)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Zero (Stored safely in Demat/RBI)</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Annual Cash Yield</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">0.0% (Zero yield)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">+2.50% per annum (paid semi-annually)</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Capital Gains Tax</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Applicable (12.5% LTCG)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">100% Tax-Free upon 8-yr maturity</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Purity Guarantee</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Depends on Hallmarking (916/750)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">999 Purity benchmarked by IBJA</td>
          </tr>
        </tbody>
      </table>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Treat gold as a defensive insurance asset (5%–10% of portfolio), not a high-growth asset; over 30-year horizons, productive businesses (equities) consistently outgrow commodities.</li>
        <li>Existing secondary market SGB tranches can be bought on stock exchanges (NSE/BSE) through your Demat account, often at attractive discounts to spot gold prices.</li>
      </ul>
    `
  },
  {
    id: "direct-vs-regular-mutual-funds",
    title: "Direct vs. Regular Mutual Funds: The Compounding Cost of Fees",
    category: "Financial Planning",
    categoryKey: "filter_planning",
    source: "SEBI / AMFI / Vridhi Research Brief",
    officialSource: "Securities and Exchange Board of India (SEBI Mutual Fund Regulations)",
    year: "2025–2026",
    readTime: "4 min read",
    sourceUrl: "https://www.amfiindia.com",
    description: "How Total Expense Ratios (TER) and distributor commissions compound over a 15–25 year horizon, creating massive differences between Direct and Regular investment plans.",
    takeaways: [
      "In 2013, SEBI mandated all Asset Management Companies (AMCs) to provide a 'Direct Plan' alongside traditional 'Regular Plans'.",
      "Regular plans pay ongoing annual commissions (0.5% to 1.2% per year) to distributors out of your investment value every single day.",
      "Over a 25-year investment journey, a 1% difference in expense ratio can consume 20% to 25% of your total final wealth corpus.",
      "Direct plans share the exact same fund manager, underlying stock portfolio, and risk profile as regular plans, but deliver higher Net Asset Value (NAV) growth."
    ],
    content: `
      <h3>Introduction</h3>
      <p>Every mutual fund incurs operational and management expenses known as the Total Expense Ratio (TER). In a Regular Plan, the AMC deducts a distributor commission from the fund's NAV every day to pay the agent or bank who sold the fund. In a Direct Plan, no intermediary commission is deducted, resulting in a lower TER and a higher daily NAV.</p>

      <h3>Why It Matters</h3>
      <p>A difference of 0.8% to 1.0% in annual fees may sound trivial in year 1. However, because mutual fund fees are deducted directly from your compounding asset base, that 1% fee compounds negatively every single year over your entire lifetime.</p>

      <h3>Detailed Breakdown</h3>
      <h4>1. The 25-Year Compounding Comparison</h4>
      <p>Consider an investor contributing ₹15,000 per month for 25 years into an equity mutual fund earning 12% gross annual returns:</p>
      <ul>
        <li><strong>Direct Plan (Expense Ratio: 0.5% → Net Return: 11.5%):</strong> Final Corpus = <strong>~₹2.54 Crores</strong>.</li>
        <li><strong>Regular Plan (Expense Ratio: 1.5% → Net Return: 10.5%):</strong> Final Corpus = <strong>~₹2.06 Crores</strong>.</li>
      </ul>
      <p>The investor in the Regular Plan lost <strong>₹48 Lakhs</strong> in wealth exclusively to intermediary commissions for holding the exact same portfolio of stocks.</p>

      <h4>2. When Does a Regular Plan Make Sense?</h4>
      <p>If an investor has zero financial literacy and relies on an experienced, ethical Mutual Fund Distributor (MFD) for comprehensive hand-holding, goal tracking, and behavioral counseling during market panics, the commission may provide value. However, for self-directed investors using modern digital platforms, Direct Plans are clearly superior.</p>

      <h3>Practical Actionable Insights</h3>
      <ul>
        <li>Inspect your current mutual fund statements: look for the word <strong>"Direct - Growth"</strong> in the scheme name. If it says <strong>"Regular - Growth"</strong>, you are paying recurring distributor commissions.</li>
        <li>You can switch existing regular fund holdings to direct plans on registrar platforms (CAMS/KFintech) or direct investment portals, keeping in mind applicable exit loads and capital gains tax rules.</li>
      </ul>
    `
  }
];
window.REPORTS_DATA = REPORTS_DATA;

// Active filter state
let activeCategoryFilter = "all";
let activeSearchQuery = "";

// Initialize Reports Module on DOMContentLoaded
function initReportsModule() {
  renderCategoryFilters();
  renderReportsList();
  setupReportModalListeners();
  setupSearchInputListener();
}

// Render Category Filter Buttons
function renderCategoryFilters() {
  const filterContainer = document.getElementById("reports-category-filters");
  if (!filterContainer) return;

  const categories = [
    { key: "all", labelKey: "filter_all", defaultLabel: "All" },
    { key: "Investing", labelKey: "filter_investing", defaultLabel: "Investing" },
    { key: "Financial Literacy", labelKey: "filter_finlit", defaultLabel: "Financial Literacy" },
    { key: "Tax", labelKey: "filter_tax", defaultLabel: "Tax" },
    { key: "Insurance", labelKey: "filter_insurance", defaultLabel: "Insurance" },
    { key: "Retirement", labelKey: "filter_retirement", defaultLabel: "Retirement" },
    { key: "Digital Finance", labelKey: "filter_digital", defaultLabel: "Digital Finance" },
    { key: "Macroeconomics", labelKey: "filter_macro", defaultLabel: "Macroeconomics" },
    { key: "Financial Planning", labelKey: "filter_planning", defaultLabel: "Financial Planning" }
  ];

  filterContainer.innerHTML = categories.map(cat => {
    const isActive = activeCategoryFilter === cat.key;
    const label = (window.t && window.t(cat.labelKey)) ? window.t(cat.labelKey) : cat.defaultLabel;
    return `
      <button type="button" 
              class="report-filter-pill ${isActive ? 'active' : ''}" 
              data-filter-category="${cat.key}"
              onclick="window.setReportCategoryFilter('${cat.key}')">
        ${label}
      </button>
    `;
  }).join("");
}
window.renderCategoryFilters = renderCategoryFilters;

// Set active category filter
function setReportCategoryFilter(category) {
  activeCategoryFilter = category;
  renderCategoryFilters();
  renderReportsList();
}
window.setReportCategoryFilter = setReportCategoryFilter;

// Filter reports based on active query & category
function getFilteredReports() {
  return REPORTS_DATA.filter(report => {
    // Category match
    const categoryMatches = (activeCategoryFilter === "all" || report.category.toLowerCase() === activeCategoryFilter.toLowerCase());

    // Search query match
    if (!activeSearchQuery.trim()) {
      return categoryMatches;
    }

    const q = activeSearchQuery.toLowerCase().trim();
    const titleMatches = report.title.toLowerCase().includes(q);
    const descMatches = report.description.toLowerCase().includes(q);
    const sourceMatches = report.source.toLowerCase().includes(q);
    const categoryTextMatches = report.category.toLowerCase().includes(q);

    return categoryMatches && (titleMatches || descMatches || sourceMatches || categoryTextMatches);
  });
}

// Render Reports Cards Grid
function renderReportsList() {
  const container = document.getElementById("reports-grid-container");
  if (!container) return;

  const filtered = getFilteredReports();
  const readNowLabel = (window.t && window.t('read_now')) ? window.t('read_now') : 'Read Report 📖';
  const noReportsLabel = (window.t && window.t('no_reports_found')) ? window.t('no_reports_found') : 'No reports match your search criteria.';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="reports-empty-state">
        <span style="font-size: 2.2rem;">🔍</span>
        <p>${noReportsLabel}</p>
        <button class="report-filter-pill active" onclick="window.setReportCategoryFilter('all'); document.getElementById('report-search-input').value=''; window.handleReportSearch('');">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(report => {
    return `
      <div class="report-card" data-report-id="${report.id}">
        <div class="report-card-top">
          <span class="report-category-tag">${report.category}</span>
          <span class="report-read-time">⏱️ ${report.readTime}</span>
        </div>
        <h3 class="report-card-title">${report.title}</h3>
        <p class="report-card-desc">${report.description}</p>
        <div class="report-card-meta">
          <div class="report-source-info">
            <span class="report-source-icon">🏛️</span>
            <div>
              <div class="report-source-name">${report.source}</div>
              <div class="report-source-year">${report.year}</div>
            </div>
          </div>
        </div>
        <div class="report-card-actions">
          <button type="button" class="report-read-btn" onclick="window.openReportReader('${report.id}')">
            ${readNowLabel}
          </button>
        </div>
      </div>
    `;
  }).join("");
}
window.renderReportsList = renderReportsList;

// Search listener
function setupSearchInputListener() {
  const searchInput = document.getElementById("report-search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    window.handleReportSearch(e.target.value);
  });
}

function handleReportSearch(query) {
  activeSearchQuery = query;
  renderReportsList();
}
window.handleReportSearch = handleReportSearch;

// Open Report Reader Modal
function openReportReader(reportId) {
  const report = REPORTS_DATA.find(r => r.id === reportId);
  if (!report) return;

  const modal = document.getElementById("report-reader-modal");
  const backdrop = document.getElementById("report-modal-backdrop");
  if (!modal || !backdrop) return;

  // Populate modal fields
  document.getElementById("modal-category-badge").textContent = report.category;
  document.getElementById("modal-report-title").textContent = report.title;
  document.getElementById("modal-source-text").textContent = report.officialSource || report.source;
  document.getElementById("modal-year-text").textContent = report.year;
  document.getElementById("modal-readtime-text").textContent = report.readTime;

  // Key takeaways
  const takeawaysList = document.getElementById("modal-takeaways-list");
  if (takeawaysList) {
    takeawaysList.innerHTML = report.takeaways.map(t => `<li>${t}</li>`).join("");
  }

  // Content body
  const contentContainer = document.getElementById("modal-article-body");
  if (contentContainer) {
    contentContainer.innerHTML = report.content;
  }

  // Official source button
  const sourceBtn = document.getElementById("modal-official-source-btn");
  if (sourceBtn) {
    sourceBtn.href = report.sourceUrl;
  }

  // Show modal and lock background scrolling
  backdrop.classList.add("active");
  modal.classList.add("active");
  document.body.classList.add("report-modal-open");

  // Focus close button for accessibility
  const closeBtn = document.getElementById("modal-close-btn");
  if (closeBtn) closeBtn.focus();
}
window.openReportReader = openReportReader;

// Close Report Reader Modal
function closeReportReader() {
  const modal = document.getElementById("report-reader-modal");
  const backdrop = document.getElementById("report-modal-backdrop");
  if (!modal || !backdrop) return;

  modal.classList.remove("active");
  backdrop.classList.remove("active");
  document.body.classList.remove("report-modal-open");
}
window.closeReportReader = closeReportReader;

// Setup Modal event listeners (Escape key, Backdrop click, Close button)
function setupReportModalListeners() {
  const modal = document.getElementById("report-reader-modal");
  const backdrop = document.getElementById("report-modal-backdrop");
  const closeBtn = document.getElementById("modal-close-btn");
  const footerCloseBtn = document.getElementById("modal-footer-close-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeReportReader);
  }
  if (footerCloseBtn) {
    footerCloseBtn.addEventListener("click", closeReportReader);
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeReportReader);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      const activeModal = document.querySelector(".report-reader-modal.active");
      if (activeModal) {
        closeReportReader();
      }
    }
  });
}

// Re-render when language changes
if (window.applyLanguage) {
  const originalApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(lang) {
    originalApplyLanguage(lang);
    renderCategoryFilters();
    renderReportsList();
  };
}

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initReportsModule();
});
