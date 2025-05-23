import prisma from "@/lib/prisma";

export async function getTenantBySubdomain(subdomain: string) {
  if (process.env.NEXT_RUNTIME === "edge") {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tenants/${subdomain}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tenant");
    }
    return response.json();
  } else {
    return prisma.tenant.findUnique({
      where: { subdomain },
    });
  }
}

export async function getAllTenants() {
  return prisma.tenant.findMany();
}
