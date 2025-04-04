"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateMosqueButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/mosques/create")}
      className="flex items-center gap-2"
    >
      <Plus size={16} />
      Create Mosque
    </Button>
  );
}
