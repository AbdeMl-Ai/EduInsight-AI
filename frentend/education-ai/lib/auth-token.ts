export type WorkspaceRole = "admin" | "teacher" | "student";
export type AuthenticatedRole = WorkspaceRole | "user";

export function getRoleFromToken(
  token: string | undefined,
): AuthenticatedRole | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    ) as { role?: unknown; exp?: unknown };
    if (
      (payload.role === "admin" ||
        payload.role === "teacher" ||
        payload.role === "student" ||
        payload.role === "user") &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now() / 1000
    ) {
      return payload.role as AuthenticatedRole;
    }
    return null;
  } catch {
    return null;
  }
}

// This is a rendering gate only; FastAPI remains responsible for JWT validation.
export function hasWorkspaceAccess(
  token: string | undefined,
  role: WorkspaceRole,
): boolean {
  const tokenRole = getRoleFromToken(token);
  return tokenRole === role || (role === "student" && tokenRole === "user");
}
