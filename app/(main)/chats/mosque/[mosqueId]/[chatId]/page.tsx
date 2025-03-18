import { MosqueChatRoom } from "@/components/chat/mosque-chat-room";

interface MosqueChatPageProps {
  params: {
    mosqueId: string;
    chatId: string;
  };
}

export default function MosqueChatPage({ params }: MosqueChatPageProps) {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <MosqueChatRoom mosqueId={params.mosqueId} chatId={params.chatId} />
    </div>
  );
}
