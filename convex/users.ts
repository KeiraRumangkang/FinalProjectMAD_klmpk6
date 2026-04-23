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

    // Jika belum ada, masukkan sebagai user baru (default values)
    if (!existingUser) {
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        field: "",
        pledgeDone: false,
        streak: 0,
        lastActiveDate: "",
      });
    }
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

    // Ambil tanggal hari ini format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    const lastActive = user.lastActiveDate;

    if (lastActive === today) {
      // Sudah login hari ini, jangan ubah apa-apa
      return;
    }

    // Hitung tanggal kemarin
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    let newStreak = user.streak;

    if (lastActive === yesterday) {
      // User aktif beruntun dari kemarin
      newStreak += 1;
    } else {
      // Bolong, reset ke 1
      newStreak = 1;
    }

    await ctx.db.patch(args.userId, {
      streak: newStreak,
      lastActiveDate: today,
    });
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