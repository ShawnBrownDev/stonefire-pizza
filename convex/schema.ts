import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for Stonefire Pizza
 * 
 * Tables:
 * - locations: Stores restaurant locations with hiring status
 * - jobApplications: Stores job application submissions with full details
 * - cateringRequests: Stores catering request submissions
 * - users: Stores admin users with role-based access
 * - formConfig: Stores form configuration (position options, optional fields)
 */
export default defineSchema({
  locations: defineTable({
    name: v.string(),
    slug: v.string(),
    isHiring: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_hiring", ["isHiring"]),

  jobApplications: defineTable({
    // Location reference - temporarily optional for migration
    locationId: v.optional(v.id("locations")),
    
    // Personal information - temporarily optional for migration
    // Legacy fields (old schema): email, name, phone, position
    fullName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()), // ISO date string
    phoneNumber: v.optional(v.string()),
    emailAddress: v.optional(v.string()),
    currentAddress: v.optional(v.string()),
    
    // Legacy field mappings (old schema compatibility)
    email: v.optional(v.string()), // Old: email -> New: emailAddress
    name: v.optional(v.string()), // Old: name -> New: fullName
    phone: v.optional(v.string()), // Old: phone -> New: phoneNumber
    position: v.optional(v.string()), // Old: position -> New: desiredPosition
    
    // Position
    desiredPosition: v.optional(v.string()),
    
    // Employment history
    formerEmployer1: v.optional(v.string()),
    formerEmployer2: v.optional(v.string()),
    
    // References
    references: v.optional(v.string()),
    
    // Availability - structured object
    // Temporarily allowing both string and object to migrate old data
    // TODO: After migration, remove v.union and keep only the object format
    availability: v.union(
      v.string(), // Legacy format (e.g., "everyday")
      v.object({
        monday: v.object({ am: v.boolean(), pm: v.boolean() }),
        tuesday: v.object({ am: v.boolean(), pm: v.boolean() }),
        wednesday: v.object({ am: v.boolean(), pm: v.boolean() }),
        thursday: v.object({ am: v.boolean(), pm: v.boolean() }),
        friday: v.object({ am: v.boolean(), pm: v.boolean() }),
        saturday: v.object({ am: v.boolean(), pm: v.boolean() }),
        sunday: v.object({ am: v.boolean(), pm: v.boolean() }),
      })
    ),
    
    // Additional information
    scheduleConflicts: v.optional(v.string()),
    favoriteColor: v.optional(v.string()),
    nicknames: v.optional(v.string()),
    favoriteBands: v.optional(v.string()),
    hobbies: v.optional(v.string()),
    workChallengeQuestion: v.optional(v.string()),
    
    // Status tracking
    status: v.optional(v.union(v.literal("new"), v.literal("reviewed"), v.literal("interviewed"), v.literal("denied"))),
    
    // Hiring workflow
    hiredAt: v.optional(v.number()), // null = active, timestamp = hired
    deniedAt: v.optional(v.number()), // null = active, timestamp = denied
    
    createdAt: v.number(),
  })
    .index("by_location", ["locationId"])
    .index("by_created", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_hired", ["hiredAt"])
    .index("by_denied", ["deniedAt"]),

  cateringRequests: defineTable({
    // Location reference
    locationId: v.optional(v.id("locations")),
    
    // Contact information
    name: v.optional(v.string()),
    companyName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    alternatePhone: v.optional(v.string()),
    
    // Fulfillment
    fulfillmentType: v.optional(v.union(v.literal("delivery"), v.literal("pickup"))),
    deliveryAddress: v.optional(v.string()),
    
    // Order details
    orderDate: v.optional(v.string()), // ISO date string
    orderReadyTime: v.optional(v.string()),
    numberOfPeople: v.optional(v.string()),
    cateringPackageOptions: v.optional(v.array(v.string())),
    pizzaOrderDetails: v.optional(v.string()),
    salads: v.optional(v.string()),
    drinks: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
    
    // Legacy fields for migration
    eventDate: v.optional(v.string()),
    guestCount: v.optional(v.string()),
    notes: v.optional(v.string()),
    
    createdAt: v.number(),
  })
    .index("by_location", ["locationId"])
    .index("by_fulfillment", ["fulfillmentType"])
    .index("by_created", ["createdAt"]),

  cateringFormSchema: defineTable({
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
        // Simple conditional: show field when another field equals a value
        showWhen: v.optional(
          v.object({
            field: v.string(), // Field key to check
            equals: v.string(), // Value to match
          })
        ),
      })
    ),
    updatedAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    passwordHash: v.optional(v.string()), // Hashed password (optional for existing users)
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  formConfig: defineTable({
    positionOptions: v.array(v.string()), // List of available positions
    showFavoriteColor: v.boolean(),
    showNicknames: v.boolean(),
    showFavoriteBands: v.boolean(),
    showHobbies: v.boolean(),
    updatedAt: v.number(),
  }),

  jobFormSchema: defineTable({
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
    updatedAt: v.number(),
  }),
});

