import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Simpan pesan baru (Dipanggil oleh frontend dan juga oleh fungsi Gemini nanti)
export const sendMessage = mutation({
  args: {
    sessionId: v.id("sessions"),
    role: v.string(), // "user" atau "assistant"
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

// 2. Ambil riwayat chat lengkap untuk ditampilkan di layar
export const getMessages = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc") // Diurutkan dari yang paling lama ke terbaru agar chat terbaca normal
      .collect();
  },
});