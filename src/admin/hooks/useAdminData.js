import { useQuery } from "@tanstack/react-query";

/** Fetch admin data from the API — no mock fallbacks */
export function useAdminData(queryKey, fetchFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 30_000,
    retry: 1,
    ...options,
  });
}
