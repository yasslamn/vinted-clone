import ArticleCard from "@/components/ArticleCard";
import { useFavorites } from "@/hooks/useFavorites";
import { api } from "@/services/api";
import type { Article } from "@/types/article";
import { useQuery } from "@tanstack/react-query";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const { data = [], error, isLoading } = useQuery<Article[]>({
    queryKey: ["favorites-list"],
    queryFn: async () => {
      return await api.get<Article[]>("/api/favorites");
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Mes favoris</h1>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-16">
          <p className="text-red-500">Erreur: {(error as Error).message}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-lg">
            Vous n'avez aucune favoris. Gingembre
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={() => {}}
              isFavorite={favoriteIds.has(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
