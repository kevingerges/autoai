import React from 'react';
import { CarCard } from './CarCard';

export function ChatMessage({ message, idx, onCarClick }) {
    return (
        <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} slide-in`} style={{ animationDelay: `${idx * 0.1}s` }}>
            {/* Bubbles */}
            <div className="flex flex-col gap-2 w-full">
                {message.content.split("\n").filter(line => line.trim() !== "").map((line, i) => (
                    <div
                        key={i}
                        className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed animate-fade-in-up ${message.role === 'user'
                            ? 'bg-accent text-accent-foreground rounded-br-none self-end'
                            : 'bg-card border border-border text-foreground rounded-bl-none self-start'
                            }`}
                    >
                        {line}
                    </div>
                ))}
            </div>

            {/* Inventory Cards (if any attached to this message) */}
            {message.cards && message.cards.length > 0 && (
                <div className="flex gap-4 overflow-x-auto w-full py-4 px-2 snap-x">
                    {message.cards.map(car => (
                        <CarCard key={car.id} car={car} onClick={onCarClick} />
                    ))}
                </div>
            )}
        </div>
    );
}
