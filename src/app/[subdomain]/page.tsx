import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ subdomain: string }>;
}>): Promise<Metadata> {
  const { subdomain } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) {
    return {
      title: "Tenant Not Found",
      description: "The requested tenant could not be found.",
    };
  }

  return {
    title: `${tenant.name} | Multitenant App`,
    description: `Welcome to ${tenant.name}, a multitenant site with subdomain ${subdomain}.`,
    openGraph: {
      title: `${tenant.name} | Multitenant App`,
      description: `Welcome to ${tenant.name}, a multitenant site with subdomain ${subdomain}.`,
      url: `https://${subdomain}.yourdomain.com`,
      siteName: "Multitenant App",
      images: [
        {
          url: "/thumbnail.jpg",
          width: 1200,
          height: 630,
          alt: `${tenant.name} Thumbnail`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tenant.name} | Multitenant App`,
      description: `Welcome to ${tenant.name}, a multitenant site with subdomain ${subdomain}.`,
      images: ["/thumbnail.jpg"],
    },
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ subdomain: string }>;
}>) {
  const { subdomain } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) {
    return new Response("Not Found", { status: 404 });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to {tenant.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This is a multitenant site for{" "}
            <span className="font-semibold text-indigo-600">{subdomain}</span>
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Tenant Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-medium text-indigo-600">Name:</span>{" "}
                {tenant.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-indigo-600">Subdomain:</span>{" "}
                {tenant.subdomain}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-indigo-600">ID:</span>{" "}
                {tenant.id}
              </p>
              {tenant.createdAt && (
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">
                    Created At:
                  </span>{" "}
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </p>
              )}
              {tenant.updatedAt && (
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">
                    Last Updated:
                  </span>{" "}
                  {new Date(tenant.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Raw Data
            </h2>
            <pre className="text-sm text-gray-600 bg-white p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(tenant, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
