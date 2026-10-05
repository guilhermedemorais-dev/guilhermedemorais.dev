import OpenAI from "openai";
import { COMMERCE_SDR_INSTRUCTIONS, SDR_INSTRUCTIONS } from "@/lib/sdr";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages as ChatMessage[] : [];
    const mode = body?.mode === "commerce" ? "commerce" : "portfolio";

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: mode === "commerce" ? COMMERCE_SDR_INSTRUCTIONS : SDR_INSTRUCTIONS,
      input: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const raw = response.output_text.trim();

    try {
      return Response.json(JSON.parse(raw));
    } catch {
      return Response.json({
        reply: raw || "Me conta um pouco mais sobre o projeto.",
        status: "collecting",
        briefing: null,
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Não foi possível processar a conversa." },
      { status: 500 }
    );
  }
}
