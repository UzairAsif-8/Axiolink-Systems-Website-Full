import axios from "axios";
import { API_ROOT, apiUrl } from "../../api/config.js";

export const api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthRoute =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/refresh") ||
      original?.url?.includes("/auth/logout");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        await axios.post(apiUrl("auth/refresh"), {}, { withCredentials: true });
        return api(original);
      } catch {
        if (!window.location.pathname.startsWith("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
