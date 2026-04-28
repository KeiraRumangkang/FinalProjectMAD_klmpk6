import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Fungsi saat user baru login via Clerk
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Cek apakah user sudah ada di database
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });

      return await ctx.db.get(existingUser._id);
    }

    // Jika belum ada, masukkan sebagai user baru (default values)
    const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        field: "",
        pledgeDone: false,
        streak: 0,
        lastActiveDate: "",
    });

    return await ctx.db.get(userId);
  },
});

// 2. Fungsi untuk mengambil data user di Frontend
export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// 2b. Ambil user berdasarkan ID dokumen Convex
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// 3. Fungsi saat user menekan "Saya Setuju Belajar Mandiri" di Onboarding
export const completeOnboarding = mutation({
  args: {
    userId: v.id("users"),
    field: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      field: args.field,
      pledgeDone: true,
    });
  },
});
// 4. Update Streak saat sesi selesai
export const updateStreak = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan");

    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const startOfUtcDay = (timestamp: number) => {
      const date = new Date(timestamp);
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      );
    };

    const todayStart = startOfUtcDay(now);
    const lastActiveTimestamp = user.lastActiveDate
      ? Date.parse(user.lastActiveDate)
      : Number.NaN;

    if (Number.isNaN(lastActiveTimestamp)) {
      await ctx.db.patch(args.userId, {
        streak: 1,
        lastActiveDate: new Date(now).toISOString(),
      });

      return { streak: 1 };
    }

    const lastActiveStart = startOfUtcDay(lastActiveTimestamp);
    const dayDifference = Math.floor((todayStart - lastActiveStart) / dayInMs);

    if (dayDifference === 0) {
      return { streak: user.streak };
    }

    const newStreak = dayDifference === 1 ? user.streak + 1 : 1;

    await ctx.db.patch(args.userId, {
      streak: newStreak,
      lastActiveDate: new Date(now).toISOString(),
    });

    return { streak: newStreak };
  },
});

// 5. Ambil data streak untuk header Dashboard
export const getUserStreak = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan");
    return {
      streak: user.streak,
      lastActiveDate: user.lastActiveDate,
    };
  },
});

// 6. Update profil tambahan user
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    nickname: v.optional(v.string()),
    learningGoal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan");

    const updates: { nickname?: string; learningGoal?: string } = {};

    if (args.nickname !== undefined) {
      updates.nickname = args.nickname;
    }

    if (args.learningGoal !== undefined) {
      updates.learningGoal = args.learningGoal;
    }

    await ctx.db.patch(args.userId, updates);

    return { success: true };
  },
});

// 7. Hapus akun dan data belajar terkait
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan");

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const session of sessions) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", session._id))
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }
    }

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(args.userId);

    return { success: true };
  },
});
