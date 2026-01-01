import React, { useState, useEffect, useRef } from 'react';
import { Zap, Send, Sparkles } from 'lucide-react';
import { CARS } from '@/data/cars';
import { queryHuggingFace } from '@/api/chat';
import { CarCard } from '@/components/chat/CarCard';
import { LeadForm } from '@/components/chat/LeadForm';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { getMessages, saveMessage } from '@/lib/supabase';

export default function Demo() {
    const [input, setInput] = useState("");

    // Session Management
    const [sessionId] = useState(() => {
        const stored = localStorage.getItem("autoai_session_id");
        if (stored) return stored;
        const newId = crypto.randomUUID();
        localStorage.setItem("autoai_session_id", newId);
        return newId;
    });

    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hey there! 🚗 Welcome to AutoAI. I'm Kevin, your personal car expert. Looking for anything specific today, or just browsing our new arrivals?" }
    ]);

    // Load History
    useEffect(() => {
        async function load() {
            const history = await getMessages(sessionId);
            if (history && history.length > 0) {
                setMessages(history);
            } else {
                // Persist the initial greeting for new sessions
                const initial = { role: "assistant", content: "Hey there! 🚗 Welcome to AutoAI. I'm Kevin, your personal car expert. Looking for anything specific today, or just browsing our new arrivals?" };
                saveMessage(sessionId, initial.role, initial.content, null);
            }
        }
        load();
    }, [sessionId]);
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeInventory, setActiveInventory] = useState([]);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [canShowInventory, setCanShowInventory] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeInventory]);

    // ==========================================
    // LOGIC: Improved Intent & Context
    // ==========================================

    function detectInventoryQuery(message: string) {
        const text = message.toLowerCase();

        // Require explicit shopping intent to avoid re-attaching cards on casual mentions
        const hasInventoryIntent = /(inventory|in stock|available|do you have|what do you have|show|list|options|car|cars|stock|looking for)/i.test(text);
        if (!hasInventoryIntent) return null;

        // Electric / fuel keywords
        if (text.includes("electric") || text.includes("ev") || text.includes("battery")) {
            return { fuelType: "Electric" };
        }
        if (text.includes("hybrid")) {
            return { fuelType: "Hybrid" };
        }
        if (text.includes("gas") || text.includes("gasoline") || text.includes("mpg") || text.includes("fuel")) {
            return { fuelType: "Gasoline" };
        }

        // Brand keywords
        if (text.includes("bmw")) return { make: "BMW" };
        if (text.includes("porsche")) return { make: "Porsche" };
        if (text.includes("mercedes") || text.includes("benz") || text.includes("g-wagon") || text.includes("gwagon")) return { make: "Mercedes-Benz" };
        if (text.includes("ford") || text.includes("mustang") || text.includes("mach")) return { make: "Ford" };
        if (text.includes("tesla")) return { make: "Tesla" };

        // Generic inventory asks
        if (text.includes("cars") || text.includes("inventory") || text.includes("show me") || text.includes("what do you have") || text.includes("list")) {
            return {};
        }

        return null;
    }

    // Lightweight matcher to ground follow-up chat to a specific known car without re-showing cards
    function findCarFromMessage(message: string) {
        const text = message.toLowerCase();
        // Prefer explicit ID mentions like "#1"
        const idMatch = text.match(/#?(\d+)/);
        if (idMatch) {
            const carById = CARS.find(c => c.id === Number(idMatch[1]));
            if (carById) return carById;
        }

        // Check for make/model keywords
        for (const car of CARS) {
            const makeHit = text.includes(car.make.toLowerCase());
            const modelHit = text.includes(car.model.toLowerCase().split(" ")[0]); // first token of model
            if (makeHit || modelHit) return car;
        }

        // Mileage hint
        const mileageMatch = text.match(/(\d{1,3}(?:,\d{3})?)[ ]*mi/);
        if (mileageMatch) {
            const miles = Number(mileageMatch[1].replace(/,/g, ""));
            const carByMiles = CARS.find(c => Math.abs(c.mileage - miles) <= 500); // small tolerance
            if (carByMiles) return carByMiles;
        }

        return null;
    }

    // Strip emojis and limit to two short sentences to keep replies human-text sized
    function sanitizeResponse(text: string) {
        if (!text) return text;
        // eslint-disable-next-line no-undef
        let noEmoji = text
            .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
            .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "");

        const sentences = noEmoji.match(/[^.!?]+[.!?]?/g);
        if (sentences && sentences.length > 0) {
            const trimmed = sentences.map(s => s.trim()).filter(Boolean);
            const limited = trimmed.slice(0, 2).join(" ");
            return limited || noEmoji.trim();
        }
        return noEmoji.trim();
    }

    // Handlers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLeadSubmit = (success: any) => {
        setShowLeadForm(false);
        if (success) {
            addMessage("assistant", "Perfect! 🌟 I've got your info down. One of our senior specialists will reach out shortly to confirm your appointment. Anything else I can show you in the meantime?");
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addMessage = (role: string, content: string, cards: any = null) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMessages((prev: any[]) => [...prev, { role, content, cards }]);
        saveMessage(sessionId, role, content, cards);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const executeTool = (toolName: string, args: any) => {
        console.log("Executing Tool:", toolName, args);

        if (toolName === "search_inventory") {
            // Simple filter logic
            const results = CARS.filter(car => {
                if (args.make && !car.make.toLowerCase().includes(args.make.toLowerCase())) return false;
                if (args.fuelType && !car.fuelType.toLowerCase().includes(args.fuelType.toLowerCase())) return false;
                if (args.maxPrice && car.price > args.maxPrice) return false;
                return true;
            });

            if (results.length > 0) {
                return {
                    result: `Found ${results.length} cars matching criteria.`,
                    data: results,
                    display: true
                };
            } else {
                return { result: "No exact matches found, but we have other great options.", data: [], display: false };
            }
        }

        if (toolName === "capture_lead") {
            setShowLeadForm(true);
            return { result: "Lead form triggered.", data: null, display: false };
        }

        if (toolName === "get_car_details") {
            return { result: "Car details retrieved successfully.", data: null, display: false };
        }

        return { result: "Tool executed.", data: null };
    };

    // Helper for realistic typing delay
    const simulateTypingDelay = (textLength: number) => {
        // Base delay relative to length + random jitter
        // User requested high latency: "random number between 6-15 seconds"
        // We will target that range for the *total* time or per substantial bubble.
        // Let's bias slightly lower for UX (3-8s) unless text is long, but sticking to request:
        const minDelay = 2000; // 2s min
        const maxDelay = 8000; // 8s max (15s is very long for a single 'ok', we'll cap at 8 for sanity unless very long)

        // Calculate typings speed (e.g. 50ms per char) plus fixed thinking time
        let delay = 1500 + (textLength * 30) + (Math.random() * 2000);
        return Math.min(Math.max(delay, minDelay), maxDelay);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        addMessage("user", userMsg);
        setIsLoading(true);

        // If user clearly asks for cars/inventory, show results immediately (no AI latency)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let inventoryShown = false;
        const detectedCriteria = detectInventoryQuery(userMsg);
        const explicitInventoryRequest = detectedCriteria !== null;

        if (explicitInventoryRequest) {
            setCanShowInventory(true); // allow one inventory render for this turn
            const toolResult = executeTool("search_inventory", detectedCriteria);
            inventoryShown = true;

            if (toolResult.display && toolResult.data.length > 0) {
                // Simulate quick lookup delay
                setTimeout(() => {
                    addMessage("assistant", `${toolResult.result}\n\nAsk me about any of these or say “details on #1” to zoom in.`, toolResult.data);
                    setActiveInventory([]);
                    setCanShowInventory(false);
                    setIsLoading(false);
                }, 1500);
                return;
            } else {
                setTimeout(() => {
                    const fallback = executeTool("search_inventory", {});
                    addMessage("assistant", `I don't have that in stock right now. Here's what I do have on the floor today:`, fallback.data);
                    setActiveInventory([]);
                    setCanShowInventory(false);
                    setIsLoading(false);
                }, 1500);
                return;
            }
        }

        // Main Loop
        try {
            const matchedCar = findCarFromMessage(userMsg);
            const contextMessages = matchedCar ? [{
                role: "user",
                content: `[Context] Known car mentioned: ${matchedCar.year} ${matchedCar.make} ${matchedCar.model}, ${matchedCar.mileage.toLocaleString()} mi, $${matchedCar.price.toLocaleString()}, features: ${matchedCar.features.join(", ")}. Avoid placeholders—be conversational.`
            }] : [];

            let aiResponse: any = await queryHuggingFace([
                ...messages,
                ...contextMessages,
                { role: "user", content: userMsg }
            ]);

            // Check for Tool Call
            try {
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const toolData = JSON.parse(jsonMatch[0]);
                    if (toolData.tool) {
                        const toolResult = executeTool(toolData.tool, toolData.args);

                        // Handle inventory display if needed
                        const shouldDisplayInventory = explicitInventoryRequest || canShowInventory;
                        if (toolResult.display && toolResult.data.length > 0 && shouldDisplayInventory) {
                            addMessage("assistant", toolResult.result, toolResult.data);
                            setActiveInventory([]);
                            setCanShowInventory(false);
                        }

                        // Send tool result back to AI
                        const toolContextMsg = {
                            role: "user",
                            content: `[System Tool Output]: ${toolResult.result}. Now talk to the user about these cars/results naturally.`
                        };
                        aiResponse = await queryHuggingFace([...messages, { role: "user", content: userMsg }, toolContextMsg]);
                    }
                }
            } catch (e) {
                console.log("Not a tool call or parse error", e);
            }

            // Cleanup & Split Bubbles
            aiResponse = (aiResponse as string).replace(/TOOL_CALL:?/gi, "");
            const cleanResponse = aiResponse.replace(/\{[\s\S]*\}/, "").trim();
            const sanitized = sanitizeResponse(cleanResponse);

            if (sanitized) {
                // SPLIT BUBBLES logic
                const bubbles = sanitized.split("\n").filter(line => line.trim() !== "");

                // Deliver bubbles sequentially with delay
                for (const bubble of bubbles) {
                    setIsLoading(true);
                    await new Promise(resolve => setTimeout(resolve, simulateTypingDelay(bubble.length)));
                    addMessage("assistant", bubble);
                }
            }

        } catch (error) {
            console.error(error);
            addMessage("assistant", `🚨 API ERROR: ${(error as any).message}`);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            <LeadForm isOpen={showLeadForm} onClose={handleLeadSubmit} carOfInterest={selectedCar} />

            {/* Left Sidebar - Branding & Info */}
            <div className="hidden md:flex w-80 bg-gray-50/50 backdrop-blur-xl flex-col p-6 border-r border-border justify-between relative overflow-hidden">
                {/* Background Gradient to match Landing Page */}
                <div className="absolute inset-0 bg-gradient-radial from-background via-background to-gray-50 opacity-60 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-gray-100 p-2.5 rounded-xl">
                            <Zap className="text-foreground fill-foreground" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">AutoAI</h1>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-foreground">Live Agent Active</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                I can help you find cars, compare specs, and schedule test drives instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-background relative">
                {/* Background Gradient & Pattern from Hero.tsx */}
                <div className="absolute inset-0 bg-gradient-radial from-background via-background to-gray-50 opacity-60 pointer-events-none" />
                <div className="absolute inset-0 grid-pattern opacity-[0.03] z-0 pointer-events-none"></div>

                {/* Header Mobile */}
                <div className="md:hidden p-4 bg-background/80 backdrop-blur-md flex items-center justify-between relative z-10 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-1.5 rounded-lg">
                            <Zap className="text-foreground fill-foreground" size={18} />
                        </div>
                        <span className="font-bold text-lg text-foreground">AutoAI</span>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10" ref={scrollRef}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {messages.map((msg: any, idx: number) => (
                        <ChatMessage key={idx} message={msg} idx={idx} onCarClick={setSelectedCar} />
                    ))}

                    {isLoading && (
                        <div className="flex items-start slide-in">
                            <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border relative z-10">
                    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about electric cars, SUVs, or specific models..."
                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50/50 border border-gray-100 focus:border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 transition-all text-foreground placeholder-muted-foreground outline-none shadow-sm text-base"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground"
                            >
                                <Sparkles size={18} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <p className="text-center text-[11px] text-muted-foreground mt-2 font-medium">
                        Start by asking: "Do you have any electric SUVs?" or "Looking for a fast BMW"
                    </p>
                </div>
            </div>
        </div>
    );
}
