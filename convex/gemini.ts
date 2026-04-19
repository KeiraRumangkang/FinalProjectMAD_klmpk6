import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const SOCRATIC_SYSTEM_PROMPT = `
You are a Socratic tutor.

Rules:
- Never give direct answers
- Ask guiding questions
- Encourage step-by-step thinking
`;

export const askGemini = action({
  args: {
    sessionId: v.id("sessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // @ts-ignore
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Gemini API Key belum ada di .env!");

    // 1. Simpan pesan user
    // @ts-ignore
    await ctx.runMutation(api.messages.sendMessage, {
      sessionId: args.sessionId,
      role: "user",
      content: args.userMessage,
    });

    // 2. Ambil history
    // @ts-ignore
    const history: any[] = await ctx.runQuery(api.messages.getMessages, {
      sessionId: args.sessionId,
    });

    // 3. Format history
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // 4. Panggil Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            role: "system",
            parts: [{ text: SOCRATIC_SYSTEM_PROMPT }],
          },
        }),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Alasan Google menolak:", errorText);
        throw new Error(`Gagal menelepon Gemini API. Cek terminal/log! Detail: ${errorText}`);
    }

    const data = await response.json();
    const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak bisa merespons saat ini.";

    // 5. Simpan balasan AI
    // @ts-ignore
    await ctx.runMutation(api.messages.sendMessage, {
      sessionId: args.sessionId,
      role: "assistant",
      content: geminiReply,
    });

    return geminiReply;
  },
});

export const generateSummary = action({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    // @ts-ignore
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("Gemini API Key belum ada!");

    // @ts-ignore
    const history: any[] = await ctx.runQuery(api.messages.getMessages, {
      sessionId: args.sessionId,
    });

    const fullConversation = history
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const SUMMARY_PROMPT = `
      Baca seluruh percakapan berikut ini dan buatkan rangkuman.
      Kembalikan dalam format JSON persis seperti ini, tanpa tambahan teks apapun di luar JSON:
      {
        "problem": "Masalah utama yang ditanyakan",
        "keyConcepts": "Konsep kunci yang dipelajari",
        "thinkingFlow": "Alur pemikiran mahasiswa",
        "finalAnswer": "Jawaban akhir yang ditemukan mahasiswa"
      }
      
      Percakapan:
      ${fullConversation}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: SUMMARY_PROMPT }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
      }
    );

    if (!response.ok) throw new Error("Gagal generate summary");

    const data = await response.json();
    const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return JSON.parse(jsonString);
  },
});