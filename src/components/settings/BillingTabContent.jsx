// src/components/settings/BillingTabContent.jsx
'use client';

import { useState } from 'react';
import { CreditCard, Calendar, TrendingDown, AlertCircle, ExternalLink, Download } from 'lucide-react';
import BYOKStatusCard from '@/components/billing/BYOKStatusCard';
import { calculatePricing } from '@/utils/byokPricingUtils';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionPlans';

/**
 * Billing Tab Content Component
 * Shows subscription details, BYOK status, and payment history
 */
export default function BillingTabContent({ userApiKeys = {}, currentPlanId = 'starter' }) {
    const [showCancelModal, setShowCancelModal] = useState(false);

    const currentPlan = SUBSCRIPTION_PLANS[currentPlanId] || SUBSCRIPTION_PLANS.starter;
    const pricing = calculatePricing(currentPlan, userApiKeys);

    // Mock payment history
    const paymentHistory = [
        { id: 1, date: '2024-12-01', amount: pricing.finalPrice, status: 'paid', invoice: '#INV-001' },
        { id: 2, date: '2024-11-01', amount: pricing.finalPrice, status: 'paid', invoice: '#INV-002' },
        { id: 3, date: '2024-10-01', amount: pricing.finalPrice, status: 'paid', invoice: '#INV-003' },
    ];

    const nextBillingDate = '2025-01-01';

    return (
        <div className="space-y-6">
            {/* Current Subscription */}
            <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-6">
                    Current Subscription
                </h3>

                <div className="space-y-4">
                    {/* Plan Name */}
                    <div className="flex justify-between items-center">
                        <span className="text-text-muted">Plan</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-text-light text-lg">
                                {currentPlan.name}
                            </span>
                            {pricing.isByok && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                                    BYOK
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text-muted">Base Price</span>
                            <span className="text-text-light">
                                ₹{pricing.basePrice.toLocaleString()}/month
                            </span>
                        </div>

                        {pricing.discount > 0 && (
                            <>
                                <div className="flex justify-between text-green-500">
                                    <span className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4" />
                                        BYOK Discount ({pricing.savingsPercentage}%)
                                    </span>
                                    <span>-₹{pricing.discount.toLocaleString()}</span>
                                </div>

                                <div className="text-xs text-text-muted pl-6">
                                    You're using your own API keys for all services
                                </div>
                            </>
                        )}

                        <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                            <span className="text-text-light">Total</span>
                            <span className="text-accent-cyan">
                                ₹{pricing.finalPrice.toLocaleString()}/month
                            </span>
                        </div>
                    </div>

                    {/* Next Billing */}
                    <div className="flex items-center justify-between p-4 bg-card-bg/20 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-accent-cyan" />
                            <div>
                                <p className="text-sm font-medium text-text-light">Next Billing Date</p>
                                <p className="text-xs text-text-muted">{nextBillingDate}</p>
                            </div>
                        </div>
                        <span className="font-bold text-text-light">
                            ₹{pricing.finalPrice.toLocaleString()}
                        </span>
                    </div>

                    {/* Savings Alert */}
                    {pricing.discount > 0 && (
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <p className="text-sm text-green-500 text-center font-medium">
                                🎉 You're saving ₹{pricing.discount.toLocaleString()}/month with BYOK!
                            </p>
                            <p className="text-xs text-text-muted text-center mt-1">
                                That's ₹{(pricing.discount * 12).toLocaleString()}/year in savings!
                            </p>
                        </div>
                    )}

                    {/* Potential Savings Alert */}
                    {!pricing.isByok && pricing.isHybrid && (
                        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-500 mb-1">
                                        Unlock Full BYOK Discount
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        Add the remaining API keys to save ₹{(pricing.basePrice - pricing.byokPrice).toLocaleString()}/month ({Math.round(((pricing.basePrice - pricing.byokPrice) / pricing.basePrice) * 100)}% off)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!pricing.isByok && !pricing.isHybrid && (
                        <div className="p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
                            <div className="flex items-start gap-3">
                                <TrendingDown className="w-5 h-5 text-accent-purple flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-accent-purple mb-1">
                                        Save 80% with BYOK
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        Add your own API keys to reduce your monthly cost to just ₹{pricing.byokPrice.toLocaleString()}/month
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button className="flex-1 px-4 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all">
                        Upgrade Plan
                    </button>
                    <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-4 py-2 border border-white/20 text-text-light hover:bg-card-bg/20 rounded-lg font-medium transition-all"
                    >
                        Cancel Subscription
                    </button>
                </div>
            </div>

            {/* BYOK Status */}
            <BYOKStatusCard
                userApiKeys={userApiKeys}
                currentPlan={currentPlan}
                pricing={pricing}
            />

            {/* Payment Method */}
            <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">
                    Payment Method
                </h3>

                <div className="flex items-center justify-between p-4 bg-card-bg/20 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-light">•••• •••• •••• 4242</p>
                            <p className="text-xs text-text-muted">Expires 12/25</p>
                        </div>
                    </div>
                    <button className="text-sm text-accent-cyan hover:underline">
                        Update
                    </button>
                </div>
            </div>

            {/* Payment History */}
            <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">
                    Payment History
                </h3>

                <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex items-center justify-between p-4 bg-card-bg/20 rounded-lg border border-white/10"
                        >
                            <div>
                                <p className="text-sm font-medium text-text-light">{payment.invoice}</p>
                                <p className="text-xs text-text-muted">{payment.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-text-light">
                                    ₹{payment.amount.toLocaleString()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'paid'
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {payment.status}
                                </span>
                                <button className="text-accent-cyan hover:underline text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 border border-white/20 text-text-light hover:bg-card-bg/20 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    View All Invoices
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="glass rounded-xl border border-white/10 p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-text-light mb-4">
                            Cancel Subscription?
                        </h3>
                        <p className="text-text-muted mb-6">
                            Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end of your billing cycle.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 border border-white/20 text-text-light hover:bg-card-bg/20 rounded-lg font-medium transition-all"
                            >
                                Keep Subscription
                            </button>
                            <button className="flex-1 px-4 py-2 bg-red-500 hover:bg-opacity-90 text-white rounded-lg font-medium transition-all">
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
