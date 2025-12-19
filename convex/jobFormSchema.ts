import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Predefined field keys that map to job application schema
 */
const PREDEFINED_FIELDS = [
  { key: "locationId", label: "Location", type: "select" as const, required: true },
  { key: "fullName", label: "Full Name", type: "text" as const, required: true },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" as const, required: true },
  { key: "phoneNumber", label: "Phone Number", type: "text" as const, required: true },
  { key: "emailAddress", label: "Email Address", type: "text" as const, required: true },
  { key: "currentAddress", label: "Current Address", type: "textarea" as const, required: true },
  { key: "desiredPosition", label: "Desired Position", type: "select" as const, required: true },
  { key: "formerEmployer1", label: "Former Employer 1", type: "textarea" as const, required: true },
  { key: "formerEmployer2", label: "Former Employer 2", type: "textarea" as const, required: false },
  { key: "references", label: "References", type: "textarea" as const, required: true },
  { key: "availability", label: "Availability", type: "availability" as const, required: true },
  { key: "scheduleConflicts", label: "Schedule Conflicts", type: "textarea" as const, required: true },
  { key: "favoriteColor", label: "Favorite Color", type: "text" as const, required: false },
  { key: "nicknames", label: "Nicknames", type: "text" as const, required: false },
  { key: "favoriteBands", label: "Favorite Bands", type: "text" as const, required: false },
  { key: "hobbies", label: "Hobbies", type: "textarea" as const, required: false },
  { key: "workChallengeQuestion", label: "Work Challenge Question", type: "textarea" as const, required: true },
];

/**
 * Get default schema with all predefined fields
 */
function getDefaultSchema() {
  return {
    fields: PREDEFINED_FIELDS.map((field, index) => ({
      key: field.key,
      label: field.label,
      enabled: true,
      required: field.required,
      order: index,
      type: field.type,
      options: field.key === "desiredPosition" 
        ? ["Pizza Chef", "Server", "Delivery Driver", "Kitchen Assistant", "Other"]
        : undefined,
      locations: undefined,
    })),
    updatedAt: Date.now(),
  };
}

/**
 * Get job form schema
 * Returns default schema if none exists
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const schema = await ctx.db.query("jobFormSchema").first();
    
    if (!schema) {
      return getDefaultSchema();
    }

    return {
      fields: schema.fields,
      updatedAt: schema.updatedAt,
    };
  },
});

/**
 * Update job form schema
 * Requires: admin role (should be checked server-side)
 */
export const update = mutation({
  args: {
    fields: v.array(
      v.object({
        key: v.string(),
        label: v.string(),
        enabled: v.boolean(),
        required: v.boolean(),
        order: v.number(),
        type: v.union(
          v.literal("text"),
          v.literal("textarea"),
          v.literal("select"),
          v.literal("availability"),
          v.literal("date")
        ),
        options: v.optional(v.array(v.string())),
        locations: v.optional(v.array(v.id("locations"))),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Validate: all keys must be from predefined list
    const validKeys = new Set(PREDEFINED_FIELDS.map(f => f.key));
    for (const field of args.fields) {
      if (!validKeys.has(field.key)) {
        throw new Error(`Invalid field key: ${field.key}`);
      }
    }

    // Validate: locationId must always be enabled and required
    const locationField = args.fields.find(f => f.key === "locationId");
    if (!locationField || !locationField.enabled || !locationField.required) {
      throw new Error("locationId field must be enabled and required");
    }

    const existing = await ctx.db.query("jobFormSchema").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        fields: args.fields,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("jobFormSchema", {
        fields: args.fields,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Reset schema to defaults
 */
export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultSchema = getDefaultSchema();
    const existing = await ctx.db.query("jobFormSchema").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, defaultSchema);
    } else {
      await ctx.db.insert("jobFormSchema", defaultSchema);
    }

    return { success: true };
  },
});

