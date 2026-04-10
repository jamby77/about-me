export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export const ok = (): ActionResult => ({ ok: true });
export const fail = (msg: string): ActionResult => ({ ok: false, error: msg });

/**
 * Build a validation-failure ActionResult from a flattened zod error.
 * Pass `z.flattenError(error)` from the call site so this module stays
 * zod-free.
 */
export function failValidation(
  flat: {
    formErrors: string[];
    fieldErrors: Record<string, string[] | undefined>;
  },
  fallback = "Some fields need attention",
): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const [key, errs] of Object.entries(flat.fieldErrors)) {
    if (errs && errs.length > 0) {
      fieldErrors[key] = errs[0];
    }
  }
  const message = flat.formErrors[0] || fallback;
  return { ok: false, error: message, fieldErrors };
}

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
