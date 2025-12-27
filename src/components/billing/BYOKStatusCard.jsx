// src/components/billing/BYOKStatusCard.jsx
'use client';

import { CheckCircle, XCircle, AlertCircle, Info, TrendingDown } from 'lucide-react';
import { calculateBYOKStatus, getBYOKMessage, formatFeatureName } from '@/utils/byokPricingUtils';

/**
 * BYOK Status Card Component
 * Displays user's BYOK status and potential savings
 */
export default function BYOKStatusCard({
    userApiKeys = {},
    currentPlan = { id: 'starter' },
    pricing = null
}) {
    const byokStatus = calculateBYOKStatus(userApiKeys, currentPlan.id);
    const message = getBYOKMessage(byokStatus, pricing || { discount: 0, savingsPercentage: 0, basePrice: 0, byokPrice: 0 });

    const getStatusColor = () => {
        if (byokStatus.isByok) return 'green';
        if (byokStatus.isHybrid) return 'yellow';
        return 'purple';
    };

    const statusColor = getStatusColor();
    const colorClasses = {
        green: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            text: 'text-green-500',
            badge: 'bg-green-500/20 text-green-500'
        },
        yellow: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            text: 'text-yellow-500',
            badge: 'bg-yellow-500/20 text-yellow-500'
        },
        purple: {
            bg: 'bg-accent-purple/10',
            border: 'border-accent-purple/20',
            text: 'text-accent-purple',
            badge: 'bg-accent-purple/20 text-accent-purple'
        }
    };

    const colors = colorClasses[statusColor];

    return (
        <div className={`glass rounded-xl border ${colors.border} p-6`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-light">BYOK Status</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                    {byokStatus.isByok ? 'Full BYOK' : byokStatus.isHybrid ? 'Partial' : 'Managed'}
                </span>
            </div>

            {/* Coverage Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-muted">API Coverage</span>
                    <span className={`font-medium ${colors.text}`}>
                        {byokStatus.coveredFeatures}/{byokStatus.totalFeatures} Features
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-card-bg/40 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bg.replace('/10', '/50')} transition-all duration-500`}
                        style={{ width: `${byokStatus.coveragePercentage}%` }}
                    />
                </div>
            </div>

            {/* Feature Coverage Breakdown */}
            <div className="space-y-2 mb-4">
                {Object.entries(byokStatus.coverage).map(([feature, covered]) => (
                    <div key={feature} className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">
                            {formatFeatureName(feature)}
                        </span>
                        {covered ? (
                            <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Your Keys</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-text-muted">
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Managed</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message */}
            <div className={`p-4 ${colors.bg} rounded-lg border ${colors.border}`}>
                <div className="flex items-start gap-3">
                    {message.type === 'success' && <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}
                    {message.type === 'warning' && <AlertCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}
                    {message.type === 'info' && <Info className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}

                    <div>
                        <p className={`text-sm font-medium ${colors.text} mb-1`}>
                            {message.title}
                        </p>
                        <p className="text-xs text-text-muted">
                            {message.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Savings Indicator */}
            {pricing && pricing.discount > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                        Saving ₹{pricing.discount.toLocaleString()}/month
                    </span>
                </div>
            )}
        </div>
    );
}
