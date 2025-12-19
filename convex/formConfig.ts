import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get form configuration
 * Returns default config if none exists
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("formConfig").first();
    
    if (!config) {
      // Return default configuration
      return {
        positionOptions: [
          "Pizza Chef",
          "Server",
          "Delivery Driver",
          "Kitchen Assistant",
          "Other",
        ],
        showFavoriteColor: true,
        showNicknames: true,
        showFavoriteBands: true,
        showHobbies: true,
      };
    }

    return {
      positionOptions: config.positionOptions,
      showFavoriteColor: config.showFavoriteColor,
      showNicknames: config.showNicknames,
      showFavoriteBands: config.showFavoriteBands,
      showHobbies: config.showHobbies,
    };
  },
});

/**
 * Update form configuration
 * Requires: admin role
 */
export const update = mutation({
  args: {
    positionOptions: v.optional(v.array(v.string())),
    showFavoriteColor: v.optional(v.boolean()),
    showNicknames: v.optional(v.boolean()),
    showFavoriteBands: v.optional(v.boolean()),
    showHobbies: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("formConfig").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("formConfig", {
        positionOptions: args.positionOptions || [
          "Pizza Chef",
          "Server",
          "Delivery Driver",
          "Kitchen Assistant",
          "Other",
        ],
        showFavoriteColor: args.showFavoriteColor ?? true,
        showNicknames: args.showNicknames ?? true,
        showFavoriteBands: args.showFavoriteBands ?? true,
        showHobbies: args.showHobbies ?? true,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

