import { draftMode } from "next/headers";

export async function GET() {
  // remove preview cookie
  draftMode().disable();
  return new Response("Draft mode is disabled");
}
