export type SessionUser = { id: string; name: string; email: string };

async function requestAuth(path: string, body?: object) {
  const response = await fetch(`/api/auth/${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.error || "Authentication request failed.");
  return result;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  return (await requestAuth("register", input)).user as SessionUser;
}

export async function loginUser(input: { email: string; password: string }) {
  return (await requestAuth("login", input)).user as SessionUser;
}

export async function getSessionUser() {
  try {
    return (await requestAuth("me")).user as SessionUser;
  } catch {
    return null;
  }
}

export async function clearSessionUser() {
  await requestAuth("logout", {});
}
