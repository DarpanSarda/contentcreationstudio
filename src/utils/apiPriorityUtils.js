// src/utils/apiPriorityUtils.js

/**
 * API Priority Management Utilities
 * Handles priority ordering, validation, and fallback logic for API providers
 */

// Default priorities for each provider category
export const DEFAULT_PRIORITIES = {
    llm: {
        groq: 1,        // Default - fastest
        openai: 2,      // Fallback 1 - most capable
        anthropic: 3,   // Fallback 2 - Claude
        deepseek: 4,    // Fallback 3
        google: 5       // Fallback 4 - Gemini
    },
    search: {
        brave: 1,       // Default - privacy-focused
        tavily: 2,      // Fallback 1
        serper: 3       // Fallback 2
    },
    image: {
        stability: 1,   // Default - Stable Diffusion
        google: 2,      // Fallback 1 - Imagen
        openai: 3,      // Fallback 2 - DALL-E
        replicate: 4    // Fallback 3
    },
    video: {
        stability: 1,   // Default
        replicate: 2    // Fallback 1
    }
};

/**
 * Get providers sorted by priority
 * @param {Object} priorities - Priority object for a category
 * @param {Object} apiKeys - API keys object
 * @returns {Array} Sorted array of provider names
 */
export const getProvidersByPriority = (priorities, apiKeys) => {
    return Object.entries(priorities)
        .filter(([provider]) => apiKeys[provider]) // Only include configured providers
        .sort(([, a], [, b]) => a - b) // Sort by priority (lower = higher priority)
        .map(([provider]) => provider);
};

/**
 * Get priority for a specific provider
 * @param {string} category - Category (llm, search, image, video)
 * @param {string} provider - Provider name
 * @param {Object} customPriorities - Custom priorities (optional)
 * @returns {number} Priority number
 */
export const getProviderPriority = (category, provider, customPriorities = null) => {
    if (customPriorities && customPriorities[category] && customPriorities[category][provider]) {
        return customPriorities[category][provider];
    }
    return DEFAULT_PRIORITIES[category]?.[provider] || 999;
};

/**
 * Validate priority values
 * @param {Object} priorities - Priorities object
 * @returns {Object} Validated priorities
 */
export const validatePriorities = (priorities) => {
    const validated = {};

    for (const [category, providers] of Object.entries(priorities)) {
        validated[category] = {};

        for (const [provider, priority] of Object.entries(providers)) {
            // Ensure priority is a number between 1 and 999
            const num = parseInt(priority);
            validated[category][provider] = isNaN(num) ? 999 : Math.max(1, Math.min(999, num));
        }
    }

    return validated;
};

/**
 * Reorder providers based on drag and drop
 * @param {Array} providers - Array of provider objects
 * @param {number} startIndex - Start index
 * @param {number} endIndex - End index
 * @returns {Array} Reordered providers with updated priorities
 */
export const reorderProviders = (providers, startIndex, endIndex) => {
    const result = Array.from(providers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update priorities based on new order
    return result.map((provider, index) => ({
        ...provider,
        priority: index + 1
    }));
};

/**
 * Get provider display name
 * @param {string} provider - Provider key
 * @returns {string} Display name
 */
export const getProviderDisplayName = (provider) => {
    const names = {
        groq: 'Groq',
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        deepseek: 'DeepSeek',
        google: 'Google Gemini',
        brave: 'Brave Search',
        tavily: 'Tavily',
        serper: 'Serper',
        stability: 'Stability AI',
        replicate: 'Replicate'
    };
    return names[provider] || provider;
};

/**
 * Get provider category
 * @param {string} provider - Provider key
 * @returns {string} Category (llm, search, image, video)
 */
export const getProviderCategory = (provider) => {
    const llmProviders = ['groq', 'openai', 'anthropic', 'deepseek', 'google'];
    const searchProviders = ['brave', 'tavily', 'serper'];
    const imageProviders = ['stability', 'google', 'openai', 'replicate'];
    const videoProviders = ['stability', 'replicate'];

    if (llmProviders.includes(provider)) return 'llm';
    if (searchProviders.includes(provider)) return 'search';
    if (imageProviders.includes(provider)) return 'image';
    if (videoProviders.includes(provider)) return 'video';
    return 'unknown';
};

/**
 * Check if provider is configured
 * @param {string} provider - Provider key
 * @param {Object} apiKeys - API keys object
 * @returns {boolean} True if configured
 */
export const isProviderConfigured = (provider, apiKeys) => {
    return apiKeys[provider] && apiKeys[provider].trim().length > 0;
};

/**
 * Get configured providers for a category
 * @param {string} category - Category (llm, search, image, video)
 * @param {Object} apiKeys - API keys object
 * @returns {Array} Array of configured provider names
 */
export const getConfiguredProviders = (category, apiKeys) => {
    const categoryProviders = Object.keys(DEFAULT_PRIORITIES[category] || {});
    return categoryProviders.filter(provider => isProviderConfigured(provider, apiKeys));
};

/**
 * Format priority for display
 * @param {number} priority - Priority number
 * @returns {string} Formatted priority
 */
export const formatPriority = (priority) => {
    if (priority === 1) return '1st (Primary)';
    if (priority === 2) return '2nd (Fallback)';
    if (priority === 3) return '3rd (Fallback)';
    if (priority >= 999) return 'Disabled';
    return `${priority}th (Fallback)`;
};

/**
 * Get fallback chain description
 * @param {string} category - Category
 * @param {Object} priorities - Priorities object
 * @param {Object} apiKeys - API keys object
 * @returns {string} Fallback chain description
 */
export const getFallbackChain = (category, priorities, apiKeys) => {
    const providers = getProvidersByPriority(priorities[category] || DEFAULT_PRIORITIES[category], apiKeys);

    if (providers.length === 0) return 'No providers configured';
    if (providers.length === 1) return `${getProviderDisplayName(providers[0])} (no fallback)`;

    const chain = providers.map((p, i) => {
        if (i === 0) return getProviderDisplayName(p);
        return `→ ${getProviderDisplayName(p)}`;
    });

    return chain.join(' ');
};

/**
 * Merge custom priorities with defaults
 * @param {Object} customPriorities - Custom priorities
 * @returns {Object} Merged priorities
 */
export const mergePriorities = (customPriorities) => {
    const merged = JSON.parse(JSON.stringify(DEFAULT_PRIORITIES)); // Deep clone

    if (!customPriorities) return merged;

    for (const [category, providers] of Object.entries(customPriorities)) {
        if (merged[category]) {
            merged[category] = { ...merged[category], ...providers };
        }
    }

    return merged;
};
