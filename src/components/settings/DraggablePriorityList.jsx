// src/components/settings/DraggablePriorityList.jsx
'use client';

import { useState } from 'react';
import { GripVertical, CheckCircle, XCircle } from 'lucide-react';
import { getProviderDisplayName } from '@/utils/apiPriorityUtils';

/**
 * Draggable Priority List Component
 * Allows drag-and-drop reordering of providers
 */
export default function DraggablePriorityList({
    providers,
    apiKeys,
    onReorder,
    category = 'llm'
}) {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Filter to only show configured providers
    const configuredProviders = providers.filter(p => apiKeys[p.id] && apiKeys[p.id].trim().length > 0);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newProviders = [...configuredProviders];
        const [draggedItem] = newProviders.splice(draggedIndex, 1);
        newProviders.splice(dropIndex, 0, draggedItem);

        // Update priorities based on new order
        const reordered = newProviders.map((provider, index) => ({
            ...provider,
            priority: index + 1
        }));

        onReorder(reordered);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    if (configuredProviders.length === 0) {
        return (
            <div className="p-6 text-center border-2 border-dashed border-white/10 rounded-lg">
                <p className="text-sm text-text-muted">
                    No providers configured yet. Add API keys above to manage priorities.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-xs text-text-muted mb-3">
                Drag and drop to reorder providers. Top = highest priority.
            </p>

            {configuredProviders.map((provider, index) => (
                <div
                    key={provider.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`
            flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move
            ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
            ${dragOverIndex === index ? 'border-accent-cyan bg-accent-cyan/10' : 'border-white/10 bg-card-bg/20'}
            ${index === 0 ? 'border-green-500/30 bg-green-500/10' : ''}
            hover:border-white/30 hover:bg-card-bg/30
          `}
                >
                    {/* Drag Handle */}
                    <GripVertical className="w-5 h-5 text-text-muted flex-shrink-0 cursor-grab active:cursor-grabbing" />

                    {/* Priority Number */}
                    <div className={`
            flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
            ${index === 0 ? 'bg-green-500/20 text-green-500' : 'bg-card-bg/40 text-text-muted'}
          `}>
                        {index + 1}
                    </div>

                    {/* Provider Name */}
                    <div className="flex-1">
                        <p className="text-sm font-medium text-text-light">
                            {getProviderDisplayName(provider.id)}
                        </p>
                        <p className="text-xs text-text-muted">
                            {index === 0 ? 'Primary provider' : `Fallback #${index}`}
                        </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        {provider.enabled ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-text-muted" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
