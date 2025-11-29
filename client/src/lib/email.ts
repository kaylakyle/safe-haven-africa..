export type SendResult = { ok: true } | { ok: false; error: string };

// BACKEND email route
const SERVER_URL =
  (import.meta.env.VITE_EMAIL_SERVER_URL as string) ||
  "http://localhost:5000/api/email";

export async function sendEmail(
  email: string,
  subject: string,
  body: string
): Promise<SendResult> {
  try {
    console.log(`[Email] Sending to ${SERVER_URL}/send-email`, {
      to: email,
      subject,
    });

    const resp = await fetch(`${SERVER_URL}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, subject, message: body }),
    });

    const data = await resp.json();

    console.log(
      `[Email] Server responded with status ${resp.status}`,
      data
    );

    if (!resp.ok) {
      return {
        ok: false,
        error:
          data?.error || `Email server responded with status ${resp.status}`,
      };
    }

    return { ok: true };
  } catch (err: any) {
    console.error(`[Email] Error:`, err);
    return { ok: false, error: err?.message || String(err) };
  }
}
