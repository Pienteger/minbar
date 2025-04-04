import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Call the actual API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}/Mosque/CreateMosque`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to create mosque", details: errorText },
        { status: response.status }
      );
    }

    // For demo purposes, we'll return a mock mosque ID
    // In a real app, you would parse the response from the API
    return NextResponse.json({ mosqueId: "mosque-" + Date.now() });
  } catch (error) {
    console.error("Error creating mosque:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
