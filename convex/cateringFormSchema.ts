import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Default catering form schema with all predefined fields
 */
const defaultFormSchema = [
  {
    key: "locationId",
    label: "Which store?",
    enabled: true,
    required: true,
    order: 1,
    type: "select" as const,
    options: [] as string[], // Populated dynamically from locations
  },
  {
    key: "name",
    label: "Name",
    enabled: true,
    required: true,
    order: 2,
    type: "text" as const,
  },
  {
    key: "companyName",
    label: "Company Name",
    enabled: true,
    required: false,
    order: 3,
    type: "text" as const,
  },
  {
    key: "fulfillmentType",
    label: "Delivery or Pickup?",
    enabled: true,
    required: true,
    order: 4,
    type: "radio" as const,
    options: ["delivery", "pickup"],
  },
  {
    key: "deliveryAddress",
    label: "Delivery Address",
    enabled: true,
    required: true,
    order: 5,
    type: "textarea" as const,
    showWhen: {
      field: "fulfillmentType",
      equals: "delivery",
    },
  },
  {
    key: "email",
    label: "Email",
    enabled: true,
    required: true,
    order: 6,
    type: "text" as const,
  },
  {
    key: "phone",
    label: "Phone Number",
    enabled: true,
    required: true,
    order: 7,
    type: "text" as const,
  },
  {
    key: "alternatePhone",
    label: "Alternate Phone",
    enabled: true,
    required: false,
    order: 8,
    type: "text" as const,
  },
  {
    key: "orderDate",
    label: "Order Date",
    enabled: true,
    required: true,
    order: 9,
    type: "date" as const,
  },
  {
    key: "orderReadyTime",
    label: "Order Ready Time",
    enabled: true,
    required: true,
    order: 10,
    type: "time" as const,
  },
  {
    key: "numberOfPeople",
    label: "Number of People",
    enabled: true,
    required: true,
    order: 11,
    type: "text" as const,
  },
  {
    key: "cateringPackageOptions",
    label: "Catering Package Options",
    enabled: true,
    required: false,
    order: 12,
    type: "multiselect" as const,
    options: ["Package A", "Package B", "Package C", "Custom"],
  },
  {
    key: "pizzaOrderDetails",
    label: "Pizza Order Details",
    enabled: true,
    required: true,
    order: 13,
    type: "textarea" as const,
  },
  {
    key: "salads",
    label: "Salads",
    enabled: true,
    required: false,
    order: 14,
    type: "textarea" as const,
  },
  {
    key: "drinks",
    label: "Drinks",
    enabled: true,
    required: false,
    order: 15,
    type: "textarea" as const,
  },
  {
    key: "additionalNotes",
    label: "Additional Notes",
    enabled: true,
    required: false,
    order: 16,
    type: "textarea" as const,
  },
].sort((a, b) => a.order - b.order);

/**
 * Get the current catering form schema or return default
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("cateringFormSchema").first();

    if (!config) {
      return defaultFormSchema;
    }

    return config.fields.sort((a, b) => a.order - b.order);
  },
});

/**
 * Update the catering form schema
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
          v.literal("radio"),
          v.literal("multiselect"),
          v.literal("date"),
          v.literal("time")
        ),
        options: v.optional(v.array(v.string())),
        showWhen: v.optional(
          v.object({
            field: v.string(),
            equals: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("cateringFormSchema").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        fields: args.fields,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("cateringFormSchema", {
        fields: args.fields,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Reset to default schema
 */
export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("cateringFormSchema").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        fields: defaultFormSchema,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("cateringFormSchema", {
        fields: defaultFormSchema,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

