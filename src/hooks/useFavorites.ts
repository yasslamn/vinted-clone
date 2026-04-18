import { api } from "@/services/api";
import type { Article } from "@/types/article";
import { useQuery } from "@tanstack/react-query";

export function useFavorites() {
  const { data: favorites = [] } = useQuery<Article[]>({
    queryKey: ["favorites-list"],
    queryFn: async () => {
      return await api.get("/api/favorites");
    },
    staleTime: 1000 * 60 * 5, //cache 5 min
  });

  const favoriteIds = new Set(favorites.map((f) => f.id));

  return { favorites, favoriteIds };
}
