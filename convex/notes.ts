import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Simpan hasil rangkuman dari Gemini
export const createNote = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    problem: v.string(),
    keyConcepts: v.string(),
    thinkingFlow: v.string(),
    finalAnswer: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notes", {
      userId: args.userId,
      sessionId: args.sessionId,
      problem: args.problem,
      keyConcepts: args.keyConcepts,
      thinkingFlow: args.thinkingFlow,
      finalAnswer: args.finalAnswer,
      isEdited: false,
      createdAt: Date.now(),
    });
  },
});

// 2. Update note jika user mengeditnya di layar Summary
export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    keyConcepts: v.string(),
    thinkingFlow: v.string(),
    finalAnswer: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      keyConcepts: args.keyConcepts,
      thinkingFlow: args.thinkingFlow,
      finalAnswer: args.finalAnswer,
      isEdited: true, // Berubah jadi true karena sudah diedit user
    });
  },
});

// 3. Ambil semua notes milik user (Untuk halaman My Library)
export const getNotes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc") // Yang terbaru di atas
      .collect();
  },
});

// 4. Ambil detail satu note
export const getNoteById = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.noteId);
  },
});