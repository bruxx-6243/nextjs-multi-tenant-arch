import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  let hostname = req.headers.get("host") ?? "";

  hostname = hostname.split(":")[0];

  console.log("hostname", hostname);

  const allowedDomains = ["localhost"];

  const isMainDomain = allowedDomains.includes(hostname);

  const subdomain = isMainDomain ? null : hostname.split(".")[0];

  if (isMainDomain) {
    return NextResponse.next();
  }

  if (subdomain) {
    try {
      const response = await fetch(
        `${url.origin}/api/tenant?subdomain=${subdomain}`
      );

      if (response.ok) {
        return NextResponse.rewrite(
          new URL(`/${subdomain}${url.pathname}`, req.url)
        );
      }
    } catch (error) {
      console.error("Middleware: Error fetching tenant:", error);
    }
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)"],
};
