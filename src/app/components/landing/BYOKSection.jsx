// components/landing/BYOKSection.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingDown, Check, X, Sparkles, Calculator, Shield, Zap } from 'lucide-react';

export default function BYOKSection() {
    const [selectedPlan, setSelectedPlan] = useState('starter');

    const plans = {
        starter: { managed: 1499, byok: 299, savings: 1200 },
        growth: { managed: 2999, byok: 599, savings: 2400 },
        professional: { managed: 4999, byok: 999, savings: 4000 }
    };

    const currentPlan = plans[selectedPlan];

    return (
        <section className="relative py-20 bg-gradient-to-br from-accent-cyan/5 via-dark-bg to-accent-purple/5">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                        <TrendingDown className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Save 80% on Your Subscription</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Why Pay More?
                        <span className="text-green-500"> Bring Your Own API Keys</span>
                    </h2>

                    <p className="text-xl text-text-muted max-w-3xl mx-auto">
                        Get the same powerful features at 80% off by using your own OpenAI, Anthropic, Google, and other API keys.
                        Full transparency, full control, massive savings.
                    </p>
                </div>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Managed Service */}
                    <div className="glass rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-text-light">Managed Service</h3>
                            <div className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-sm rounded-full">
                                Standard
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-5xl font-bold text-text-light mb-2">
                                ₹{currentPlan.managed.toLocaleString()}
                                <span className="text-lg text-text-muted">/month</span>
                            </div>
                            <p className="text-sm text-text-muted">We handle all API costs</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted">All features included</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted">No setup required</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted">Instant start</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted">We manage API costs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <X className="w-5 h-5 text-text-muted/50 flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted/50">No cost transparency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <X className="w-5 h-5 text-text-muted/50 flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted/50">Higher monthly cost</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 bg-card-bg/40 hover:bg-card-bg/60 border border-white/20 text-text-light rounded-lg font-semibold transition-all">
                            Choose Managed
                        </button>
                    </div>

                    {/* BYOK */}
                    <div className="glass rounded-2xl p-8 border-2 border-green-500/50 relative overflow-hidden">
                        {/* Popular badge */}
                        <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-accent-cyan text-dark-bg px-4 py-1 text-sm font-bold rounded-bl-lg">
                            SAVE 80%
                        </div>

                        <div className="flex items-center justify-between mb-6 mt-4">
                            <h3 className="text-2xl font-bold text-text-light">Bring Your Own Keys</h3>
                            <div className="px-3 py-1 bg-green-500/20 text-green-500 text-sm rounded-full">
                                Recommended
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-2xl text-text-muted line-through">
                                    ₹{currentPlan.managed.toLocaleString()}
                                </span>
                                <span className="text-5xl font-bold text-green-500">
                                    ₹{currentPlan.byok.toLocaleString()}
                                </span>
                                <span className="text-lg text-text-muted">/month</span>
                            </div>
                            <p className="text-sm text-green-500 font-semibold">
                                Save ₹{currentPlan.savings.toLocaleString()}/month • ₹{(currentPlan.savings * 12).toLocaleString()}/year
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">All features included</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">80% cost savings</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">Full cost transparency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">You control API usage</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">Use your own keys</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-text-light font-medium">Switch anytime</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 bg-gradient-to-r from-green-500 to-accent-cyan hover:opacity-90 text-dark-bg rounded-lg font-semibold transition-all hover:scale-105">
                            Choose BYOK & Save 80%
                        </button>
                    </div>
                </div>

                {/* Savings Calculator */}
                <div className="glass rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="w-6 h-6 text-accent-cyan" />
                        <h3 className="text-2xl font-bold text-text-light">Calculate Your Savings</h3>
                    </div>

                    {/* Plan Selector */}
                    <div className="flex gap-4 mb-8">
                        {Object.keys(plans).map((plan) => (
                            <button
                                key={plan}
                                onClick={() => setSelectedPlan(plan)}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${selectedPlan === plan
                                        ? 'bg-accent-cyan text-dark-bg'
                                        : 'bg-card-bg/40 text-text-muted hover:bg-card-bg/60'
                                    }`}
                            >
                                {plan.charAt(0).toUpperCase() + plan.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Savings Breakdown */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-card-bg/20 rounded-xl">
                            <div className="text-sm text-text-muted mb-2">Monthly Savings</div>
                            <div className="text-3xl font-bold text-green-500">
                                ₹{currentPlan.savings.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center p-6 bg-card-bg/20 rounded-xl">
                            <div className="text-sm text-text-muted mb-2">Annual Savings</div>
                            <div className="text-3xl font-bold text-green-500">
                                ₹{(currentPlan.savings * 12).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center p-6 bg-card-bg/20 rounded-xl">
                            <div className="text-sm text-text-muted mb-2">Discount</div>
                            <div className="text-3xl font-bold text-green-500">
                                80%
                            </div>
                        </div>
                    </div>
                </div>

                {/* How BYOK Works */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-cyan">1</span>
                        </div>
                        <h4 className="text-lg font-bold text-text-light mb-2">Add Your API Keys</h4>
                        <p className="text-sm text-text-muted">
                            Connect your OpenAI, Anthropic, Google, and other API keys in Settings
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-accent-purple/10 border border-accent-purple/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-purple">2</span>
                        </div>
                        <h4 className="text-lg font-bold text-text-light mb-2">Automatic Discount</h4>
                        <p className="text-sm text-text-muted">
                            Get instant 80% off when you provide all required keys for your plan
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-green-500">3</span>
                        </div>
                        <h4 className="text-lg font-bold text-text-light mb-2">Start Saving</h4>
                        <p className="text-sm text-text-muted">
                            Enjoy all features at 80% off while maintaining full control
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-accent-cyan hover:opacity-90 text-dark-bg px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                    >
                        <TrendingDown className="w-5 h-5" />
                        View Full Pricing & Start Saving
                        <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
