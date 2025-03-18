import { FriendProfileView } from "@/components/profile/friend-profile-view";

interface FriendProfilePageProps {
  params: {
    username: string;
  };
}

export default function FriendProfilePage({ params }: FriendProfilePageProps) {
  // In a real app, you would fetch the user data based on the username
  const username = decodeURIComponent(params.username);

  return (
    <div className="py-4">
      <FriendProfileView username={username} />
    </div>
  );
}
