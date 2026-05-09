import { useQuery } from "@tanstack/react-query";

export function useStates() {
  return useQuery({
    queryKey: ["locations", "states"],
    queryFn: async () => {
      const res = await fetch("/api/locations?names_only=true");
      if (!res.ok) return [];
      const data = await res.json();
      return data.states || [];
    },
  });
}

export function useLgas(state: string) {
  return useQuery({
    queryKey: ["locations", "lgas", state],
    queryFn: async () => {
      const res = await fetch(
        `/api/locations/${encodeURIComponent(state)}?names_only=true`,
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.lgas || [];
    },
    enabled: !!state,
  });
}

export function useWards(state: string, lga: string) {
  return useQuery({
    queryKey: ["locations", "wards", state, lga],
    queryFn: async () => {
      const res = await fetch(
        `/api/locations/${encodeURIComponent(state)}/${encodeURIComponent(lga)}?names_only=true`,
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.wards || [];
    },
    enabled: !!state && !!lga,
  });
}
