// src/components/settings/PriorityOrderSummary.jsx
'use client';

import { ArrowRight, Star, AlertCircle } from 'lucide-react';
import { getProviderDisplayName, getProvidersByPriority } from '@/utils/apiPriorityUtils';

/**
 * Priority Order Summary Component
 * Displays the fallback chain for a category of providers
 */
export default function PriorityOrderSummary({
    category,
    priorities,
    apiKeys,
    title = 'Provider Priority Order'
}) {
    const configuredProviders = getProvidersByPriority(priorities, apiKeys);

    if (configuredProviders.length === 0) {
        return (
            <div className="p-4 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-accent-orange">No Providers Configured</p>
                        <p className="text-xs text-text-muted mt-1">
                            Add at least one API key above to enable {category} functionality.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
            <p className="text-sm font-medium text-accent-purple mb-3">
                {title}
            </p>

            {/* Priority Chain */}
            <div className="flex flex-wrap items-center gap-2">
                {configuredProviders.map((provider, index) => (
                    <div key={provider} className="flex items-center gap-2">
                        {/* Provider Badge */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${index === 0
                                ? 'bg-green-500/20 border-green-500/30 text-green-500'
                                : 'bg-card-bg/40 border-white/10 text-text-light'
                            }`}>
                            {index === 0 && (
                                <Star className="w-3 h-3 fill-current" />
                            )}
                            <span className="text-xs font-bold">
                                #{priorities[provider]}
                            </span>
                            <span className="text-sm font-medium">
                                {getProviderDisplayName(provider)}
                            </span>
                        </div>

                        {/* Arrow */}
                        {index < configuredProviders.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-text-muted" />
                        )}
                    </div>
                ))}
            </div>

            {/* Explanation */}
            <p className="text-xs text-text-muted mt-3">
                {configuredProviders.length === 1 ? (
                    <>Only <strong>{getProviderDisplayName(configuredProviders[0])}</strong> is configured (no fallback available)</>
                ) : (
                    <>
                        System will try <strong>{getProviderDisplayName(configuredProviders[0])}</strong> first.
                        If it fails, it will automatically fall back to the next provider in order.
                    </>
                )}
            </p>
        </div>
    );
}
