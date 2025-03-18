import { ChatRoom } from "@/components/chat/chat-room"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="-mx-4 -mt-4 lg:-mx-0 lg:-mt-0">
      <ChatRoom chatId={id} />
    </div>
  )
}

