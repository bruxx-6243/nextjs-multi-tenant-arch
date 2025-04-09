import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true, name: true, subdomain: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("API: Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
