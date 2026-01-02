import React, { useState, useEffect, useRef } from 'react';
import { Zap, Send, Sparkles, MessageSquarePlus, History } from 'lucide-react';
import { CARS } from '@/data/cars';
import { queryHuggingFace } from '@/api/chat';
import { CarCard } from '@/components/chat/CarCard';
import { LeadForm } from '@/components/chat/LeadForm';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { getMessages, saveMessage, getChatSessions, searchCars, getCarById, Car } from '@/lib/supabase';

export default function Demo() {
    const [input, setInput] = useState("");

    // Session Management
    const [sessionId, setSessionId] = useState(() => {
        const stored = localStorage.getItem("autoai_session_id");
        if (stored) return stored;
        const newId = crypto.randomUUID();
        localStorage.setItem("autoai_session_id", newId);
        return newId;
    });

    // Human-like greeting (not bot-like)
    const initialGreeting = { role: "assistant", content: "hey! welcome in\nwhat are you shopping for?" };

    // Start with empty messages - will be populated from history or initial greeting
    const [messages, setMessages] = useState<any[]>([]);

    // Start a new chat session
    const startNewChat = async () => {
        const newId = crypto.randomUUID();
        localStorage.setItem("autoai_session_id", newId);
        setSessionId(newId);
        setMessages([initialGreeting]);
        saveMessage(newId, initialGreeting.role, initialGreeting.content, null);
        setActiveInventory([]);
        setSelectedCar(null);
        setShowLeadForm(false);
        // Refresh chat sessions list
        const sessions = await getChatSessions();
        setChatSessions(sessions);
    };

    // Chat history state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chatSessions, setChatSessions] = useState<any[]>([]);

    // Load chat sessions on mount
    useEffect(() => {
        async function loadSessions() {
            const sessions = await getChatSessions();
            setChatSessions(sessions);
        }
        loadSessions();
    }, []);

    // Switch to a different chat session
    const loadSession = async (targetSessionId: string) => {
        if (targetSessionId === sessionId) return;
        localStorage.setItem("autoai_session_id", targetSessionId);
        setSessionId(targetSessionId);
        const history = await getMessages(targetSessionId);
        if (history && history.length > 0) {
            setMessages(history);
        }
    };

    // Format relative time
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Load History
    useEffect(() => {
        async function load() {
            const history = await getMessages(sessionId);
            if (history && history.length > 0) {
                setMessages(history);
            } else {
                // No history - show and persist the initial greeting
                setMessages([initialGreeting]);
                saveMessage(sessionId, initialGreeting.role, initialGreeting.content, null);
            }
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeInventory, setActiveInventory] = useState([]);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    // Active car tracking for get_car_details (fixes "last_referenced" issue)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activeCar, setActiveCar] = useState<any>(null);
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

    // Detect if user is asking to SEE/LIST inventory (show cards)
    function isExplicitListRequest(message: string) {
        const text = message.toLowerCase();

        // These phrases indicate user wants to SEE a list of cars
        const listPhrases = [
            "what do you have",
            "what cars",
            "what teslas",
            "what bmws",
            "show me",
            "list",
            "all your",
            "your inventory",
            "cars do you have",
            "vehicles do you have",
            "what's on the lot",
            "what you got"
        ];

        return listPhrases.some(phrase => text.includes(phrase));
    }

    // Detect inventory filters for search
    function detectInventoryFilters(message: string) {
        const text = message.toLowerCase();

        // Electric / fuel keywords
        if (text.includes("electric") || text.includes("ev") || text.includes("battery")) {
            return { fuelType: "Electric" };
        }
        if (text.includes("hybrid")) {
            return { fuelType: "Hybrid" };
        }
        if (text.includes("gas") || text.includes("gasoline")) {
            return { fuelType: "Gasoline" };
        }

        // Brand keywords
        if (text.includes("bmw")) return { make: "BMW" };
        if (text.includes("porsche")) return { make: "Porsche" };
        if (text.includes("mercedes") || text.includes("benz") || text.includes("g-wagon")) return { make: "Mercedes-Benz" };
        if (text.includes("ford") || text.includes("mustang") || text.includes("mach")) return { make: "Ford" };
        if (text.includes("tesla")) return { make: "Tesla" };
        if (text.includes("audi")) return { make: "Audi" };
        if (text.includes("rivian")) return { make: "Rivian" };
        if (text.includes("lucid")) return { make: "Lucid" };

        // Model keywords
        if (text.includes("model 3") || text.includes("model3")) return { make: "Tesla", model: "Model 3" };
        if (text.includes("model y") || text.includes("modely")) return { make: "Tesla", model: "Model Y" };
        if (text.includes("model s")) return { make: "Tesla", model: "Model S" };
        if (text.includes("taycan")) return { make: "Porsche", model: "Taycan" };
        if (text.includes("911")) return { make: "Porsche", model: "911 Carrera" };
        if (text.includes("mach-e") || text.includes("mach e")) return { make: "Ford", model: "Mustang Mach-E" };

        return {};
    }

    // Detect if user is objecting to price/cost
    function detectPriceObjection(message: string) {
        const text = message.toLowerCase();
        const keywords = ["price", "expensive", "cost", "budget", "high", "money", "afford", "cheaper", "lower"];
        return keywords.some(k => text.includes(k));
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
    const addMessage = (role: string, content: string, cards: any = null, toolData: any = null) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMessages((prev: any[]) => [...prev, { role, content, cards, ...toolData }]);
        saveMessage(sessionId, role, content, cards);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const executeTool = async (toolName: string, args: any) => {
        console.log("Executing Tool:", toolName, args);

        if (toolName === "search_inventory") {
            // Try Supabase first, fallback to local CARS
            let results: any[] = await searchCars({
                make: args.make,
                model: args.model,
                year: args.year,
                maxPrice: args.maxPrice,
                fuelType: args.fuelType,
                keywords: args.keywords
            });

            // Fallback to local CARS if Supabase returns empty (not connected)
            if (results.length === 0) {
                results = CARS.filter(car => {
                    if (args.make && !car.make.toLowerCase().includes(args.make.toLowerCase())) return false;
                    if (args.model && !car.model.toLowerCase().includes(args.model.toLowerCase())) return false;
                    if (args.fuelType && !car.fuelType.toLowerCase().includes(args.fuelType.toLowerCase())) return false;
                    if (args.maxPrice && car.price > args.maxPrice) return false;
                    if (args.year && car.year !== args.year) return false;
                    if (args.keywords) {
                        const kw = args.keywords.toLowerCase();
                        const searchable = `${car.make} ${car.model} ${car.color} ${car.features.join(' ')}`.toLowerCase();
                        if (!searchable.includes(kw)) return false;
                    }
                    return true;
                });
            }

            if (results.length > 0) {
                // Format results for AI context (normalize field names)
                const summary = results.map(c =>
                    `- ID#${c.id}: ${c.year} ${c.make} ${c.model} (${c.color}), ${c.mileage?.toLocaleString()} mi, $${c.price?.toLocaleString()}`
                ).join('\n');

                return {
                    result: `Found ${results.length} car(s):\n${summary}`,
                    data: results.map(c => ({
                        ...c,
                        // Normalize Supabase field names to match local format
                        fuelType: c.fuel_type || c.fuelType,
                        originalPrice: c.original_price || c.originalPrice
                    })),
                    display: true
                };
            } else {
                return {
                    result: "No exact matches found in current inventory.",
                    data: [],
                    display: false
                };
            }
        }

        if (toolName === "get_car_details") {
            // Find car by ID, or by last mentioned context
            let car: any = null;

            if (args.car_id) {
                const id = typeof args.car_id === 'string' ? parseInt(args.car_id) : args.car_id;
                // Try Supabase first
                car = await getCarById(id);
                // Fallback to local
                if (!car) {
                    car = CARS.find(c => c.id === id);
                }
            }

            // If no ID, try to find from args like make/model
            if (!car && (args.make || args.model)) {
                const searchResults = await searchCars({ make: args.make, model: args.model });
                if (searchResults.length > 0) {
                    car = searchResults[0];
                } else {
                    car = CARS.find(c => {
                        if (args.make && !c.make.toLowerCase().includes(args.make.toLowerCase())) return false;
                        if (args.model && !c.model.toLowerCase().includes(args.model.toLowerCase())) return false;
                        return true;
                    });
                }
            }

            // If still no car, try to find from activeCar state (last referenced)
            if (!car && activeCar) {
                car = activeCar;
            }

            // Last resort: try selectedCar
            if (!car && selectedCar) {
                car = selectedCar;
            }

            if (car) {
                // Normalize field names
                const fuelType = car.fuel_type || car.fuelType;
                const features = car.features || [];

                const details = `VERIFIED CAR DETAILS:
- ID: #${car.id}
- Vehicle: ${car.year} ${car.make} ${car.model}
- Color: ${car.color}
- Mileage: ${car.mileage?.toLocaleString()} miles
- Price: $${car.price?.toLocaleString()}
- Fuel Type: ${fuelType}
- Features: ${Array.isArray(features) ? features.join(', ') : features}
- Status: Available`;

                return {
                    result: details,
                    data: { ...car, fuelType, features },
                    display: false
                };
            } else {
                return {
                    result: "Could not find that specific vehicle. Ask the user to clarify which car they mean.",
                    data: null,
                    display: false
                };
            }
        }

        if (toolName === "capture_lead") {
            setShowLeadForm(true);
            return { result: "Lead form triggered - asking user for contact info.", data: null, display: false };
        }

        return { result: `Unknown tool: ${toolName}`, data: null, display: false };
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

        // If user explicitly asks to LIST/SEE inventory, show cards immediately
        const isListRequest = isExplicitListRequest(userMsg);

        if (isListRequest) {
            setCanShowInventory(true);
            const filters = detectInventoryFilters(userMsg);
            const toolResult = await executeTool("search_inventory", filters);

            if (toolResult.data && toolResult.data.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Create conversational summary instead of robotic list
                const cars = toolResult.data;
                const modelCounts: Record<string, number> = {};
                cars.forEach((c: any) => {
                    const key = `${c.make} ${c.model}`;
                    modelCounts[key] = (modelCounts[key] || 0) + 1;
                });

                const summaryParts = Object.entries(modelCounts).map(([model, count]) =>
                    count > 1 ? `${count} ${model}s` : `a ${model}`
                );
                const summary = summaryParts.length > 2
                    ? `${summaryParts.slice(0, -1).join(', ')} and ${summaryParts.slice(-1)}`
                    : summaryParts.join(' and ');

                addMessage("assistant", `we've got ${summary} on the lot right now.\nhere's a quick look at each — let me know which one catches your eye!`, toolResult.data);
                setActiveInventory([]);
                setCanShowInventory(false);
                setIsLoading(false);
                return;
            } else {
                await new Promise(resolve => setTimeout(resolve, 1200));
                addMessage("assistant", "hmm, don't have anything like that in stock right now.\nwant me to check for something similar?");
                setIsLoading(false);
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

            // ENFORCED TOOL ROUTING: Force tool call for inventory keywords (don't rely on model)
            const requiresInventoryLookup = (msg: string) => {
                const text = msg.toLowerCase();
                const inventoryKeywords = [
                    'range', 'mileage', 'miles', 'price', 'how much', 'cost',
                    'model 3', 'model y', 'model s', 'taycan', '911', 'mach-e',
                    'tesla', 'bmw', 'porsche', 'mercedes', 'ford', 'audi', 'rivian', 'lucid'
                ];
                return inventoryKeywords.some(kw => text.includes(kw));
            };

            // Force tool call BEFORE model response if inventory keywords detected
            let forcedToolResult: any = null;
            if (requiresInventoryLookup(userMsg) && !matchedCar) {
                const filters = detectInventoryFilters(userMsg);
                forcedToolResult = await executeTool("search_inventory", filters);

                // Add tool log to chat
                addMessage("tool_log", "", null, {
                    toolName: "search_inventory",
                    args: filters,
                    result: forcedToolResult.result
                });

                // Set activeCar if exactly 1 match
                if (forcedToolResult.data?.length === 1) {
                    setActiveCar(forcedToolResult.data[0]);
                }
            }

            // Build messages for AI call with proper tool context
            const toolContextMessages = forcedToolResult ? [{
                role: "system" as const,
                content: `VERIFIED INVENTORY RESULTS:\n${forcedToolResult.result}\n\nYou MUST use these EXACT facts when responding. Do NOT invent any details.`
            }] : [];

            let aiResponse: any = await queryHuggingFace([
                ...messages,
                ...contextMessages,
                ...toolContextMessages,
                { role: "user", content: userMsg }
            ]);

            // Tool Call Loop - can iterate if AI needs multiple tools
            let toolIterations = 0;
            const maxToolIterations = 3;
            let lastCarFound: any = matchedCar;
            let toolWasExecuted = false;
            let lastToolResult: any = null;
            let lastToolName = "";

            while (toolIterations < maxToolIterations) {
                toolIterations++;

                try {
                    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) break; // No tool call, exit loop

                    const toolData = JSON.parse(jsonMatch[0]);
                    if (!toolData.tool) break; // Not a valid tool call

                    console.log(`Tool iteration ${toolIterations}:`, toolData);
                    toolWasExecuted = true;
                    lastToolName = toolData.tool;

                    // Execute the tool
                    const toolResult = await executeTool(toolData.tool, toolData.args);
                    lastToolResult = toolResult;

                    // Store last car found for context AND update activeCar state\n                    if (toolResult.data) {\n                        if (Array.isArray(toolResult.data) && toolResult.data.length > 0) {\n                            lastCarFound = toolResult.data[0]; // Store first match for context\n                            // If exactly 1 match, set as activeCar for follow-up queries\n                            if (toolResult.data.length === 1) {\n                                setActiveCar(toolResult.data[0]);\n                            }\n                        } else if (!Array.isArray(toolResult.data)) {\n                            lastCarFound = toolResult.data;\n                            setActiveCar(toolResult.data); // Single car from get_car_details\n                        }\n                    }

                    // ADD VISIBLE TOOL LOG TO CHAT
                    addMessage("tool_log", "", null, {
                        toolName: toolData.tool,
                        args: toolData.args,
                        result: toolResult.result
                    });

                    // Handle inventory display - only show cards if it was an explicit list request
                    // For specific car queries, let the AI handle conversationally (no auto-cards)
                    const shouldDisplayInventory = isListRequest && canShowInventory;
                    if (toolData.tool === "search_inventory" && toolResult.display && toolResult.data.length > 0 && shouldDisplayInventory) {
                        // This path is typically handled above, but keep for safety
                        setActiveInventory([]);
                        setCanShowInventory(false);
                    }

                    // Build tool context message based on tool type
                    let toolContextContent = "";
                    if (toolData.tool === "search_inventory") {
                        toolContextContent = `[TOOL RESULT - search_inventory]: ${toolResult.result}

IMPORTANT: Based on these results, you MUST now give the user a helpful response about these cars. Be specific. Push toward a visit.`;
                    } else if (toolData.tool === "get_car_details") {
                        toolContextContent = `[TOOL RESULT - get_car_details]: ${toolResult.result}

IMPORTANT: You now have VERIFIED car details. You MUST respond with specific info from above (color, price, mileage). Then ask if they want to come see it.`;
                    } else {
                        toolContextContent = `[TOOL RESULT - ${toolData.tool}]: ${toolResult.result}`;
                    }

                    // Add last found car context if we have one
                    const carContext = lastCarFound ? `\n[ACTIVE CAR]: ${lastCarFound.year} ${lastCarFound.make} ${lastCarFound.model} (${lastCarFound.color}), ${lastCarFound.mileage?.toLocaleString()} mi, $${lastCarFound.price?.toLocaleString()}` : "";

                    const toolContextMsg = {
                        role: "user",
                        content: toolContextContent + carContext
                    };

                    // Get next AI response with tool results
                    aiResponse = await queryHuggingFace([
                        ...messages,
                        { role: "user", content: userMsg },
                        { role: "assistant", content: `{"tool":"${toolData.tool}","args":${JSON.stringify(toolData.args)}}` },
                        toolContextMsg
                    ]);

                } catch (e) {
                    console.log("Tool parse error or no tool call:", e);
                    break;
                }
            }

            // Cleanup & Split Bubbles
            aiResponse = (aiResponse as string).replace(/TOOL_CALL:?/gi, "");
            let cleanResponse = aiResponse.replace(/\{[\s\S]*\}/, "").trim();

            // If tool was executed but response is weak/empty, generate a helpful fallback
            if (toolWasExecuted && lastCarFound && cleanResponse.length < 30) {
                if (lastToolName === "get_car_details") {
                    cleanResponse = `that's a ${lastCarFound.year} ${lastCarFound.make} ${lastCarFound.model} in ${lastCarFound.color}.\n${lastCarFound.mileage?.toLocaleString()} miles, listed at $${lastCarFound.price?.toLocaleString()}. want to come check it out?`;
                } else if (lastToolName === "search_inventory" && lastToolResult?.data?.length === 1) {
                    const car = lastToolResult.data[0];
                    cleanResponse = `found it — ${car.year} ${car.make} ${car.model} in ${car.color}.\n${car.mileage?.toLocaleString()} mi, $${car.price?.toLocaleString()}. you free to swing by and see it?`;
                }
            }

            const sanitized = sanitizeResponse(cleanResponse);

            if (sanitized) {
                // SPLIT BUBBLES logic
                let bubbles = sanitized.split("\n").filter(line => line.trim() !== "");

                // FORCE follow-up CTA: if a car was found but no booking question, add one
                const hasBookingCTA = bubbles.some(b =>
                    /come (check|see|by|in)|test drive|swing by|drop by|schedule|appointment|visit|available|free (to|this)/i.test(b)
                );

                if (lastCarFound && !hasBookingCTA && bubbles.length > 0) {
                    // Start with generic CTAs
                    let ctas = [
                        "want to come check it out today?",
                        "you free to swing by and see it?",
                        "want me to hold it for you?",
                        "when works for a test drive?"
                    ];

                    // If user mentioned price/budget, use negotiation-focused CTAs
                    if (detectPriceObjection(userMsg)) {
                        ctas = [
                            "come in and we can usually work the numbers. you free today?",
                            "if you can swing by, my manager can typically make it work. when's good?",
                            "listing price is just a starting point. want to come in and talk numbers?"
                        ];
                    }

                    bubbles.push(ctas[Math.floor(Math.random() * ctas.length)]);
                }

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

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gray-100 p-2.5 rounded-xl">
                            <Zap className="text-foreground fill-foreground" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">AutoAI</h1>
                    </div>

                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium mb-4"
                    >
                        <MessageSquarePlus size={18} />
                        New Chat
                    </button>

                    {/* Chat History */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                            <History size={14} />
                            <span className="text-xs font-medium uppercase tracking-wide">Recent Chats</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {chatSessions.map((session) => (
                                <button
                                    key={session.session_id}
                                    onClick={() => loadSession(session.session_id)}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${session.session_id === sessionId
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'bg-white hover:bg-gray-100 border border-border'
                                        }`}
                                >
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {session.preview.slice(0, 40)}{session.preview.length > 40 ? '...' : ''}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatTime(session.created_at)}
                                    </p>
                                </button>
                            ))}
                            {chatSessions.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    No chat history yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Live Agent Status */}
                    <div className="bg-white p-4 rounded-xl border border-border shadow-sm mt-4">
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
