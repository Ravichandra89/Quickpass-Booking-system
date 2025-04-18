import EventList from "@/components/EventList";
import ChatButton from "@/components/ChatButton";

export default function Home() {
  const userId = "user123";
  return (
    <div className="">
      <EventList />

      <ChatButton userId={userId} />
    </div>
  );
}
