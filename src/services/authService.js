const API_URL =
  "http://98.90.238.74/api/login.php";

const USER_KEY = "pnk_user";

export async function loginUser(credentials) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("La API no entregó una respuesta válida.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No fue posible iniciar sesión.");
  }

  return data;
}

export function saveSession(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return getUser() !== null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}