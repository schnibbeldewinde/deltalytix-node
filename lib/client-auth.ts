// Client-side auth helpers to avoid calling server-only cookie APIs directly
export async function signOutClient(redirectTo: string = "/") {
  try {
    await fetch("/api/auth/logout", { method: "POST" })
  } catch (error) {
    console.warn("[auth] signOutClient failed", error)
  } finally {
    // Ensure UI reflects the logout even if the request fails silently
    if (typeof window !== "undefined") {
      window.location.href = redirectTo
    }
  }
}
