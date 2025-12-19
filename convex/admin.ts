import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Role type for admin users
 */
export type UserRole = "admin" | "jobs" | "catering" | "both";

/**
 * Helper to check if a role has access to a resource
 */
function hasAccess(userRole: UserRole, resource: "jobs" | "catering" | "users"): boolean {
  if (userRole === "admin") return true;
  if (resource === "users") return false; // Only admin can access users
  if (resource === "jobs") return userRole === "jobs" || userRole === "both";
  if (resource === "catering") return userRole === "catering" || userRole === "both";
  return false;
}

/**
 * Get all job applications
 * Requires: jobs, both, or admin role
 */
export const getJobs = query({
  args: {},
  handler: async (ctx) => {
    // Note: Role check should be done server-side via auth middleware
    // This is a simple implementation - in production, verify auth token
    const applications = await ctx.db.query("jobApplications").order("desc").collect();
    return applications;
  },
});

/**
 * Get all catering requests
 * Requires: catering, both, or admin role
 */
export const getCatering = query({
  args: {},
  handler: async (ctx) => {
    // Note: Role check should be done server-side via auth middleware
    const requests = await ctx.db.query("cateringRequests").order("desc").collect();
    return requests;
  },
});

/**
 * Get all users (admin only)
 * Requires: admin role
 */
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    // Note: Role check should be done server-side via auth middleware
    const users = await ctx.db.query("users").order("desc").collect();
    return users;
  },
});

/**
 * Create a new user (admin only)
 * Requires: admin role
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    // Note: Role check should be done server-side via auth middleware
    
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      role: args.role,
      createdAt: Date.now(),
    });

    return { success: true, id: userId };
  },
});

/**
 * Update user role (admin only)
 * Requires: admin role
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    // Note: Role check should be done server-side via auth middleware
    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    return { success: true };
  },
});

/**
 * Get user by email
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

