import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for Stonefire Pizza
 * 
 * Tables:
 * - jobApplications: Stores job application submissions
 * - cateringRequests: Stores catering request submissions
 * - users: Stores admin users with role-based access
 */
export default defineSchema({
  jobApplications: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    position: v.string(),
    availability: v.string(),
    resumeUrl: v.optional(v.string()), // URL to uploaded resume file
    createdAt: v.number(),
  }),

  cateringRequests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    eventDate: v.string(), // ISO date string
    guestCount: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});

