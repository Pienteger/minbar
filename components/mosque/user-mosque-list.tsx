import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import type { MembershipType, MosqueRole } from "@/types/mosque";

interface MosqueMembership {
  id: string;
  name: string;
  type: MembershipType;
  status: "active" | "pending" | "break" | "rejected";
  role: MosqueRole;
  profileImage: string;
  chatId: string;
}

interface UserMosqueListProps {
  memberships: MosqueMembership[];
}

export function UserMosqueList({ memberships }: UserMosqueListProps) {
  // Helper function to get role display name
  const getRoleDisplayName = (role: MosqueRole) => {
    const roleNames = {
      imam: "Imam",
      muezzin: "Muezzin",
      khadem: "Khadem",
      khatib: "Khatib",
      scholar: "Scholar",
      member: "Member",
    };
    return roleNames[role];
  };

  // Helper function to get membership type display name
  const getMembershipTypeDisplayName = (type: MembershipType) => {
    const typeNames = {
      home: "Home Mosque",
      office: "Office Mosque",
      roaming: "Roaming Mosque",
    };
    return typeNames[type];
  };

  // Helper function to get status display name and color
  const getStatusInfo = (status: string) => {
    const statusInfo = {
      active: { name: "Active", color: "bg-green-500" },
      pending: { name: "Pending Verification", color: "bg-amber-500" },
      break: { name: "On Break", color: "bg-blue-500" },
      rejected: { name: "Rejected", color: "bg-red-500" },
    };
    return statusInfo[status as keyof typeof statusInfo];
  };

  // Helper function to get role icon
  const getRoleIcon = (role: MosqueRole) => {
    const roleIcons = {
      imam: Icons.star,
      muezzin: Icons.mic,
      khadem: Icons.tool,
      khatib: Icons.bookOpen,
      scholar: Icons.graduationCap,
      member: Icons.user,
    };
    return roleIcons[role];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Mosque Memberships</h2>
        <Button variant="outline" size="sm" className="rounded-full">
          <Icons.add className="mr-1 h-4 w-4" />
          Join Mosque
        </Button>
      </div>

      {memberships.length === 0 ? (
        <Card className="border-dashed border-primary/20 bg-muted/30">
          <CardContent className="pt-6 text-center">
            <Icons.mosque className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-3 text-lg font-medium">No Mosque Memberships</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Join a mosque to connect with your local community
            </p>
            <Button className="mt-4" variant="default">
              <Icons.search className="mr-2 h-4 w-4" />
              Find Mosques
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberships.map((membership) => {
            const RoleIcon = getRoleIcon(membership.role);
            const statusInfo = getStatusInfo(membership.status);

            return (
              <Card
                key={membership.id}
                className="overflow-hidden border-primary/20 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={membership.profileImage || "/placeholder.svg"}
                        alt={membership.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {membership.name}
                      </CardTitle>
                      <CardDescription>
                        {getMembershipTypeDisplayName(membership.type)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <RoleIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {getRoleDisplayName(membership.role)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full ${statusInfo.color} mr-2`}
                      ></div>
                      <span className="text-sm">{statusInfo.name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Link href={`/mosques/${membership.id}`}>
                    <Button variant="ghost" size="sm">
                      View Mosque
                    </Button>
                  </Link>
                  <Link
                    href={`/chats/mosque/${membership.id}/${membership.chatId}`}
                  >
                    <Button variant="outline" size="sm">
                      <Icons.messageCircle className="mr-1 h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
