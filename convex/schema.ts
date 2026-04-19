import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    field: v.string(),
    pledgeDone: v.boolean(),
    streak: v.number(),
    lastActiveDate: v.string(),
  }).index("by_clerkId", ["clerkId"]),
});