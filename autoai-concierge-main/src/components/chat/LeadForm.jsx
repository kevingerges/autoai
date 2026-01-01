import React from 'react';
import { Sparkles, X } from 'lucide-react';

export function LeadForm({ isOpen, onClose, carOfInterest }) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulation
        setTimeout(() => onClose(true), 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative slide-in">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <div className="mx-auto w-8 h-8 opacity-80 mb-2 text-white flex justify-center">
                        <Sparkles />
                    </div>
                    <h2 className="text-2xl font-bold">You're one step away!</h2>
                    <p className="text-blue-100 text-sm">Lock in this price for the {carOfInterest?.model || "vehicle"}.</p>
                </div>
                <button onClick={() => onClose(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input type="tel" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" required className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="john@example.com" />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all">
                        Schedule Test Drive
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-4">We respect your privacy. No spam, ever.</p>
                </form>
            </div>
        </div>
    );
}
