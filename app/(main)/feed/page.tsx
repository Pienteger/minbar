import { PostList } from "@/components/feed/post-list";
import { StoryList } from "@/components/feed/story-list";
import { CreatePostButton } from "@/components/feed/create-post-button";
import { DesktopRightSidebar } from "@/components/navigation/desktop-right-sidebar";

export default function FeedPage() {
  return (
    // <div className="lg:flex lg:space-x-6">
    <div className="lg:flex lg:space-x-6 mx-auto max-w-5xl">
      <div className="flex-1 space-y-4 py-4">
        <StoryList />
        <CreatePostButton />
        <PostList />
      </div>

      {/* Desktop Right Sidebar - Only visible on large screens */}
      <div className="hidden lg:block lg:w-80">
        <DesktopRightSidebar />
      </div>
    </div>
  );
}
