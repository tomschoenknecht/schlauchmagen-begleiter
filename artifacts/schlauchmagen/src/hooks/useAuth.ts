import { useState, useEffect } from "react";

const TOKEN_KEY = "slm_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("slm_auth_change"));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("slm_auth_change"));
}

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [loading] = useState(false);

  useEffect(() => {
    const handler = () => setTokenState(getToken());
    window.addEventListener("slm_auth_change", handler);

    // Gleitende Session: gültigen Token bei jedem App-Start auf frische 30 Tage verlängern.
    const existing = getToken();
    if (existing) {
      fetch("/api/auth/refresh", { headers: { Authorization: `Bearer ${existing}` } })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d: { token?: string }) => {
          if (d.token) saveToken(d.token);
        })
        .catch((status) => {
          if (status === 401) clearToken();
        });
    }

    return () => window.removeEventListener("slm_auth_change", handler);
  }, []);

  const logout = () => clearToken();

  return { session: token ? { token } : null, loading, logout };
}
