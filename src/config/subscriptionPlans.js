// src/config/subscriptionPlans.js

/**
 * Subscription Plans Configuration
 * Defines all available subscription tiers with features and pricing
 */

export const SUBSCRIPTION_PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        priceAnnual: 0,
        priceByok: 0,
        popular: false,
        cta: 'Get Started Free',
        features: {
            contentPieces: 5,
            platforms: 1,
            imageGeneration: 0,
            videoGeneration: 0,
            teamMembers: 1,
            support: 'community',
            analytics: 'basic',
            scheduling: false,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false
        },
        featureList: [
            '5 content pieces per month',
            '1 platform connection',
            'Basic analytics',
            'Community support',
            'AI-powered content generation'
        ]
    },

    starter: {
        id: 'starter',
        name: 'Starter',
        priceMonthly: 1499,
        priceAnnual: 14390, // 20% discount
        priceByok: 299,
        popular: false,
        cta: 'Start Free Trial',
        features: {
            contentPieces: 50,
            platforms: 3,
            imageGeneration: 0,
            videoGeneration: 0,
            teamMembers: 1,
            support: 'email',
            analytics: 'standard',
            scheduling: true,
            customBranding: false,
            apiAccess: false,
            prioritySupport: false
        },
        featureList: [
            '50 content pieces per month',
            '3 platform connections',
            'Standard analytics & insights',
            'Content scheduling',
            'Email support',
            'AI research & writing',
            '14-day free trial'
        ]
    },

    growth: {
        id: 'growth',
        name: 'Growth',
        priceMonthly: 2999,
        priceAnnual: 28790, // 20% discount
        priceByok: 599,
        popular: true,
        cta: 'Start Free Trial',
        features: {
            contentPieces: 200,
            platforms: 10,
            imageGeneration: 100,
            videoGeneration: 0,
            teamMembers: 3,
            support: 'priority-email',
            analytics: 'advanced',
            scheduling: true,
            customBranding: true,
            apiAccess: false,
            prioritySupport: false
        },
        featureList: [
            '200 content pieces per month',
            '10 platform connections',
            '100 AI-generated images/month',
            'Advanced analytics & reporting',
            'Content scheduling & automation',
            'Custom branding',
            '3 team members',
            'Priority email support',
            '14-day free trial'
        ]
    },

    professional: {
        id: 'professional',
        name: 'Professional',
        priceMonthly: 4999,
        priceAnnual: 47990, // 20% discount
        priceByok: 999,
        popular: false,
        cta: 'Start Free Trial',
        features: {
            contentPieces: 999999,
            platforms: 999,
            imageGeneration: 500,
            videoGeneration: 50,
            teamMembers: 10,
            support: 'priority',
            analytics: 'advanced',
            scheduling: true,
            customBranding: true,
            apiAccess: true,
            prioritySupport: true
        },
        featureList: [
            'Unlimited content pieces',
            'Unlimited platform connections',
            '500 AI-generated images/month',
            '50 AI-generated videos/month',
            'Advanced analytics & reporting',
            'Content scheduling & automation',
            'Custom branding',
            '10 team members',
            'API access',
            'Priority support (24/7)',
            '14-day free trial'
        ]
    },

    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: null, // Custom pricing
        priceAnnual: null,
        priceByok: null,
        popular: false,
        cta: 'Contact Sales',
        features: {
            contentPieces: 999999,
            platforms: 999,
            imageGeneration: 999999,
            videoGeneration: 999999,
            teamMembers: 999,
            support: 'dedicated',
            analytics: 'custom',
            scheduling: true,
            customBranding: true,
            apiAccess: true,
            prioritySupport: true,
            customIntegrations: true,
            sla: true,
            onboarding: true
        },
        featureList: [
            'Unlimited everything',
            'Custom integrations',
            'Dedicated account manager',
            'Custom analytics & reporting',
            'White-label options',
            'SLA guarantee',
            'Custom onboarding & training',
            'Unlimited team members',
            'API access with higher limits',
            '24/7 dedicated support'
        ]
    }
};

/**
 * Get plan by ID
 */
export const getPlanById = (planId) => {
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
};

/**
 * Get all paid plans
 */
export const getPaidPlans = () => {
    return Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free');
};

/**
 * Get popular plan
 */
export const getPopularPlan = () => {
    return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.popular) || SUBSCRIPTION_PLANS.growth;
};

/**
 * Calculate annual savings
 */
export const calculateAnnualSavings = (plan) => {
    if (!plan.priceMonthly || !plan.priceAnnual) return 0;
    const monthlyTotal = plan.priceMonthly * 12;
    return monthlyTotal - plan.priceAnnual;
};

/**
 * Get BYOK savings
 */
export const getBYOKSavings = (plan) => {
    if (!plan.priceMonthly || !plan.priceByok) return 0;
    return plan.priceMonthly - plan.priceByok;
};

/**
 * Get BYOK savings percentage
 */
export const getBYOKSavingsPercentage = (plan) => {
    if (!plan.priceMonthly || !plan.priceByok) return 0;
    return Math.round(((plan.priceMonthly - plan.priceByok) / plan.priceMonthly) * 100);
};

export default SUBSCRIPTION_PLANS;
