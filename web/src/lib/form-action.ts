import { getActionErrorMessage, isRedirectError } from "@/lib/errors";

export type FormState = { error?: string };

export async function runFormAction(
  fn: () => Promise<void>,
): Promise<FormState> {
  try {
    await fn();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { error: getActionErrorMessage(error) };
  }
  return {};
}
