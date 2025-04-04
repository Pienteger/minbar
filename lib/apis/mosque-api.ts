import {api} from "../api";
import {ServiceResponse} from "@/blueprints/ServiceResponse";


export interface CreateMosqueData {
    name: string
    street: string
    city: string
    stateOrProvince: string
    postalCode?: string
    countryIsoCode: string
    latitude?: number
    longitude?: number
    capacity: number
    description?: string
    website?: string
}

export const mosqueApi = {
    create: (data: CreateMosqueData) =>
        api.post<ServiceResponse<number>>("/Mosque/CreateMosque", data),
    uploadPhoto: (mosqueId: number, file: File) => {
        const formData = new FormData();
        formData.append("imageStream", file);
        formData.append("mosqueId", mosqueId.toString());
        return api.post<ServiceResponse>(
            `/Mosque/UploadPhoto`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
    uploadCoverPhoto: (mosqueId: number, file: File) => {
        const formData = new FormData();
        formData.append("imageStream", file);
        formData.append("mosqueId", mosqueId.toString());
        return api.post<ServiceResponse>(
            `/Mosque/UploadCoverPhoto`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }
}
