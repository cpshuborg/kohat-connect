import { useQuery } from "@tanstack/react-query";
import { fetchListingRequests } from "@/lib/listing-requests-api";

export function useListingRequests() {
  const query = useQuery({
    queryKey: ["listing-requests"],
    queryFn: fetchListingRequests,
  });

  return {
    requests: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
