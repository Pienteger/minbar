import {DisplayImageType} from "@/types/display-image-type";
import {restClient} from "@/lib/rest-client";
import {ServiceResponse} from "@/blueprints/ServiceResponse";
import {EntityType} from "@/types/entity-type";

export interface UploadImageRequest {
    entityId: number;
    imageFiles: File[];
    entityType: EntityType;
    displayImageType?: DisplayImageType | null;
}


export const imageApi = {
    uploadPhoto: (request: UploadImageRequest) => {
        const formData = new FormData();

        for (const file of request.imageFiles) {
            formData.append("imageFiles", file);
        }
        formData.append("entityId", request.entityId.toString());
        formData.append("entityType", request.entityType.toString());
        if (request.displayImageType) {
            formData.append("displayImageType", request.displayImageType.toString());
        }

        return restClient.post<ServiceResponse>(
            `/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};