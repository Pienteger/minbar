import { ChatRoom } from "@/components/chat/chat-room"

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="-mx-4 -mt-4 lg:-mx-0 lg:-mt-0">
      <ChatRoom chatId={params.id} />
    </div>
  )
}

