import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mosqueId = new URL(request.url).searchParams.get("MosqueId");

    if (!mosqueId) {
      return NextResponse.json(
        { error: "MosqueId is required" },
        { status: 400 }
      );
    }

    // Forward the request to the actual API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}/Mosque/UpdateCoverPicture?MosqueId=${mosqueId}`,
      {
        method: "POST",
        // Add authorization header if needed
        // headers: {
        //   "Authorization": `Bearer ${token}`
        // },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to upload mosque cover picture", details: errorText },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading mosque cover picture:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
