import React, { useState } from 'react';
import { Check, ChevronDown, CheckCircle2, Loader2, Search } from 'lucide-react';

export function ToolIndicator({ toolName, args, result }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Format tool name for display
    const formatName = (name) => {
        if (name === "search_inventory") return "Searching Inventory";
        if (name === "get_car_details") return "Verifying Car Details";
        if (name === "capture_lead") return "Saving Lead Info";
        return name;
    };

    // Format args for display
    const formatArgs = (args) => {
        if (!args) return "";
        return Object.entries(args)
            .filter(([_, v]) => v)
            .map(([k, v]) => {
                if (k === 'year' && Array.isArray(v)) return `${v[0]}-${v[1]}`;
                return v;
            })
            .join(", ");
    };

    return (
        <div className="w-full max-w-[85%] md:max-w-[70%] mb-2 animate-fade-in-up">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/80 border border-indigo-100 rounded-lg p-2.5 cursor-pointer hover:bg-white transition-all shadow-sm flex items-center justify-between group"
            >
                <div className="flex items-center gap-2.5">
                    <div className="bg-indigo-50 text-indigo-500 p-1.5 rounded-full">
                        {toolName === 'search_inventory' ? <Search size={14} /> : <CheckCircle2 size={14} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-indigo-950 flex items-center gap-1.5">
                            {formatName(toolName)}
                            <Loader2 size={10} className="text-indigo-300 animate-spin opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[10px] text-indigo-400 font-medium">
                            {formatArgs(args) || "Checking database..."}
                        </span>
                    </div>
                </div>
                <ChevronDown
                    size={14}
                    className={`text-indigo-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Expanded Result View */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="bg-indigo-50/50 rounded-lg p-3 text-[11px] font-mono text-indigo-900 overflow-y-auto max-h-40 border border-indigo-100/50">
                    <pre className="whitespace-pre-wrap font-medium">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
