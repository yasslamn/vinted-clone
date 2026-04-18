import type { Article } from "@/types/article";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { api } from "@/services/api";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  onEdit?: () => void;
  onDelete?: () => void;
  isFavorite: boolean;
}

export default function ArticleCard({
  article,
  onEdit,
  onDelete,
  isFavorite,
}: ArticleCardProps) {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const queryClient = useQueryClient();

  const removeFromFavMutation = useMutation({
    mutationFn: async (articleId: string) => {
      await api.delete(`/api/favorites/${articleId}`);
    },
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites-list"] });

      const previousFavorites = queryClient.getQueryData(["favorites-list"]);

      queryClient.setQueryData(["favorites-list"], (old: Article[] = []) => {
        const exists = old.some((f) => f.id === articleId);
        if (exists) {
          return old.filter((f) => f.id !== articleId);
        }
        return [...old, article];
      });

      return { previousFavorites };
    },
    onError: (err, articleId, context) => {
      queryClient.setQueryData(["favorites-list"], context?.previousFavorites);
    },
  });

  const addToFavMutation = useMutation({
    mutationFn: async (articleId: string) => {
      await api.post(`/api/favorites/${articleId}`, {});
    },
    onMutate: async (articleId) => {
      //Annuler requêtes en cours
      await queryClient.cancelQueries({ queryKey: ["favorites-list"] });

      //Sauvragrde de l'ancien état
      const previousFavorites = queryClient.getQueryData(["favorites-list"]);

      // Mise à jour du cache en partant du principe que ça va être good (optimistic update)
      queryClient.setQueryData(["favorites-list"], (old: Article[] = []) => {
        const exists = old.some((f) => f.id === articleId);
        if (exists) {
          return old.filter((f) => f.id !== articleId); // Retirer
        }
        return [...old, article]; // Ajouter
      });

      return { previousFavorites };
    },
    onError: (err, articleId, context) => {
      queryClient.setQueryData(["favorites-list"], context?.previousFavorites); // si erreur on revient à l'état précédent
    },
  });

  function handleToggleFav(artcileIdToAdd: string) {
    if (!favorite) {
      addToFavMutation.mutateAsync(artcileIdToAdd);
    } else {
      removeFromFavMutation.mutateAsync(artcileIdToAdd);
    }
    setFavorite(!favorite);
  }

  return (
    <div className="relative w-full rounded-xl bg-white shadow transition-shadow hover:shadow-lg overflow-hidden">
      <button
        onClick={() => handleToggleFav(article.id)}
        className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full hover:bg-white"
      >
        <Star
          className={`w-5 h-5 ${favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-600 hover:text-yellow-500"}`}
        />
      </button>
      <Link to={"/articles/" + article.id}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="p-3">
        <p className="text-base font-semibold">{article.price} €</p>
        <Link to={"/articles/" + article.id}>
          <p className="text-sm text-gray-500 truncate">{article.title}</p>
        </Link>
      </div>
      <div className="px-3 pb-2 text-xs text-gray-400">
        <span>{article.size}</span>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex justify-center gap-2 p-3 pt-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
