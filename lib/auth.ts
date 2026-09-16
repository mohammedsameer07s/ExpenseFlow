export const STORAGE_KEYS = {
  users: "expenseflow_users",
  session: "expenseflow_session",
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEYS.users);
  if (!raw) {
    const seeded: StoredUser[] = [];
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([]));
    return [];
  }
}

export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function setSessionUser(user: { id: string; name: string; email: string }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

export function getSessionUser() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEYS.session);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as { id: string; name: string; email: string };
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return null;
  }
}

export function clearSessionUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.session);
}

export function isAuthenticated() {
  return Boolean(getSessionUser());
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name || !email || !password || password.length < 6) {
    throw new Error("Please fill all fields with a password of at least 6 characters.");
  }

  const users = getStoredUsers();
  const exists = users.some((user) => user.email === email);
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));

  const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
  setSessionUser(safeUser);
  return safeUser;
}

export async function loginUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  const users = getStoredUsers();
  const user = users.find((entry) => entry.email === email);
  if (!user) {
    throw new Error("No account was found for this email.");
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash && user.passwordHash !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  const safeUser = { id: user.id, name: user.name, email: user.email };
  setSessionUser(safeUser);
  return safeUser;
}
