import { DisplayImageType } from "@/types/display-image-type";

export interface MosqueCardItemQueryResult {
  address: {
    city: string;
    country: {
      isoCode: string;
    };
  };
  imageUrls: string[];
  name: string;
  description: string;
  id: string;
  memberCount: number;
  displayImages: {
    imageUrl: string;
    displayImageType: DisplayImageType;
  }[];
}
