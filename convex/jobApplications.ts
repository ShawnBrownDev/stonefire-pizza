import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mutation to submit a job application
 * 
 * After successful submission, trigger email notification.
 * TODO: Integrate Resend API here to send email notification
 * to restaurant staff about new job application.
 */
export const submitApplication = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    position: v.string(),
    availability: v.string(),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const applicationId = await ctx.db.insert("jobApplications", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      position: args.position,
      availability: args.availability,
      resumeUrl: args.resumeUrl,
      createdAt: Date.now(),
    });

    // TODO: Email notification integration
    // Example with Resend:
    // await sendEmail({
    //   to: "hiring@stonefirepizza.com",
    //   subject: "New Job Application",
    //   html: `New application from ${args.name} for ${args.position}...`
    // });

    return { success: true, id: applicationId };
  },
});

