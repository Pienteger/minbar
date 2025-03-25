interface StoredToken {
  accessToken: string;
  refreshToken: string;
}

const TOKEN_KEY = "auth_token";

export function setStoredTokens(tokens: StoredToken) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function getStoredToken(): StoredToken | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_KEY);
}
