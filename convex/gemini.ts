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
    // 1. Ambil API Key Groq dari brankas Convex
    // @ts-ignore
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error("Groq API Key belum diset di Dashboard Convex!");

    // 2. Ambil riwayat percakapan
    // @ts-ignore
    const history: any[] = await ctx.runQuery(api.messages.getMessages, {
      sessionId: args.sessionId,
    });

    // 3. Format history khusus untuk standar Groq / OpenAI
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const lastMessage = formattedHistory[formattedHistory.length - 1];
    if (lastMessage?.role !== "user" || lastMessage.content !== args.userMessage) {
      formattedHistory.push({
        role: "user",
        content: args.userMessage,
      });
    }

    // Masukkan instruksi Sokratik di urutan paling atas sebagai "system"
    formattedHistory.unshift({
      role: "system",
      content: SOCRATIC_SYSTEM_PROMPT
    });

    // 4. Panggil Groq API (menggunakan model Llama 3)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Model buatan Meta yang gratis dan ngebut
        messages: formattedHistory,
        temperature: 0.7, // Kreativitas tutor Sokratik
        max_tokens: 1024
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Alasan Groq menolak:", errorText);
        throw new Error(`Gagal menelepon Groq API. Cek terminal! Detail: ${errorText}`);
    }

    const data = await response.json();
    
    // Parsing balasan ala OpenAI/Groq
    const aiReply = data.choices[0].message.content || "Maaf, saya tidak bisa merespons saat ini.";

    // 5. Simpan balasan AI ke database
    // @ts-ignore
    await ctx.runMutation(api.messages.sendMessage, {
      sessionId: args.sessionId,
      role: "assistant",
      content: aiReply,
    });

    return aiReply;
  },
});

export const generateSummary = action({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    // @ts-ignore
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error("Groq API Key belum ada di Dashboard!");

    // @ts-ignore
    const history: any[] = await ctx.runQuery(api.messages.getMessages, {
      sessionId: args.sessionId,
    });

    const fullConversation = history
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const SUMMARY_PROMPT = `
      Baca seluruh percakapan berikut ini dan buatkan rangkuman.
      Kembalikan dalam format JSON persis seperti ini, tanpa tambahan teks apapun di luar JSON (jangan pakai markdown \`\`\`json):
      {
        "problem": "Masalah utama yang ditanyakan",
        "keyConcepts": "Konsep kunci yang dipelajari",
        "thinkingFlow": "Alur pemikiran mahasiswa",
        "finalAnswer": "Jawaban akhir yang ditemukan mahasiswa"
      }
      
      Percakapan:
      ${fullConversation}
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: SUMMARY_PROMPT }],
        response_format: { type: "json_object" }, // Memaksa Groq mengeluarkan format JSON murni
        temperature: 0.2 // Dibuat rendah agar JSON-nya stabil dan tidak ngawur
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq Summary Error:", errorText);
        throw new Error("Gagal generate summary via Groq");
    }

    const data = await response.json();
    const jsonString = data.choices[0].message.content;
    
    return JSON.parse(jsonString);
  },
});
