/**
 * Central switch between the two ways this codebase is deployed:
 *
 * - "demo": a public build with fictional data only. Login is optional —
 *   visitors can click through the whole product without an account.
 * - "production": the private Synkro workspace. Only the landing page is
 *   public; every workspace route requires a signed-in user (enforced in
 *   `proxy.ts`).
 *
 * Controlled entirely by `NEXT_PUBLIC_APP_ENV` so the same code can be
 * deployed either way without a build-time branch. Defaults to "demo",
 * the safer default for an accidentally-unset env var (fictional data
 * exposed beats a private workspace exposed).
 *
 * Only reads `NEXT_PUBLIC_`-prefixed variables here on purpose — this
 * module is imported from both server and client components, and a
 * server-only secret (like `CLERK_SECRET_KEY`) must never end up in a
 * file that gets bundled for the browser.
 */

export type AppEnv = "demo" | "production";

export const APP_ENV: AppEnv =
  process.env.NEXT_PUBLIC_APP_ENV === "production" ? "production" : "demo";

export const isDemoMode = APP_ENV === "demo";
export const isProductionMode = APP_ENV === "production";

/**
 * Whether real Clerk credentials are configured. Without them, auth UI
 * degrades to a static hint instead of crashing — this repo must build and
 * run without committed secrets.
 */
export const CLERK_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
