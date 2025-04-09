import prisma from "@/lib/prisma";

export default async function page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) {
    return new Response("Not Found", { status: 404 });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to {tenant.name}</h1>
      <p>This is a multitenant site for {subdomain}</p>
      <pre>{JSON.stringify(tenant, null, 2)}</pre>
    </div>
  );
}
