import Home from "@/components/home";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const tenants = await prisma.tenant.findMany();

  if (!tenants) {
    return (
      <div>
        <h1>Error</h1>
        <p>Tenants not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Home />
    </div>
  );
}
