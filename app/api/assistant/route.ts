import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex"; // ✅ correct import

export async function POST(req: Request) {
  const { userId, message } = await req.json();
  const msg = message.toLowerCase();

  const convexClient = getConvexClient(); // ✅ initialize the client

  // Q1: Event types
  if (msg.includes("type") && msg.includes("event")) {
    return NextResponse.json({
      reply:
        "QuickPass supports tech events, workshops, webinars, fests, and concerts.",
    });
  }

  // Q2: Upcoming events
  if (msg.includes("upcoming") || msg.includes("my events")) {
    const events = await convexClient.query(api.events.getUserUpcomingEvents, {
      userId,
    });

    if (!events || events.length === 0) {
      return NextResponse.json({ reply: "You have no upcoming events." });
    }

    const list = events
      .map((e: { name: string; eventDate: number }) => {
        const date = new Date(e.eventDate);
        return `• ${e.name} on ${date.toDateString()}`;
      })
      .join("\n");

    return NextResponse.json({ reply: `Here are your events:\n${list}` });
  }

  // Q3: How can I book an event?
  if (msg.includes("how") && msg.includes("book") && msg.includes("event")) {
    return NextResponse.json({
      reply:
        "To book an event, visit the QuickPass website, select your desired event, and follow the instructions to complete your booking.",
    });
  }

  // Q4: Can I cancel my event booking?
  if (msg.includes("cancel") && msg.includes("event")) {
    return NextResponse.json({
      reply:
        "Yes, you can cancel your event booking by visiting the 'My Events' section and selecting the 'Cancel' option next to your booking.",
    });
  }

  // Q5: How do I check event details?
  if (
    msg.includes("check") &&
    msg.includes("event") &&
    msg.includes("details")
  ) {
    return NextResponse.json({
      reply:
        "You can check event details by selecting the event on the QuickPass platform. This will show you information like the event name, date, location, and more.",
    });
  }

  // Q6: Can I reschedule my event?
  if (msg.includes("reschedule") && msg.includes("event")) {
    return NextResponse.json({
      reply:
        "Unfortunately, events cannot be rescheduled directly. You can cancel your booking and book a different event at your preferred time.",
    });
  }

  // Q7: How do I update my booking details?
  if (
    msg.includes("update") &&
    msg.includes("booking") &&
    msg.includes("details")
  ) {
    return NextResponse.json({
      reply:
        "To update your booking details, please visit the 'My Bookings' section and select the 'Edit' option next to your booking.",
    });
  }

  // Q8: Can I add guests to my booking?
  if (
    msg.includes("add") &&
    msg.includes("guests") &&
    msg.includes("booking")
  ) {
    return NextResponse.json({
      reply:
        "Yes, you can add guests to your booking during the booking process or by updating your booking through the 'My Bookings' section.",
    });
  }

  // Q9: How do I contact event organizers?
  if (
    msg.includes("contact") &&
    msg.includes("event") &&
    msg.includes("organizers")
  ) {
    return NextResponse.json({
      reply:
        "You can contact event organizers through the contact details provided in the event details page. Look for a 'Contact Organizer' button or section.",
    });
  }

  // Default fallback
  return NextResponse.json({
    reply:
      "I'm here to help with QuickPass bookings! Try asking: 'What type of events are supported?'",
  });
}
