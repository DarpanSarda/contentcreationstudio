// src/app/pricing/page.jsx
'use client';

import { useState } from 'react';
import { Check, X, TrendingDown } from 'lucide-react';
import PricingCard from '@/components/pricing/PricingCard';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionPlans';

export default function PricingPage() {
    const [showByokPricing, setShowByokPricing] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = Object.values(SUBSCRIPTION_PLANS).filter(p => p.id !== 'free');

    const handleSelectPlan = (plan) => {
        console.log('Selected plan:', plan.id, 'BYOK:', showByokPricing);
        // Navigate to checkout or signup
    };

    return (
        <div className="min-h-screen bg-dark-bg py-20 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-text-light mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Choose the perfect plan for your content creation needs. Save 80% by bringing your own API keys.
                    </p>
                </div>

                {/* BYOK Toggle */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    {/* Billing Cycle Toggle */}
                    <div className="flex items-center gap-4 p-1 bg-card-bg/20 rounded-lg border border-white/10">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'monthly'
                                    ? 'bg-accent-cyan text-dark-bg'
                                    : 'text-text-muted hover:text-text-light'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'annual'
                                    ? 'bg-accent-cyan text-dark-bg'
                                    : 'text-text-muted hover:text-text-light'
                                }`}
                        >
                            Annual
                            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>

                    {/* BYOK Toggle */}
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium transition-colors ${!showByokPricing ? 'text-text-light' : 'text-text-muted'
                            }`}>
                            Managed Service
                        </span>

                        <button
                            onClick={() => setShowByokPricing(!showByokPricing)}
                            className={`relative w-16 h-8 rounded-full transition-all ${showByokPricing ? 'bg-accent-cyan' : 'bg-card-bg/40 border border-white/20'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${showByokPricing ? 'translate-x-8' : ''
                                }`} />
                        </button>

                        <span className={`text-sm font-medium transition-colors ${showByokPricing ? 'text-text-light' : 'text-text-muted'
                            }`}>
                            Bring Your Own Keys
                        </span>
                    </div>

                    {/* BYOK Info Banner */}
                    {showByokPricing && (
                        <div className="max-w-2xl p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-start gap-3">
                                <TrendingDown className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-500 mb-1">
                                        Save 80% with BYOK!
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        Provide your own API keys for LLM, Search, Image, and Video generation to unlock massive savings.
                                        You maintain full control over your API usage and costs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isPopular={plan.popular}
                            showByokPricing={showByokPricing}
                            billingCycle={billingCycle}
                            onSelectPlan={handleSelectPlan}
                        />
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="glass rounded-2xl border border-white/10 p-8">
                    <h2 className="text-2xl font-bold text-text-light mb-2 text-center">
                        Complete Feature Comparison
                    </h2>
                    <p className="text-text-muted text-center mb-8">
                        Compare all features across our plans to find the perfect fit
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-accent-cyan/30">
                                    <th className="text-left py-4 px-4 text-text-light font-bold">Feature</th>
                                    {plans.map(plan => (
                                        <th key={plan.id} className="text-center py-4 px-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-text-light font-bold">{plan.name}</span>
                                                {plan.popular && (
                                                    <span className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs rounded-full">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Content Generation */}
                                <tr className="border-b border-white/5 bg-accent-purple/5">
                                    <td colSpan={5} className="py-3 px-4 text-accent-purple font-semibold text-sm">
                                        📝 CONTENT GENERATION
                                    </td>
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Content Pieces/Month</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4 text-text-light font-medium">
                                            {plan.features.contentPieces === 999999 ? (
                                                <span className="text-accent-cyan">Unlimited</span>
                                            ) : (
                                                plan.features.contentPieces
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">AI Research & Writing</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Image Generation</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.imageGeneration > 0 ? (
                                                <span className="text-text-light font-medium">
                                                    {plan.features.imageGeneration === 999999 ? (
                                                        <span className="text-accent-cyan">Unlimited</span>
                                                    ) : (
                                                        `${plan.features.imageGeneration}/mo`
                                                    )}
                                                </span>
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Video Generation</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.videoGeneration > 0 ? (
                                                <span className="text-text-light font-medium">
                                                    {plan.features.videoGeneration === 999999 ? (
                                                        <span className="text-accent-cyan">Unlimited</span>
                                                    ) : (
                                                        `${plan.features.videoGeneration}/mo`
                                                    )}
                                                </span>
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                {/* Platform & Publishing */}
                                <tr className="border-b border-white/5 bg-accent-orange/5">
                                    <td colSpan={5} className="py-3 px-4 text-accent-orange font-semibold text-sm">
                                        🚀 PLATFORM & PUBLISHING
                                    </td>
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Platform Connections</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4 text-text-light font-medium">
                                            {plan.features.platforms === 999 ? (
                                                <span className="text-accent-cyan">Unlimited</span>
                                            ) : (
                                                plan.features.platforms
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Content Scheduling</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.scheduling ? (
                                                <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Custom Branding</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.customBranding ? (
                                                <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                {/* Analytics & Insights */}
                                <tr className="border-b border-white/5 bg-accent-cyan/5">
                                    <td colSpan={5} className="py-3 px-4 text-accent-cyan font-semibold text-sm">
                                        📊 ANALYTICS & INSIGHTS
                                    </td>
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Analytics Dashboard</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4 text-text-light capitalize font-medium">
                                            {plan.features.analytics}
                                        </td>
                                    ))}
                                </tr>

                                {/* Team & Collaboration */}
                                <tr className="border-b border-white/5 bg-accent-green/5">
                                    <td colSpan={5} className="py-3 px-4 text-accent-green font-semibold text-sm">
                                        👥 TEAM & COLLABORATION
                                    </td>
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Team Members</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4 text-text-light font-medium">
                                            {plan.features.teamMembers === 999 ? (
                                                <span className="text-accent-cyan">Unlimited</span>
                                            ) : (
                                                plan.features.teamMembers
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                {/* Support & API */}
                                <tr className="border-b border-white/5 bg-accent-yellow/5">
                                    <td colSpan={5} className="py-3 px-4 text-accent-yellow font-semibold text-sm">
                                        🛠️ SUPPORT & API
                                    </td>
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Support Level</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4 text-text-light capitalize font-medium">
                                            {plan.features.support.replace(/-/g, ' ')}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">API Access</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.apiAccess ? (
                                                <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="hover:bg-card-bg/10 transition-colors">
                                    <td className="py-4 px-4 text-text-muted">Priority Support</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-4">
                                            {plan.features.prioritySupport ? (
                                                <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-text-muted/50 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-text-light mb-8 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        <details className="glass rounded-lg border border-white/10 p-6">
                            <summary className="font-semibold text-text-light cursor-pointer">
                                What is BYOK (Bring Your Own Keys)?
                            </summary>
                            <p className="mt-3 text-text-muted text-sm">
                                BYOK allows you to use your own API keys for AI services (OpenAI, Anthropic, Google, etc.) instead of using our managed infrastructure.
                                This gives you 80% discount on your subscription while maintaining full control over your API usage.
                            </p>
                        </details>

                        <details className="glass rounded-lg border border-white/10 p-6">
                            <summary className="font-semibold text-text-light cursor-pointer">
                                What happens if I don't provide all required API keys?
                            </summary>
                            <p className="mt-3 text-text-muted text-sm">
                                If you don't provide all required keys, you'll use our managed service at the standard price.
                                We'll seamlessly handle the API calls for features where you haven't provided keys.
                                You can add your keys anytime to switch to BYOK pricing.
                            </p>
                        </details>

                        <details className="glass rounded-lg border border-white/10 p-6">
                            <summary className="font-semibold text-text-light cursor-pointer">
                                Can I switch between Managed and BYOK?
                            </summary>
                            <p className="mt-3 text-text-muted text-sm">
                                Yes! You can add or remove your API keys at any time. Your pricing will automatically adjust based on your BYOK status.
                                If you provide all required keys, you'll get the 80% discount starting from your next billing cycle.
                            </p>
                        </details>

                        <details className="glass rounded-lg border border-white/10 p-6">
                            <summary className="font-semibold text-text-light cursor-pointer">
                                What's included in the 14-day free trial?
                            </summary>
                            <p className="mt-3 text-text-muted text-sm">
                                All paid plans include a 14-day free trial with full access to all features.
                                No credit card required to start. You can test both Managed and BYOK modes during your trial.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}