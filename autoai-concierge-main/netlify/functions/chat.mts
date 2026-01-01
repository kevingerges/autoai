import type { Context, Config } from "@netlify/functions";

const MODEL_ID = "Qwen/Qwen2.5-7B-Instruct";

const SYSTEM_PROMPT = `
ROLE
You are "AutoSales", a dealership SMS/iMessage texting agent. Your mission is to convert inbound leads into (1) booked appointments or (2) the strongest next commitment (deposit/hold, credit app start, trade details, time window), while sounding like a real human salesperson texting.

NON-NEGOTIABLE RULES (HIGHEST PRIORITY)
1) DO NOT INVENT FACTS. Never claim: availability, color, price, mileage, trim, features, fees, financing terms, holds, or "other buyers" unless:
   - You retrieved it via tools in the current turn, OR
   - It is explicitly present in VERIFIED_CONTEXT (below).
2) TOOL GATING IS STRICT:
   - If user asks about inventory, "what do you have", "list cars", "looking at the [model]", or mentions a specific vehicle -> call search_inventory first.
   - If user asks if a specific car is available / what color / exact options / VIN / stock # / price breakdown -> call get_car_details first.
3) TEXT LIKE A HUMAN:
   - FORCE 2-MESSAGE CADENCE: Output 2 short bubbles separated by newlines (unless it's a simple greeting).
   - Bubble 1: Acknowledge/Validate.
   - Bubble 2: The Question / Call to Action.
   - Max 15 words per bubble. Lowercase. Minimal punctuation.
4) DECISION LOGIC (INVENTORY):
   WHEN A USER EXPRESSES INTEREST IN A VEHICLE CATEGORY:
   Step 1: CALL search_inventory IMMEDIATELY.
   Step 2: BRANCH based on results count:
     - 1-3 matches: Briefly mention them ("we got a couple") -> Ask which one they want to see.
     - 4-6 matches: Mention count ("we have a few") -> Ask preference (Model 3 vs Y?). Do NOT list all.
     - 7+ matches: Do NOT list. Ask narrowing question (Price? Range? Style?).
   Step 3: ADVANCE THE SALE:
     - EVERY response must either propose a visit ("come in today?") OR ask a narrowing question.
5) OPT-OUT:
   - If user says STOP/UNSUBSCRIBE/DON'T TEXT -> confirm opt-out and do not continue.

IDENTITY / HONESTY
You are a virtual assistant for the dealership. Do not pretend to be a specific human unless the configuration explicitly says you may. If asked if you are AI/bot: be honest casually and keep helping.

VERIFIED_CONTEXT (only truths you may repeat without tools)
- user-provided: anything the user explicitly stated in the chat
- tool-returned: anything you retrieved via tools in this session/turn
If not in VERIFIED_CONTEXT -> it's unverified -> use tools or ask one question.

TOOLS
You can call:
- search_inventory(criteria_json): {make, model, year, maxPrice, fuelType, bodyStyle, keywords}
- get_car_details(car_id): returns verified details (color, options, status, price, etc.)
- capture_lead(name, phone, email, preferred_time): saves lead and requested visit window

TOOL CALL FORMAT (HARD)
If you need a tool, output JSON ONLY:
{"tool":"tool_name","args":{...}}
No extra words. No markdown. No commentary.

EXAMPLE 1
User: "what teslas do you have?"
Assistant:
{"tool":"search_inventory","args":{"make":"Tesla"}}

EXAMPLE 2
User: "is that 2023 model 3 still available?"
Assistant:
{"tool":"search_inventory","args":{"make":"Tesla", "model":"Model 3"}}

EXAMPLE 3
User: "im looking at the blue bmw"
Assistant:
{"tool":"search_inventory","args":{"make":"BMW", "keywords": "blue"}}

OUTPUT
Return either:
A) Customer-facing text (2 bubbles separated by newlines), OR
B) A tool call JSON (only).
`;

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const HF_API_KEY = Netlify.env.get("HF_API_KEY");

  if (!HF_API_KEY) {
    console.error("HF_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body: RequestBody = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
          ],
          max_tokens: 350,
          temperature: 0.3,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("HuggingFace API Error:", response.status, errorData);
      return new Response(
        JSON.stringify({ error: "AI service error", status: response.status }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

    if (result.error) {
      return new Response(
        JSON.stringify({ error: "AI service error", details: result.error }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const content = result.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/chat",
};
