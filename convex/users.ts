import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get the Stripe Connect ID of a user by userId
 */
export const getUsersStripeConnectId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    return user?.stripeConnectId ?? null;
  },
});

/**
 * Update or create the Stripe Connect ID for an existing user
 */
export const updateOrCreateUserStripeConnectId = mutation({
  args: { userId: v.string(), stripeConnectId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    // Create user if not exists
    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        userId: args.userId,
        name: "Unnamed", // placeholder
        email: "unknown@example.com", // placeholder
        stripeConnectId: args.stripeConnectId,
      });
      return newUserId;
    }

    // If user exists, just patch stripeConnectId
    await ctx.db.patch(user._id, { stripeConnectId: args.stripeConnectId });
    return user._id;
  },
});

/**
 * Update user info (name, email), or create a new user if not exists
 */
export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, email });
      return existingUser._id;
    }

    const newUserId = await ctx.db.insert("users", {
      userId,
      name,
      email,
      stripeConnectId: undefined,
    });

    return newUserId;
  },
});

/**
 * Get full user document by userId
 */
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return user ?? null;
  },
});

/**
 * Optional utility: Create user if not exists
 */
export const createUserIfNotExists = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        userId,
        name,
        email,
        stripeConnectId: undefined,
      });
      return newUserId;
    }

    return user._id;
  },
});
