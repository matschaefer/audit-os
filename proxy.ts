import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Route protection for the two deployment modes (see `lib/app-env.ts`).
 *
 * Named `proxy.ts` per the Next.js 16 file convention (the "middleware"
 * convention it replaces); the exported function still has the same
 * request/response shape Clerk's middleware helper expects.
 *
 * - demo: nothing is protected. Visitors can click through the entire
 *   product without signing in.
 * - production: everything requires a signed-in user except the landing
 *   page ("/"), which stays public so the product can be found and
 *   explained before anyone logs in.
 *
 * Only `NEXT_PUBLIC_APP_ENV` and `CLERK_SECRET_KEY` presence are read
 * directly here (this file runs on the server/edge only, never bundled
 * for the browser, so reading the secret key name directly is safe).
 *
 * If Clerk isn't configured yet (no keys), demo mode remains open so
 * `npm run dev` / `npm run build` never fail for lack of credentials.
 * Production mode fails closed by allowing only "/" and redirecting
 * workspace routes back to the public landing page.
 */

const isProductionMode = process.env.NEXT_PUBLIC_APP_ENV === "production";
const CLERK_CONFIGURED = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

const isPublicRoute = createRouteMatcher(["/"]);

const protectedMiddleware = clerkMiddleware(async (auth, req) => {
  if (!isProductionMode) return; // demo mode: login is always optional
  if (isPublicRoute(req)) return; // landing page stays public in production too

  await auth.protect();
});

export default CLERK_CONFIGURED
  ? protectedMiddleware
  : (req: Request) => {
      if (!isProductionMode) return NextResponse.next();

      const { pathname } = new URL(req.url);
      if (pathname === "/") return NextResponse.next();

      return NextResponse.redirect(new URL("/", req.url));
    };

// Official Clerk matcher: run on everything except static assets and
// Next.js internals, plus always run on API/tRPC routes.
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
