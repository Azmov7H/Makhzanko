import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/services/ai/gpt";
import { getTenantContext } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const context = await getTenantContext();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
        }

        // Add system message if not present to guide the AI
        const hasSystem = messages.some(m => m.role === "system");
        const augmentedMessages = hasSystem ? messages : [
            {
                role: "system",
                content: `You are Makhzanko AI, a specialized assistant for the Makhzanko Inventory & Sales SaaS. 
                You help users manage their stores, understand their sales data, and answer questions about the platform.
                Tenant ID: ${context.tenantId}.
                Current Date: ${new Date().toLocaleDateString()}.
                Be helpful, concise, and professional.`
            },
            ...messages
        ];

        const { stream } = await AIService.generateStreamingResponse(augmentedMessages);

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
