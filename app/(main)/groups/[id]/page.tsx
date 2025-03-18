import { GroupDetail } from "@/components/groups/group-detail"

export default function GroupPage({ params }: { params: { id: string } }) {
  return <GroupDetail groupId={params.id} />
}

