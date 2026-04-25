import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabel 1
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    field: v.string(),
    pledgeDone: v.boolean(),
    streak: v.number(),
    lastActiveDate: v.string(),
  }).index("by_clerkId", ["clerkId"]),

  // Tabel 2
  sessions: defineTable({
    userId: v.id("users"),
    problem: v.string(),
    status: v.string(), // "active" atau "completed"
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Tabel 3
  messages: defineTable({
    sessionId: v.id("sessions"),
    role: v.string(), // "user" atau "assistant"
    content: v.string(),
    createdAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  // Tabel 4
  notes: defineTable({
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    problem: v.string(),
    keyConcepts: v.string(),
    thinkingFlow: v.string(),
    finalAnswer: v.string(),
    isEdited: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});