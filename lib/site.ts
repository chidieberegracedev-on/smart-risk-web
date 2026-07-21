// Central site configuration + content.
// Keeping copy here keeps messaging consistent and easy to audit against the
// financial-product messaging rules (no profit promises, risk-first framing).

export const site = {
  name: "Smart Risk Assistant",
  shortName: "Smart Risk",
  // A protective layer between a trader's idea and execution.
  tagline: "Trade with a risk framework, not on impulse.",
  description:
    "Smart Risk Assistant is a protective layer between your trade idea and execution. Calculate position sizes, weigh risk against reward, score your setups, and enter every trade with a plan — built for MetaTrader traders acting on signals or their own analysis.",
  url: "https://smartriskassistant.com",
  // Play Store internal testing for now; structured for a public link later.
  appLink: "#download",
  ogImage: "/og.png",
} as const;

export const nav = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "The app", href: "/#the-app" },
  { label: "Learn", href: "/learn" },
  { label: "Advertise", href: "/advertise" },
] as const;

// The problems traders actually face — knowing WHERE to trade but failing on risk.
export const problems = [
  {
    title: "Position sizes guessed, not calculated",
    body: "One oversized lot can undo weeks of careful trades. Most losses trace back to risking too much on a single position.",
  },
  {
    title: "Setups entered on emotion",
    body: "FOMO, revenge trades, and hesitation override the plan. The idea was fine — the execution wasn't disciplined.",
  },
  {
    title: "Signals acted on blindly",
    body: "A Telegram call or a chart pattern isn't an execution plan. Without weighing risk and reward first, it's just a guess.",
  },
  {
    title: "No framework, no consistency",
    body: "Without a repeatable process for sizing and evaluating trades, results swing on luck instead of method.",
  },
] as const;

// The protective-layer concept: idea -> risk analysis -> disciplined execution.
export const steps = [
  {
    n: "01",
    title: "Bring your idea or signal",
    body: "Start with a setup from your own analysis, a community, or a Telegram signal. Smart Risk Assistant sits between that idea and your trade.",
  },
  {
    n: "02",
    title: "Run the risk analysis",
    body: "Calculate the exact position size for your account and stop, see the risk-to-reward, and get a quality score on the setup before any money is on the line.",
  },
  {
    n: "03",
    title: "Execute with discipline",
    body: "Enter with a clear plan and defined risk — then journal the trade so your process compounds over time instead of your mistakes.",
  },
] as const;

// The ecosystem — current + evolving. Plain trader language.
export const features = [
  {
    title: "Risk & lot-size calculator",
    body: "Enter your account size, risk tolerance, and stop distance — get the precise position size instantly. No more napkin math.",
    tag: "Core",
  },
  {
    title: "Trade setup analysis",
    body: "Break a setup into its parts — entry, stop, target, structure — and see whether it holds up before you commit.",
    tag: "Core",
  },
  {
    title: "Risk / reward evaluation",
    body: "Weigh what you're risking against what you stand to gain, visualised clearly so the trade-off is obvious at a glance.",
    tag: "Core",
  },
  {
    title: "Trade quality scoring",
    body: "A structured score highlights where a setup is strong and where it's stretched — a second opinion, not a signal.",
    tag: "Core",
  },
  {
    title: "Signal interpretation",
    body: "Turn a raw signal into a concrete plan: what to risk, where the stop sits, and whether the reward justifies the exposure.",
    tag: "Ecosystem",
  },
  {
    title: "Trading journal & tracking",
    body: "Log trades and review your performance over time. Patterns in your own behaviour become visible and fixable.",
    tag: "Ecosystem",
  },
  {
    title: "AI chart & trade analysis",
    body: "Get AI-assisted reads on charts and trades to pressure-test your thinking — framed around risk, never as a prediction.",
    tag: "Evolving",
  },
  {
    title: "Behavioral & risk warnings",
    body: "Gentle flags when a trade breaks your own rules — oversizing, over-trading, or chasing after a loss.",
    tag: "Evolving",
  },
] as const;

export const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Get the app", href: "/download" },
  ],
  Resources: [
    { label: "Learn", href: "/learn" },
    { label: "Space community", href: "/#space" },
  ],
  Business: [
    { label: "Advertise", href: "/advertise" },
  ],
} as const;

export const riskDisclaimer =
  "Trading involves substantial risk of loss and is not suitable for every investor. Smart Risk Assistant is a risk-management and decision-support tool — not financial advice, a signal service, or a guarantee of any outcome. Calculations and scores are aids to your own judgement. You are solely responsible for your trading decisions. Never risk capital you cannot afford to lose.";
