import type { Plan } from '../types';

// Subscription plans for the mock paywall (screen 21). Prices are the VERBATIM
// values from the source listing (Weekly $7.99 / Monthly $14.99 / Yearly $49.99)
// and are display-only — selecting a plan NEVER processes a payment. Monthly is
// the default-selected plan, so the paywall's "Continue" is always enabled
// (exactly one plan is always selected). Yearly's "Save 72%" badge is computed
// against the monthly price ($14.99 × 12 = $179.88 vs $49.99 ≈ 72% off).
export const PLANS: Plan[] = [
  {
    id: 'weekly',
    title: 'Weekly',
    price: '$7.99/week',
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$14.99/month',
    badge: { label: 'Most popular', tone: 'black' },
    defaultSelected: true,
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$49.99/year',
    badge: { label: 'Save 72%', tone: 'green' },
  },
];

export const DEFAULT_PLAN_ID = 'monthly' as const;

// Auto-renew / payment terms shown as fine print on the paywall. Reproduced from
// the source listing's "Payments and Renewal" section. This is display-only
// legal copy — the app processes no real payments.
export const SUBSCRIPTION_TERMS = [
  'Payment will be charged to your Apple ID account at the confirmation of purchase.',
  'Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.',
  'Your account will be charged for renewal within 24 hours prior to the end of the current period.',
  'You can manage and cancel your subscriptions in your account settings on the App Store after purchase.',
  'No cancellation of the current subscription is allowed during the active subscription period.',
];
