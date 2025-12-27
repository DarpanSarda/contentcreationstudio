// src/components/settings/PriorityInput.jsx
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

/**
 * Priority Input Component
 * Allows users to set priority for API providers with number input and increment/decrement buttons
 */
export default function PriorityInput({
    value,
    onChange,
    min = 1,
    max = 10,
    disabled = false,
    showLabel = true,
    className = ''
}) {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleInputChange = (e) => {
        const num = parseInt(e.target.value);
        if (!isNaN(num) && num >= min && num <= max) {
            onChange(num);
        }
    };

    const getPriorityColor = () => {
        if (value === 1) return 'text-green-500 border-green-500/30 bg-green-500/10';
        if (value === 2) return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        if (value === 3) return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
        return 'text-text-muted border-white/20 bg-card-bg/20';
    };

    const getPriorityLabel = () => {
        if (value === 1) return 'Primary';
        if (value === 2) return '1st Fallback';
        if (value === 3) return '2nd Fallback';
        return `${value - 1}th Fallback`;
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {showLabel && (
                <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-text-light">
                        Priority
                    </label>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <Info className="w-3 h-3 text-text-muted cursor-help" />
                        {showTooltip && (
                            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card-bg border border-white/20 rounded-lg shadow-lg w-48">
                                <p className="text-xs text-text-light">
                                    Lower number = higher priority. System tries providers in order.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2">
                {/* Priority Number Input */}
                <div className={`flex items-center border rounded-lg overflow-hidden ${getPriorityColor()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={disabled || value <= min}
                        className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    <input
                        type="number"
                        value={value}
                        onChange={handleInputChange}
                        min={min}
                        max={max}
                        disabled={disabled}
                        className="w-12 text-center font-bold text-lg bg-transparent border-none outline-none"
                    />

                    <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={disabled || value >= max}
                        className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                </div>

                {/* Priority Label */}
                <span className="text-xs font-medium text-text-muted whitespace-nowrap">
                    {getPriorityLabel()}
                </span>
            </div>
        </div>
    );
}
