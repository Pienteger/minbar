import { CreateMosqueButton } from "@/components/mosque/create-mosque-button";
import { MosqueDiscovery } from "@/components/mosque/mosque-discovery";

export default function MosquesPage() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mosques</h1>
        <CreateMosqueButton />
      </div>
      <MosqueDiscovery />
    </div>
  );
}
