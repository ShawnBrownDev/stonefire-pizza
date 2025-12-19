import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all locations
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("locations").order("asc").collect();
  },
});

/**
 * Get locations that are currently hiring
 */
export const getHiringLocations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_hiring", (q) => q.eq("isHiring", true))
      .order("asc")
      .collect();
  },
});

/**
 * Get a single location by ID
 */
export const getById = query({
  args: { id: v.id("locations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new location
 * Requires: admin role (should be checked in UI/auth layer)
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    isHiring: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("locations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (existing) {
      throw new Error("Location with this slug already exists");
    }

    const locationId = await ctx.db.insert("locations", {
      name: args.name,
      slug: args.slug,
      isHiring: args.isHiring,
      createdAt: Date.now(),
    });

    return { success: true, id: locationId };
  },
});

/**
 * Update a location
 * Requires: admin role
 */
export const update = mutation({
  args: {
    id: v.id("locations"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    isHiring: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If slug is being updated, check for conflicts
    if (updates.slug) {
      const existing = await ctx.db
        .query("locations")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Location with this slug already exists");
      }
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

/**
 * Delete a location
 * Requires: admin role
 */
export const remove = mutation({
  args: { id: v.id("locations") },
  handler: async (ctx, args) => {
    // Check if any job applications reference this location
    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_location", (q) => q.eq("locationId", args.id))
      .first();
    
    if (applications) {
      throw new Error("Cannot delete location with existing job applications");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

