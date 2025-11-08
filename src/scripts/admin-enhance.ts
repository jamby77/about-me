const ROOT_ID = "admin-content";

function getRoot(): HTMLElement | null {
  return document.getElementById(ROOT_ID);
}

function replaceRootFromHTML(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const next = doc.getElementById(ROOT_ID);
  const current = getRoot();
  if (next && current) {
    current.replaceWith(next);
  }
}

function enhance() {
  // Intercept form submissions inside admin content and submit via fetch
  document.addEventListener(
    "submit",
    async (e) => {
      const form = e.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement)) return;
      const root = getRoot();
      if (!root || !root.contains(form)) return;
      if (form.dataset.sync === "true" || form.hasAttribute("data-sync"))
        return;

      const method = (form.method || "GET").toUpperCase();
      if (method !== "POST") return;

      e.preventDefault();
      const submitter = (e as SubmitEvent).submitter as
        | HTMLButtonElement
        | HTMLInputElement
        | null;

      const formData = new FormData(form);
      if (submitter && submitter.name) {
        formData.append(submitter.name, submitter.value);
      }

      const disable = (el: HTMLButtonElement | HTMLInputElement) => {
        (el as any).dataset.prevText =
          (el as HTMLButtonElement).textContent || "";
        el.disabled = true;
        if (el.tagName === "BUTTON")
          (el as HTMLButtonElement).textContent = "Saving...";
      };
      const enable = (el: HTMLButtonElement | HTMLInputElement) => {
        el.disabled = false;
        if (
          el.tagName === "BUTTON" &&
          (el as any).dataset.prevText !== undefined
        ) {
          (el as HTMLButtonElement).textContent = (el as any).dataset.prevText;
          delete (el as any).dataset.prevText;
        }
      };
      const buttons: (HTMLButtonElement | HTMLInputElement)[] = submitter
        ? [submitter]
        : Array.from(
            form.querySelectorAll(
              'button[type="submit"], input[type="submit"]',
            ),
          );
      buttons.forEach(disable);

      const targetUrl = form.action || window.location.href;

      try {
        const res = await fetch(targetUrl, {
          method: "POST",
          body: formData,
          credentials: "same-origin",
          redirect: "follow",
        });
        const html = await res.text();

        if (res.url && res.url !== window.location.href) {
          const url = new URL(res.url);
          history.replaceState({}, "", url.pathname + url.search + url.hash);
        }

        replaceRootFromHTML(html);
      } catch (err) {
        // Fallback to default navigation on failure
        form.submit();
      } finally {
        buttons.forEach(enable);
      }
    },
    true,
  );

  // Optional: intercept in-admin navigation links that only change search params (tab/edit links)
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const a = target.closest("a") as HTMLAnchorElement | null;
    if (!a) return;
    const root = getRoot();
    if (!root || !root.contains(a)) return;
    if (a.hasAttribute("data-sync")) return;

    const href = a.getAttribute("href");
    if (!href) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname !== window.location.pathname) return;

    // Only enhance if the link modifies the search (e.g., ?tab=..., edit=...)
    if (!url.search) return;

    e.preventDefault();
    try {
      const res = await fetch(url.toString(), {
        method: "GET",
        credentials: "same-origin",
      });
      const html = await res.text();
      history.replaceState({}, "", url.pathname + url.search + url.hash);
      replaceRootFromHTML(html);
    } catch {
      window.location.assign(url.toString());
    }
  });
}

export default enhance;
