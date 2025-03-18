import { GroupList } from "@/components/groups/group-list"
import { CreateGroupButton } from "@/components/groups/create-group-button"

export default function GroupsPage() {
  return (
    <div className="space-y-4 py-4">
      <CreateGroupButton />
      <GroupList />
    </div>
  )
}

