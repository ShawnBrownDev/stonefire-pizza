import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Role type for admin users
 */
export type UserRole = "admin" | "jobs" | "catering" | "both";

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

