export type ActionResult = { ok: true } | { ok: false; error: string };
export const ok = (): ActionResult => ({ ok: true });
export const fail = (msg: string): ActionResult => ({ ok: false, error: msg });

export async function withTry(
  action: string,
  fn: () => Promise<void>,
): Promise<ActionResult> {
  try {
    await fn();
    return ok();
  } catch (e: any) {
    console.error(`[admin] ${action} failed`, e);
    const msg = typeof e?.message === "string" ? e.message : "Unexpected error";
    return fail(msg);
  }
}
