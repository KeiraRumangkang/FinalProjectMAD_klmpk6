import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Buat sesi baru saat user input soal
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    problem: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      problem: args.problem,
      status: "active",
      createdAt: Date.now(), 
    });
    return sessionId; // Mengembalikan ID agar frontend tahu ruang chat mana yang harus dibuka
  },
});

// 2. Selesaikan sesi saat user menekan "Selesaikan Diskusi"
export const completeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      status: "completed",
    });
  },
});

// 3. Ambil detail sesi untuk layar chat
export const getSessionById = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// 4. Ambil daftar sesi yang masih "active" (ditampilkan di Active Struggles Dashboard)
export const getActiveSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active")) 
      .collect();
  },
});

// 5. Ambil semua sesi milik user untuk statistik profil
export const getSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
