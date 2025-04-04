"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {Loader2, MapPin} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import {toast} from "@/components/ui/use-toast";
import {ImageUpload} from "./image-upload";
import {CountrySelect} from "../ui/country-select";
import {CreateMosqueData, mosqueApi} from "@/lib/apis/mosque-api";

// Form schema with validation
const createMosqueSchema = z.object({
    name: z.string().min(3, "Mosque name must be at least 3 characters"),
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    stateOrProvince: z.string().min(2, "State or province is required"),
    postalCode: z.string().optional(),
    countryIsoCode: z.string().min(2, "Country is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    capacity: z.number().int().nonnegative(),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    website: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
});

type CreateMosqueFormValues = z.infer<typeof createMosqueSchema>;

export default function CreateMosqueForm() {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with default values
    const form = useForm<CreateMosqueFormValues>({
        resolver: zodResolver(createMosqueSchema),
        defaultValues: {
            name: "",
            street: "",
            city: "",
            stateOrProvince: "",
            postalCode: "",
            countryIsoCode: "",
            latitude: undefined,
            longitude: undefined,
            capacity: undefined,
            description: "",
            website: "",
        }
    });

    // Handle form submission
    async function onSubmit(data: CreateMosqueFormValues) {
        setIsSubmitting(true);

        try {

            const mosqueCreationResponse = await mosqueApi.create(data);

            if (mosqueCreationResponse.status !== 200
                || !mosqueCreationResponse.data.isSuccess
                || !mosqueCreationResponse.data.data) {
                toast({
                    title: "Failed to create mosque",
                    description: "Please try again later.",
                    variant: "destructive",
                });
                return;
            }

            const mosqueId = mosqueCreationResponse.data.data as number;

            // Step 2: Upload profile image if provided
            if (profileImage) {
                await mosqueApi.uploadPhoto(mosqueId, profileImage);
            }

            // Step 3: Upload cover image if provided
            if (coverImage) {
                await mosqueApi.uploadCoverPhoto(mosqueId, coverImage);
            }

            toast({
                title: "Mosque created successfully",
                description:
                    "Your mosque has been created and is now visible in the community",
            });

            // Redirect to the mosque page
            router.push(`/mosques/${mosqueId}`);
        } catch (error) {
            console.error("Error creating mosque:", error);
            toast({
                title: "Failed to create mosque",
                description:
                    "There was an error creating your mosque. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle getting current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    form.setValue("latitude", position.coords.latitude);
                    form.setValue("longitude", position.coords.longitude);
                    toast({
                        title: "Location detected",
                        description: "Your current location has been added to the form",
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast({
                        title: "Location detection failed",
                        description:
                            "Unable to get your current location. Please enter coordinates manually.",
                        variant: "destructive",
                    });
                }
            );
        } else {
            toast({
                title: "Geolocation not supported",
                description:
                    "Your browser does not support geolocation. Please enter coordinates manually.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Mosque Profile Image</h3>
                        <ImageUpload
                            onImageSelected={(file) => setProfileImage(file)}
                            aspectRatio="1:1"
                            maxSize={5}
                            className="h-64"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload a square image for your mosque profile. Max size: 5MB.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Mosque Cover Image</h3>
                        <ImageUpload
                            onImageSelected={(file) => setCoverImage(file)}
                            aspectRatio="16:9"
                            maxSize={10}
                            className="h-64"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload a wide image for your mosque cover. Max size: 10MB.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Mosque Details Form */}
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Basic Information</h3>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Mosque Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter mosque name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter a brief description of the mosque"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Provide details about the mosque, its history, and
                                                community.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="capacity"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Capacity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Estimated capacity"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                                    ? Number.parseInt(e.target.value)
                                                                    : undefined
                                                            )
                                                        }
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Approximate number of worshippers the mosque can
                                                    accommodate
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-medium">Location Information</h3>

                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Street Address*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>City*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stateOrProvince"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>State/Province*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="State or Province" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="postalCode"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Postal Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Postal Code" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="countryIsoCode"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Country*</FormLabel>
                                                <FormControl>
                                                    <CountrySelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="latitude"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="Latitude"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                                    ? Number.parseFloat(e.target.value)
                                                                    : undefined
                                                            )
                                                        }
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="longitude"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="Longitude"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                                    ? Number.parseFloat(e.target.value)
                                                                    : undefined
                                                            )
                                                        }
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={getCurrentLocation}
                                    className="flex items-center gap-2"
                                >
                                    <MapPin size={16}/>
                                    Use Current Location
                                </Button>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    )}
                                    Create Mosque
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
