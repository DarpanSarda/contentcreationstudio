// src/utils/byokPricingUtils.js

/**
 * BYOK (Bring Your Own Keys) Pricing Utilities
 * Handles pricing calculations and BYOK status detection
 */

// Required API keys for each feature category
export const REQUIRED_KEYS_BY_FEATURE = {
    text_generation: ['groq', 'openai', 'anthropic', 'deepseek', 'google'], // Need at least 1
    research: ['brave_search', 'tavily', 'serper'], // Need at least 1
    image_generation: ['stability', 'google', 'openai', 'replicate'], // Need at least 1 (coming soon)
    video_generation: ['stability', 'replicate'] // Need at least 1 (coming soon)
};

// Required features for each plan
export const PLAN_REQUIRED_FEATURES = {
    free: ['text_generation', 'research'],
    starter: ['text_generation', 'research'],
    growth: ['text_generation', 'research', 'image_generation'],
    professional: ['text_generation', 'research', 'image_generation', 'video_generation'],
    enterprise: ['text_generation', 'research', 'image_generation', 'video_generation']
};

/**
 * Check if user has at least one key from a list
 */
const hasAnyKey = (userApiKeys, keyList) => {
    return keyList.some(key => {
        const value = userApiKeys[key];
        return value && typeof value === 'string' && value.trim().length > 0;
    });
};

/**
 * Calculate BYOK status for a user
 * @param {Object} userApiKeys - User's API keys
 * @param {string} planId - Plan ID (free, starter, growth, professional, enterprise)
 * @returns {Object} BYOK status information
 */
export const calculateBYOKStatus = (userApiKeys = {}, planId = 'starter') => {
    const requiredFeatures = PLAN_REQUIRED_FEATURES[planId] || PLAN_REQUIRED_FEATURES.starter;

    // Check coverage for each required feature
    const coverage = {};
    requiredFeatures.forEach(feature => {
        const requiredKeys = REQUIRED_KEYS_BY_FEATURE[feature] || [];
        coverage[feature] = hasAnyKey(userApiKeys, requiredKeys);
    });

    // Calculate overall coverage
    const totalFeatures = requiredFeatures.length;
    const coveredFeatures = Object.values(coverage).filter(Boolean).length;
    const coveragePercentage = totalFeatures > 0 ? (coveredFeatures / totalFeatures) * 100 : 0;

    // Determine BYOK status (binary: all or nothing)
    const isByok = coveragePercentage === 100;
    const isHybrid = coveragePercentage > 0 && coveragePercentage < 100;
    const isManaged = coveragePercentage === 0;

    return {
        isByok,
        isHybrid,
        isManaged,
        coveragePercentage,
        coverage,
        coveredFeatures,
        totalFeatures,
        missingFeatures: Object.entries(coverage)
            .filter(([, covered]) => !covered)
            .map(([feature]) => feature)
    };
};

/**
 * Calculate pricing for a plan based on BYOK status
 * @param {Object} plan - Plan object with pricing
 * @param {Object} userApiKeys - User's API keys
 * @returns {Object} Pricing information
 */
export const calculatePricing = (plan, userApiKeys = {}) => {
    if (!plan) {
        return {
            basePrice: 0,
            discount: 0,
            finalPrice: 0,
            isByok: false,
            savingsPercentage: 0
        };
    }

    const byokStatus = calculateBYOKStatus(userApiKeys, plan.id);

    const basePrice = plan.priceMonthly || plan.price || 0;
    const byokPrice = plan.priceByok || basePrice;

    // Binary approach: Full discount if all keys provided, no discount otherwise
    const finalPrice = byokStatus.isByok ? byokPrice : basePrice;
    const discount = basePrice - finalPrice;
    const savingsPercentage = basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;

    return {
        basePrice,
        byokPrice,
        discount,
        finalPrice,
        isByok: byokStatus.isByok,
        isHybrid: byokStatus.isHybrid,
        savingsPercentage,
        byokStatus
    };
};

/**
 * Get user-friendly message based on BYOK status
 */
export const getBYOKMessage = (byokStatus, pricing) => {
    if (byokStatus.isByok) {
        return {
            type: 'success',
            title: '🎉 BYOK Active!',
            message: `You're saving ₹${pricing.discount.toLocaleString()}/month (${pricing.savingsPercentage}% off) by using your own API keys!`
        };
    }

    if (byokStatus.isHybrid) {
        const missing = byokStatus.missingFeatures.map(f =>
            f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        ).join(', ');

        return {
            type: 'warning',
            title: '💡 Almost There!',
            message: `Add API keys for ${missing} to unlock ${pricing.savingsPercentage}% discount and save ₹${pricing.basePrice - pricing.byokPrice}/month!`
        };
    }

    return {
        type: 'info',
        title: '💰 Save with BYOK',
        message: `Add your own API keys to save ${Math.round(((pricing.basePrice - pricing.byokPrice) / pricing.basePrice) * 100)}% (₹${pricing.basePrice - pricing.byokPrice}/month)!`
    };
};

/**
 * Get required keys for a specific plan
 */
export const getRequiredKeysForPlan = (planId) => {
    const features = PLAN_REQUIRED_FEATURES[planId] || [];
    const allKeys = new Set();

    features.forEach(feature => {
        const keys = REQUIRED_KEYS_BY_FEATURE[feature] || [];
        keys.forEach(key => allKeys.add(key));
    });

    return Array.from(allKeys);
};

/**
 * Get missing keys for BYOK eligibility
 */
export const getMissingKeys = (userApiKeys, planId) => {
    const byokStatus = calculateBYOKStatus(userApiKeys, planId);

    if (byokStatus.isByok) return [];

    const missingKeys = [];

    byokStatus.missingFeatures.forEach(feature => {
        const requiredKeys = REQUIRED_KEYS_BY_FEATURE[feature] || [];
        const hasNone = !hasAnyKey(userApiKeys, requiredKeys);

        if (hasNone) {
            missingKeys.push({
                feature,
                options: requiredKeys,
                message: `Add at least one: ${requiredKeys.join(', ')}`
            });
        }
    });

    return missingKeys;
};

/**
 * Format feature name for display
 */
export const formatFeatureName = (feature) => {
    return feature
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get annual pricing with discount
 */
export const getAnnualPricing = (monthlyPrice, annualDiscount = 20) => {
    const monthlyTotal = monthlyPrice * 12;
    const discount = Math.round(monthlyTotal * (annualDiscount / 100));
    const annualPrice = monthlyTotal - discount;
    const effectiveMonthly = Math.round(annualPrice / 12);

    return {
        monthlyTotal,
        discount,
        annualPrice,
        effectiveMonthly,
        savingsPercentage: annualDiscount
    };
};
