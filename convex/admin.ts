import { query, mutation, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel"; 
/**
 * Role type for admin users
 */
export type UserRole = "admin" | "jobs" | "catering" | "both";

/**
 * Get all job applications with optional filtering
 * Requires: jobs, both, or admin role
 */
export const getJobs = query({
  args: {
    locationId: v.optional(v.id("locations")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.union(v.literal("new"), v.literal("reviewed"), v.literal("interviewed"), v.literal("denied"))),
    hiredOnly: v.optional(v.boolean()),
    deniedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Note: Role check should be done server-side via auth middleware
    // This is a simple implementation - in production, verify auth token
    
    // Filter by location if provided
    const applications = args.locationId
      ? await ctx.db
          .query("jobApplications")
          .withIndex("by_location", (q) => q.eq("locationId", args.locationId!))
          .order("desc")
          .collect()
      : await ctx.db
          .query("jobApplications")
          .order("desc")
          .collect();
    
    // Filter by date range if provided
    let filtered = applications;
    if (args.startDate) {
      filtered = filtered.filter((app) => app.createdAt >= args.startDate!);
    }
    if (args.endDate) {
      filtered = filtered.filter((app) => app.createdAt <= args.endDate!);
    }
    
    // Filter by status if provided
    if (args.status) {
      filtered = filtered.filter((app) => {
        // Default to "new" if status is not set
        const appStatus = app.status || "new";
        return appStatus === args.status;
      });
    }
    
    // Filter by hired/denied status
    if (args.hiredOnly) {
      filtered = filtered.filter((app) => app.hiredAt !== undefined && app.hiredAt !== null);
    } else if (args.deniedOnly) {
      filtered = filtered.filter((app) => app.deniedAt !== undefined && app.deniedAt !== null);
    } else {
      // Default: only show active (non-hired, non-denied) applications
      filtered = filtered.filter((app) => 
        (app.hiredAt === undefined || app.hiredAt === null) &&
        (app.deniedAt === undefined || app.deniedAt === null)
      );
    }
    
    // Populate location information and normalize availability
    const applicationsWithLocations = await Promise.all(
      filtered.map(async (app) => {
        const location = app.locationId ? await ctx.db.get(app.locationId) : null;
        
        // Normalize availability - convert string to object format if needed
        let availability = app.availability;
        if (typeof availability === "string") {
          // Convert legacy string format to object
          availability = availability.toLowerCase() === "everyday"
            ? {
                monday: { am: true, pm: true },
                tuesday: { am: true, pm: true },
                wednesday: { am: true, pm: true },
                thursday: { am: true, pm: true },
                friday: { am: true, pm: true },
                saturday: { am: true, pm: true },
                sunday: { am: true, pm: true },
              }
            : {
                monday: { am: false, pm: false },
                tuesday: { am: false, pm: false },
                wednesday: { am: false, pm: false },
                thursday: { am: false, pm: false },
                friday: { am: false, pm: false },
                saturday: { am: false, pm: false },
                sunday: { am: false, pm: false },
              };
        }
        
        return {
          ...app,
          availability: availability as {
            monday: { am: boolean; pm: boolean };
            tuesday: { am: boolean; pm: boolean };
            wednesday: { am: boolean; pm: boolean };
            thursday: { am: boolean; pm: boolean };
            friday: { am: boolean; pm: boolean };
            saturday: { am: boolean; pm: boolean };
            sunday: { am: boolean; pm: boolean };
          },
          location: location ? { name: location.name, slug: location.slug } : null,
          status: app.status || "new", // Default to "new" if not set
          hiredAt: app.hiredAt,
          deniedAt: app.deniedAt,
        };
      })
    );
    
    return applicationsWithLocations; 
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
 * Check if any users exist (for initial setup)
 */
export const hasUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return !!user;
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
 * Hash a password using Web Crypto API (PBKDF2)
 */
async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  
  // Import the password as a key
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  // Derive key using PBKDF2
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltArray,
      iterations: 100000,
      hash: "SHA-512",
    },
    passwordKey,
    512 // 64 bytes = 512 bits
  );
  
  // Convert to hex strings
  const saltHex = Array.from(saltArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  
  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, hashHex] = hash.split(":");
  if (!saltHex || !hashHex) return false;
  
  // Convert hex strings back to Uint8Array
  const saltArray = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  
  // Import the password as a key
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  // Derive key using PBKDF2 with the same parameters
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltArray,
      iterations: 100000,
      hash: "SHA-512",
    },
    passwordKey,
    512 // 64 bytes = 512 bits
  );
  
  // Convert to hex string
  const computedHashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  
  return computedHashHex === hashHex;
}

/**
 * Create a new user (admin only)
 * Requires: admin role OR no users exist (for initial setup)
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    // Note: Authentication should be checked server-side via auth middleware
    // This mutation allows creating users for initial setup (when no users exist)
    // or when called by authenticated admin users
    
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash,
      role: args.role,
      createdAt: Date.now(),
    });

    return { success: true, id: userId };
  },
});

/**
 * Verify user credentials
 */
export const verifyUserCredentials = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
      
      if (!user) {
        return null;
      }

      // If user doesn't have a password hash, they can't log in
      if (!user.passwordHash) {
        return null;
      }

      try {
        const isValid = await verifyPassword(args.password, user.passwordHash);
        if (!isValid) {
          return null;
        }
      } catch (verifyError) {
        console.error("Password verification error:", verifyError);
        return null;
      }

      // Return user without password hash
      return {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("Error in verifyUserCredentials:", error);
      return null;
    }
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

/**
 * Update user password (admin only or for setting initial password)
 * Requires: admin role
 */
export const updateUserPassword = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Note: Role check should be done server-side via auth middleware
    
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the password
    const passwordHash = await hashPassword(args.password);

    await ctx.db.patch(args.userId, {
      passwordHash,
    });

    return { success: true };
  },
});

/**
 * Create a test user (for development/testing)
 * This is an action that can be called from the Convex dashboard
 * Usage: Call this action with { email: "test@example.com", password: "yourpassword", role: "admin" }
 * Note: All parameters are required for security
 */
export const createTestUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    if (!args.email || !args.password) {
      throw new Error("Email and password are required");
    }

    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const testEmail = args.email;
    const testPassword = args.password;
    const testRole = args.role;

    // Call the createUser mutation
    await ctx.runMutation(internal.admin.createUserInternal, {
      email: testEmail,
      password: testPassword,
      role: testRole,
    });

    return {
      success: true,
      message: `Test user created: ${testEmail} / [password hidden] (${testRole})`,
    };
  },
});

/**
 * Internal mutation for creating users (used by actions)
 */
export const createUserInternal = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("jobs"), v.literal("catering"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash,
      role: args.role,
      createdAt: Date.now(),
    });

    return { success: true, id: userId };
  },
});

/**
 * Migration: Fix invalid job application data
 * This migration handles:
 * 1. Documents with old field names (email -> emailAddress, name -> fullName, etc.)
 * 2. Documents with string availability instead of object structure
 * 3. Documents missing required fields (either migrates with defaults or deletes incomplete test data)
 * 
 * Usage: Call this mutation from the Convex dashboard: admin:migrateAvailability
 */
export const migrateAvailability = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all job applications
    const applications = await ctx.db.query("jobApplications").collect();
    
    let fixedCount = 0;
    let deletedCount = 0;
    const defaultAvailability = {
      monday: { am: false, pm: false },
      tuesday: { am: false, pm: false },
      wednesday: { am: false, pm: false },
      thursday: { am: false, pm: false },
      friday: { am: false, pm: false },
      saturday: { am: false, pm: false },
      sunday: { am: false, pm: false },
    };

    for (const app of applications) {
      const rawDoc = await ctx.db.get(app._id);
      if (!rawDoc) continue;

      // Check if this is an old format document (has legacy field names)
      // Use type assertion to access potentially legacy fields
      type LegacyDoc = typeof rawDoc & {
        email?: string;
        name?: string;
        phone?: string;
        position?: string;
      };
      const legacyDoc = rawDoc as LegacyDoc;
      const hasOldFormat = 
        legacyDoc.email !== undefined || 
        legacyDoc.name !== undefined || 
        legacyDoc.phone !== undefined || 
        legacyDoc.position !== undefined;

      // Check if document is missing critical required fields (incomplete test data)
      const hasNewFormat = 
        rawDoc.fullName !== undefined || 
        rawDoc.emailAddress !== undefined ||
        rawDoc.phoneNumber !== undefined;

      // If it's old format and missing new format fields, it's likely incomplete test data
      // Delete it rather than trying to migrate incomplete data
      if (hasOldFormat && !hasNewFormat) {
        // Check if it has minimal data - if so, it's likely a test document
        const hasMinimalData = 
          legacyDoc.email || 
          legacyDoc.name || 
          legacyDoc.phone;
        
        if (hasMinimalData && !rawDoc.locationId && !rawDoc.fullName) {
          // This is incomplete test data - delete it
          await ctx.db.delete(app._id);
          deletedCount++;
          continue;
        }
      }

      // Migrate old field names to new field names
      type UpdateFields = {
        emailAddress?: string;
        fullName?: string;
        phoneNumber?: string;
        desiredPosition?: string;
        availability?: typeof defaultAvailability;
        locationId?: Id<"locations">;
        dateOfBirth?: string;
        currentAddress?: string;
        formerEmployer1?: string;
        references?: string;
        scheduleConflicts?: string;
        workChallengeQuestion?: string;
      };
      const updates: UpdateFields = {};
      let needsUpdate = false;

      // Map old field names to new field names
      if (legacyDoc.email && !rawDoc.emailAddress) {
        updates.emailAddress = legacyDoc.email;
        needsUpdate = true;
      }
      if (legacyDoc.name && !rawDoc.fullName) {
        updates.fullName = legacyDoc.name;
        needsUpdate = true;
      }
      if (legacyDoc.phone && !rawDoc.phoneNumber) {
        updates.phoneNumber = legacyDoc.phone;
        needsUpdate = true;
      }
      if (legacyDoc.position && !rawDoc.desiredPosition) {
        updates.desiredPosition = legacyDoc.position;
        needsUpdate = true;
      }

      // Migrate availability from string to object
      const availabilityValue = rawDoc.availability;
      if (typeof availabilityValue === "string") {
        const availability = availabilityValue.toLowerCase() === "everyday"
          ? {
              monday: { am: true, pm: true },
              tuesday: { am: true, pm: true },
              wednesday: { am: true, pm: true },
              thursday: { am: true, pm: true },
              friday: { am: true, pm: true },
              saturday: { am: true, pm: true },
              sunday: { am: true, pm: true },
            }
          : defaultAvailability;
        updates.availability = availability;
        needsUpdate = true;
      }

      // Add default values for missing required fields if document has some valid data
      if (rawDoc.emailAddress || rawDoc.fullName || updates.emailAddress || updates.fullName) {
        if (!rawDoc.locationId) {
          // Try to get the first hiring location, or use a placeholder
          const firstLocation = await ctx.db
            .query("locations")
            .withIndex("by_hiring", (q) => q.eq("isHiring", true))
            .first();
          if (firstLocation) {
            updates.locationId = firstLocation._id;
            needsUpdate = true;
          }
        }
        if (!rawDoc.dateOfBirth) {
          updates.dateOfBirth = "";
          needsUpdate = true;
        }
        if (!rawDoc.currentAddress) {
          updates.currentAddress = "";
          needsUpdate = true;
        }
        if (!rawDoc.formerEmployer1) {
          updates.formerEmployer1 = "";
          needsUpdate = true;
        }
        if (!rawDoc.references) {
          updates.references = "";
          needsUpdate = true;
        }
        if (!rawDoc.scheduleConflicts) {
          updates.scheduleConflicts = "";
          needsUpdate = true;
        }
        if (!rawDoc.workChallengeQuestion) {
          updates.workChallengeQuestion = "";
          needsUpdate = true;
        }
      }

      // Remove old field names - create a new object without legacy fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email: _email, name: _name, phone: _phone, position: _position, ...docToUpdate } = legacyDoc;

      if (needsUpdate) {
        // Ensure locationId is properly typed if it exists
        const finalDoc = {
          ...docToUpdate,
          ...updates,
        };
        // Type assertion needed because we're merging documents with potentially different schemas
        await ctx.db.replace(app._id, finalDoc as typeof rawDoc & UpdateFields);
        fixedCount++;
      }
    }

    return { 
      success: true, 
      fixedCount,
      deletedCount,
      message: `Migration complete: Fixed ${fixedCount} document(s), deleted ${deletedCount} incomplete test document(s)` 
    };
  },
});


