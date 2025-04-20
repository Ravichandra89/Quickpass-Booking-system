/**
 * Creating the langchain tools for the Quickpass agent.
 */

import { Tool } from "langchain/tools";
import { z } from "zod";
import { ConvexClient } from "convex/browser";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const getAllEvents = tool(
  async () => {
    try {
      const events = await client.query("events:getAllEvents");
      return JSON.stringify(events);
    } catch (error) {
      console.error("Error in getAllEvents tool:", error);
      return JSON.stringify({ error: "Failed to fetch events" });
    }
  },
  {
    name: "getAllEvents",
    description: "Retrieve a list of all active events on the platform",
    schema: z.object({}),
  }
);

export const getUserUpcomingEvents = tool(
  async ({ userId }) => {
    try {
      const events = await client.query("events:getUserUpcomingEvents", {
        userId,
      });
      return JSON.stringify(events);
    } catch (error) {
      console.error("Error in getUserUpcomingEvents tool:", error);
      return JSON.stringify({ error: "Failed to fetch user upcoming events" });
    }
  },
  {
    name: "getUserUpcomingEvents",
    description: "Retrieve a user's upcoming events based on valid tickets",
    schema: z.object({
      userId: z.string().describe("User ID"),
    }),
  }
);
