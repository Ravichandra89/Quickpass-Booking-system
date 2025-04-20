import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create the Query and mutation function 
 */

export const getConversations = query({
    args: {userId : v.string()},
    handler: async (ctx, args) => {
        try {
            return await ctx.db
                .query("conversations")
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .order("asc")
                .take(10);
        } catch (error) {
            console.error("Error in getConversations:", error);
            return [];
        }
    }
})

export const save = mutation({
    args: {
        userId: v.string(),
        message: v.string(),
        sender: v.union(v.literal("user"), v.literal("assistant")),
        timestamp: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            await ctx.db.insert("conversations", args);
        } catch (error) {
            console.error("Error in Saving conversations: ", error);
        }
    }
})