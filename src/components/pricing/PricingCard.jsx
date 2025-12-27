// src/components/pricing/PricingCard.jsx
'use client';

export default function PricingCard({ plan, isPopular, showByokPricing, billingCycle = 'monthly', onSelectPlan }) {
    // Calculate price based on billing cycle and BYOK
    const getPrice = () => {
        if (plan.id === 'enterprise') return null; // Custom pricing

        const basePrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
        const byokPrice = billingCycle === 'annual' ? plan.priceAnnual * 0.2 : plan.priceByok;

        return showByokPricing ? byokPrice : basePrice;
    };

    const price = getPrice();
    const originalPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
    const savingsPercentage = showByokPricing ? 80 : 0;

    return (
        <div
            className={`relative glass rounded-2xl border ${isPopular
                    ? 'border-accent-cyan shadow-lg shadow-accent-cyan/20'
                    : 'border-white/10'
                } p-6 hover:border-accent-cyan/50 transition-all duration-300 flex flex-col`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-cyan text-dark-bg text-sm font-bold rounded-full">
                    Most Popular
                </div>
            )}

            {/* Plan Name & Price */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-text-light mb-2">{plan.name}</h3>

                {price !== null ? (
                    <>
                        <div className="flex items-end justify-center gap-2 mb-2">
                            <span className="text-5xl font-bold text-text-light">
                                ₹{Math.round(price).toLocaleString()}
                            </span>
                            <span className="text-text-muted mb-2">/month</span>
                        </div>

                        {showByokPricing && (
                            <div className="text-sm">
                                <span className="text-text-muted line-through">
                                    ₹{originalPrice.toLocaleString()}
                                </span>
                                <span className="text-green-500 ml-2 font-semibold">
                                    {savingsPercentage}% off
                                </span>
                            </div>
                        )}

                        {billingCycle === 'annual' && !showByokPricing && (
                            <div className="text-sm text-green-500 font-medium">
                                Save ₹{(plan.priceMonthly * 12 - plan.priceAnnual).toLocaleString()}/year
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-2xl font-bold text-text-light mb-2">
                        Custom Pricing
                    </div>
                )}
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6 flex-grow">
                {plan.featureList.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-muted">
                        <svg
                            className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
                        ? 'bg-accent-cyan text-dark-bg hover:bg-opacity-90'
                        : 'bg-card-bg/40 text-text-light hover:bg-card-bg/60 border border-white/20'
                    }`}
            >
                {plan.cta}
            </button>
        </div>
    );
}
