export type ActionResult = { ok: true } | { ok: false; error: string };
export const ok = (): ActionResult => ({ ok: true });
export const fail = (msg: string): ActionResult => ({ ok: false, error: msg });

function humanizeDbError(raw: string): string {
  if (/UNIQUE constraint failed/i.test(raw)) {
    return "Already exists";
  }
  if (/FOREIGN KEY constraint failed/i.test(raw)) {
    return "Related item is missing";
  }
  if (/NOT NULL constraint failed/i.test(raw)) {
    return "A required field is missing";
  }
  if (/CHECK constraint failed/i.test(raw)) {
    return "Some values are invalid";
  }
  return "Unable to save changes";
}

export async function withTry(
  action: string,
  fn: () => Promise<void>,
): Promise<ActionResult> {
  try {
    await fn();
    return ok();
  } catch (e: unknown) {
    console.error(`[admin] ${action} failed`, e);
    const raw = e instanceof Error ? e.message : String(e);
    return fail(humanizeDbError(raw));
  }
}
