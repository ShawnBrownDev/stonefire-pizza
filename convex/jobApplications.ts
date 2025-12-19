import { mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

type FormField = {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
  order: number;
  type: "text" | "textarea" | "select" | "availability" | "date";
  options?: string[];
  locations?: Id<"locations">[];
};

/**
 * Validate application data against schema
 */
async function validateApplication(ctx: QueryCtx, data: Record<string, unknown>) {
  const schema = await ctx.db.query("jobFormSchema").first();
  const fields = (schema?.fields || []) as FormField[];
  
  const locationId = data.locationId as Id<"locations"> | undefined;
  if (!locationId) {
    throw new Error("Location is required");
  }
  
  const enabledFields = fields.filter((f) => f.enabled);
  
  // Filter fields based on location restrictions
  const applicableFields = enabledFields.filter((field) => {
    // If field has location restrictions, check if current location is included
    if (field.locations && field.locations.length > 0) {
      return field.locations.some((locId) => locId === locationId);
    }
    // No restrictions means field applies to all locations
    return true;
  });
  
  const requiredFields = applicableFields.filter((f) => f.required);
  
  for (const field of requiredFields) {
    const value = data[field.key];
    
    if (field.type === "availability") {
      // Check if at least one time slot is selected
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`${field.label} is required`);
      }
      const availability = value as Record<string, { am?: boolean; pm?: boolean }>;
      const hasAvailability = Object.values(availability).some(
        (day) => day?.am || day?.pm
      );
      if (!hasAvailability) {
        throw new Error(`${field.label} is required`);
      }
    } else if (!value || (typeof value === "string" && !value.trim())) {
      throw new Error(`${field.label} is required`);
    }
  }
  
  // Validate email format
  if (data.emailAddress && typeof data.emailAddress === "string" && !data.emailAddress.includes("@")) {
    throw new Error("Invalid email address");
  }
}

/**
 * Mutation to submit a job application
 * 
 * Schema-driven: Fields are validated based on jobFormSchema configuration.
 * All fields are optional in args, but validation enforces required fields from schema.
 * 
 * After successful submission, trigger email notification.
 * TODO: Integrate Resend API here to send email notification
 * to restaurant staff about new job application.
 */
export const submitApplication = mutation({
  args: {
    // Location - always required
    locationId: v.id("locations"),
    
    // Availability - always required
    availability: v.object({
      monday: v.object({ am: v.boolean(), pm: v.boolean() }),
      tuesday: v.object({ am: v.boolean(), pm: v.boolean() }),
      wednesday: v.object({ am: v.boolean(), pm: v.boolean() }),
      thursday: v.object({ am: v.boolean(), pm: v.boolean() }),
      friday: v.object({ am: v.boolean(), pm: v.boolean() }),
      saturday: v.object({ am: v.boolean(), pm: v.boolean() }),
      sunday: v.object({ am: v.boolean(), pm: v.boolean() }),
    }),
    
    // All other fields are optional - validation will check schema requirements
    fullName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    emailAddress: v.optional(v.string()),
    currentAddress: v.optional(v.string()),
    desiredPosition: v.optional(v.string()),
    formerEmployer1: v.optional(v.string()),
    formerEmployer2: v.optional(v.string()),
    references: v.optional(v.string()),
    scheduleConflicts: v.optional(v.string()),
    favoriteColor: v.optional(v.string()),
    nicknames: v.optional(v.string()),
    favoriteBands: v.optional(v.string()),
    hobbies: v.optional(v.string()),
    workChallengeQuestion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate against schema
    await validateApplication(ctx, args);
    
    // Verify location exists and is hiring
    const location = await ctx.db.get(args.locationId);
    if (!location) {
      throw new Error("Invalid location");
    }
    if (!location.isHiring) {
      throw new Error("This location is not currently hiring");
    }

    // Build the application document - only include fields that were provided
    // Type matches the schema which allows optional fields
    type ApplicationData = {
      locationId?: Id<"locations">;
      availability: string | {
        monday: { am: boolean; pm: boolean };
        tuesday: { am: boolean; pm: boolean };
        wednesday: { am: boolean; pm: boolean };
        thursday: { am: boolean; pm: boolean };
        friday: { am: boolean; pm: boolean };
        saturday: { am: boolean; pm: boolean };
        sunday: { am: boolean; pm: boolean };
      };
      createdAt: number;
      fullName?: string;
      dateOfBirth?: string;
      phoneNumber?: string;
      emailAddress?: string;
      currentAddress?: string;
      desiredPosition?: string;
      formerEmployer1?: string;
      formerEmployer2?: string;
      references?: string;
      scheduleConflicts?: string;
      favoriteColor?: string;
      nicknames?: string;
      favoriteBands?: string;
      hobbies?: string;
      workChallengeQuestion?: string;
      status?: "new" | "reviewed" | "interviewed" | "denied";
    };

    const applicationData: ApplicationData = {
      locationId: args.locationId,
      availability: args.availability,
      status: "new", // Default status for new applications
      createdAt: Date.now(),
    };

    // Add optional fields only if they were provided
    if (args.fullName) applicationData.fullName = args.fullName;
    if (args.dateOfBirth) applicationData.dateOfBirth = args.dateOfBirth;
    if (args.phoneNumber) applicationData.phoneNumber = args.phoneNumber;
    if (args.emailAddress) applicationData.emailAddress = args.emailAddress;
    if (args.currentAddress) applicationData.currentAddress = args.currentAddress;
    if (args.desiredPosition) applicationData.desiredPosition = args.desiredPosition;
    if (args.formerEmployer1) applicationData.formerEmployer1 = args.formerEmployer1;
    if (args.formerEmployer2) applicationData.formerEmployer2 = args.formerEmployer2;
    if (args.references) applicationData.references = args.references;
    if (args.scheduleConflicts) applicationData.scheduleConflicts = args.scheduleConflicts;
    if (args.favoriteColor) applicationData.favoriteColor = args.favoriteColor;
    if (args.nicknames) applicationData.nicknames = args.nicknames;
    if (args.favoriteBands) applicationData.favoriteBands = args.favoriteBands;
    if (args.hobbies) applicationData.hobbies = args.hobbies;
    if (args.workChallengeQuestion) applicationData.workChallengeQuestion = args.workChallengeQuestion;

    const applicationId = await ctx.db.insert("jobApplications", applicationData);

    // TODO: Email notification integration
    // Example with Resend:
    // await sendEmail({
    //   to: "hiring@stonefirepizza.com",
    //   subject: "New Job Application",
    //   html: `New application from ${args.fullName} for ${args.desiredPosition} at ${location.name}...`
    // });

    return { success: true, id: applicationId };
  },
});

/**
 * Update job application status
 * Admin only - status updates should be protected by admin auth
 */
export const updateStatus = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    status: v.union(v.literal("new"), v.literal("reviewed"), v.literal("interviewed"), v.literal("denied")),
  },
  handler: async (ctx, args) => {
    // Verify application exists
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Update status
    await ctx.db.patch(args.applicationId, {
      status: args.status,
    });

    return { success: true };
  },
});

/**
 * Mark job application as hired
 * Admin only - sets hiredAt timestamp
 */
export const markJobAsHired = mutation({
  args: {
    applicationId: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    // Verify application exists
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Mark as hired
    await ctx.db.patch(args.applicationId, {
      hiredAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Undo hire - clear hiredAt to make application active again
 * Admin only
 */
export const undoHire = mutation({
  args: {
    applicationId: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    // Verify application exists
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Clear hiredAt
    await ctx.db.patch(args.applicationId, {
      hiredAt: undefined,
    });

    return { success: true };
  },
});

/**
 * Mark job application as denied
 * Admin only - sets deniedAt timestamp
 */
export const markJobAsDenied = mutation({
  args: {
    applicationId: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    // Verify application exists
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Mark as denied
    await ctx.db.patch(args.applicationId, {
      deniedAt: Date.now(),
      status: "denied",
    });

    return { success: true };
  },
});

/**
 * Undo deny - clear deniedAt to make application active again
 * Admin only
 */
export const undoDeny = mutation({
  args: {
    applicationId: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    // Verify application exists
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Clear deniedAt
    await ctx.db.patch(args.applicationId, {
      deniedAt: undefined,
      status: "new", // Reset to new status
    });

    return { success: true };
  },
});

