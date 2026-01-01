export async function queryHuggingFace(messages) {
    console.log("Making API call to chat endpoint...");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: messages.map(m => ({
                    role: m.role === "assistant" ? "assistant" : "user",
                    content: m.content
                }))
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("API Error:", response.status, errorData);
            throw new Error("API Error: " + response.status);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error("API Error: " + result.error);
        }

        return result.content || "";

    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}
