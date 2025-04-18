import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import Stripe from "stripe";
import { StripeCheckoutMetaData } from "@/app/actions/createStripeCheckoutSession";

export async function POST(req: Request) {
  console.log("🔔 Webhook received");

  const body = await req.text();
  
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  const convex = getConvexClient();

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("⚙️ Processing checkout.session.completed");

    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as StripeCheckoutMetaData;

    console.log("🧾 Metadata:", metadata);

    // Check if required metadata is present
    if (!metadata?.eventId || !metadata?.userId || !metadata?.waitingListId) {
      console.error("❌ Incomplete metadata:", metadata);
      return new Response("Incomplete metadata", { status: 400 });
    }

    try {
      // Log payment details
      console.log("💳 Payment Intent ID:", session.payment_intent);
      console.log("💵 Amount Total:", session.amount_total);

      // Trigger the mutation to create the ticket
      const result = await convex.mutation(api.events.purchaseTicket, {
        eventId: metadata.eventId,
        userId: metadata.userId,
        waitingListId: metadata.waitingListId,
        paymentInfo: {
          paymentIntentId: session.payment_intent as string,
          amount: session.amount_total ?? 0,
        },
      });

      // Log the result of the mutation
      console.log("🎫 Ticket purchased:", result);
    } catch (error) {
      console.error("❌ Error during mutation:", error);
      return new Response("Error processing purchase", { status: 500 });
    }
  } else {
    console.warn(`⚠️ Unexpected event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
