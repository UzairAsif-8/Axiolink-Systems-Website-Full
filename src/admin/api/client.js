import axios from "axios";
import { API_ROOT, apiUrl } from "../../api/config.js";

export const api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
});

const isAdminPath = (pathname = window.location.pathname) =>
  pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

const isAuthEndpoint = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/refresh") ||
  url.includes("/auth/logout");

let refreshPromise = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(apiUrl("auth/refresh"), {}, { withCredentials: true })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Retry once on 401 via refresh (including /auth/me session restore).
    // Do not retry login/refresh/logout themselves.
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true;

      try {
        await refreshSession();
        return api(original);
      } catch {
        if (isAdminPath()) {
          window.location.href = "/admin/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
