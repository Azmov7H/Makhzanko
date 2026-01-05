import { fetch } from "next/dist/compiled/@edge-runtime/primitives";

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AIResponseStream {
    stream: ReadableStream;
    id: string;
}

export class AIService {
    private static baseUrl = process.env.AI_BASE_URL || "http://localhost:8000/v1";
    private static apiKey = process.env.AI_API_KEY || "dummy";
    private static model = process.env.AI_MODEL_NAME || "gpt-oss-120b";

    /**
     * Generate a streaming response from the AI model
     */
    static async generateStreamingResponse(messages: ChatMessage[]): Promise<AIResponseStream> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                stream: true,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Model request failed: ${error}`);
        }

        return {
            stream: response.body!,
            id: Date.now().toString(),
        };
    }

    /**
     * Non-streaming completion
     */
    static async generateCompletion(messages: ChatMessage[]): Promise<string> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error("AI Completion failed");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}
