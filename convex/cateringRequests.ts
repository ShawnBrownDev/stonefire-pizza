import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mutation to submit a catering request
 * 
 * After successful submission, trigger email notification.
 * TODO: Integrate Resend API here to send email notification
 * to restaurant staff about new catering request.
 */
export const submitRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    eventDate: v.string(),
    guestCount: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("cateringRequests", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      eventDate: args.eventDate,
      guestCount: args.guestCount,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // TODO: Email notification integration
    // Example with Resend:
    // await sendEmail({
    //   to: "catering@stonefirepizza.com",
    //   subject: "New Catering Request",
    //   html: `New catering request from ${args.name} for ${args.eventDate}...`
    // });

    return { success: true, id: requestId };
  },
});

