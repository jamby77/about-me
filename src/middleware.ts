import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Session lookup and `Astro.locals.user` / `.session` population run on
  // every request, including the public `/`. The home page doesn't read
  // them today, but keeping the population unconditional leaves room for
  // "sign in to edit" affordances on the public site later without
  // adding a second code path.
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  if (context.url.pathname.startsWith("/admin")) {
    if (!isAuthed) {
      return context.redirect("/login");
    }
    const role = (isAuthed.user as { role?: string | null }).role;
    if (role !== "admin") {
      return context.redirect("/");
    }
  }
  return next();
});
