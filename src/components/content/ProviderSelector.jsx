// src/components/content/ProviderSelector.jsx
'use client';

import { useState } from 'react';
import { Zap, ChevronDown, Info, CheckCircle } from 'lucide-react';
import { getProviderDisplayName, getConfiguredProviders } from '@/utils/apiPriorityUtils';

/**
 * Provider Selector Component
 * Allows users to select which AI provider to use for content generation
 */
export default function ProviderSelector({
    category = 'llm',
    value = 'auto',
    onChange,
    apiKeys = {},
    priorities = {},
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const configuredProviders = getConfiguredProviders(category, apiKeys);

    const getCategoryLabel = () => {
        const labels = {
            llm: 'Text Generation Provider',
            search: 'Search Provider',
            image: 'Image Generation Provider',
            video: 'Video Generation Provider'
        };
        return labels[category] || 'Provider';
    };

    const getCategoryDescription = () => {
        const descriptions = {
            llm: 'Select which AI model to use for generating text content',
            search: 'Select which search engine to use for research',
            image: 'Select which AI model to use for generating images',
            video: 'Select which AI model to use for generating videos'
        };
        return descriptions[category] || '';
    };

    const getProviderOptions = () => {
        const options = [
            { value: 'auto', label: 'Auto (Use Priority Order)', icon: Zap, recommended: true }
        ];

        configuredProviders.forEach(provider => {
            options.push({
                value: provider,
                label: getProviderDisplayName(provider),
                priority: priorities[category]?.[provider] || 999
            });
        });

        return options.sort((a, b) => {
            if (a.value === 'auto') return -1;
            if (b.value === 'auto') return 1;
            return (a.priority || 999) - (b.priority || 999);
        });
    };

    const selectedOption = getProviderOptions().find(opt => opt.value === value);

    if (configuredProviders.length === 0) {
        return (
            <div className="p-4 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-accent-orange">No Providers Configured</p>
                        <p className="text-xs text-text-muted mt-1">
                            Please configure at least one {category} provider in Settings → API Keys
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-text-light">
                {getCategoryLabel()}
            </label>

            {/* Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
            w-full flex items-center justify-between gap-3 px-4 py-3 
            bg-card-bg/20 border border-white/20 rounded-lg
            hover:border-white/30 transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <div className="flex items-center gap-3">
                        {selectedOption?.icon && <selectedOption.icon className="w-5 h-5 text-accent-cyan" />}
                        <div className="text-left">
                            <p className="text-sm font-medium text-text-light">
                                {selectedOption?.label || 'Select Provider'}
                            </p>
                            {selectedOption?.recommended && (
                                <p className="text-xs text-accent-cyan">
                                    Recommended - Automatic fallback enabled
                                </p>
                            )}
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Options */}
                        <div className="absolute z-50 w-full mt-2 bg-card-bg border border-white/20 rounded-lg shadow-xl overflow-hidden">
                            {getProviderOptions().map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3
                    hover:bg-white/10 transition-colors text-left
                    ${value === option.value ? 'bg-accent-cyan/10' : ''}
                  `}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {option.icon && <option.icon className="w-5 h-5 text-accent-cyan" />}
                                        <div>
                                            <p className="text-sm font-medium text-text-light">
                                                {option.label}
                                            </p>
                                            {option.recommended && (
                                                <p className="text-xs text-accent-cyan">
                                                    Tries providers in priority order
                                                </p>
                                            )}
                                            {option.priority && option.priority !== 999 && (
                                                <p className="text-xs text-text-muted">
                                                    Priority #{option.priority}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {value === option.value && (
                                        <CheckCircle className="w-5 h-5 text-accent-cyan" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Description */}
            <p className="text-xs text-text-muted">
                {getCategoryDescription()}
                {value === 'auto' && configuredProviders.length > 1 && (
                    <> • Will automatically fall back if the primary provider fails</>
                )}
            </p>
        </div>
    );
}
