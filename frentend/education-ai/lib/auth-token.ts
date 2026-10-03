export type WorkspaceRole = "admin" | "teacher" | "student";

// This is a rendering gate only; FastAPI remains responsible for JWT validation.
export function hasWorkspaceAccess(
  token: string | undefined,
  role: WorkspaceRole,
): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    ) as { role?: unknown; exp?: unknown };

    return (
      payload.role === role &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now() / 1000
    );
  } catch {
    return false;
  }
}
