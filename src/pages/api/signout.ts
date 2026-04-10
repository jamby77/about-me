import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const signOutResponse = await auth.api.signOut({
    headers: request.headers,
    asResponse: true,
  });

  const headers = new Headers(signOutResponse.headers);
  headers.set("Location", "/login");
  return new Response(null, { status: 303, headers });
};
