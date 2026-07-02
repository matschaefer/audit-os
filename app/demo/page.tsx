import { redirect } from "next/navigation";

import { DEMO_AUDIT_ID } from "@/lib/demo-data";

/** Convenience entry point for recruiters/clients: always shows the flagship demo audit. */
export default function DemoPage() {
  redirect(`/audits/${DEMO_AUDIT_ID}`);
}
