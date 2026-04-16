import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { getUserId } from "../lib/userId";
import type { Article } from "../types/article";
import { useNavigate } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";

export default function MyArticlesPage() {
  const queryClient = useQueryClient();

  // Get All From User Query
  const userId = getUserId();
  const navigate = useNavigate();

  const getUserArticlesQuery = useQuery<Article[]>({
    queryKey: ["user-articles", userId],
    queryFn: () => {
      return api.get<Article[]>("/api/users/" + userId + "/articles");
    },
  });

  // OnDelete Mutation + handler to pass as a prop to the ArticleCard component

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId: string) => {
      return api.delete("/api/articles/" + articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
    },
  });

  const deleteArticleHandler = (articleId: string) => {
    if (window.confirm("Supprimer cet article ?")) {
      deleteArticleMutation.mutate(articleId);
    }
  };

  // OnEdit handler to pass as a prop to the ArticleCard component
  const onEditHandler = (articleId: string) => {
    // redirect to the edit page
    navigate("/articles/" + articleId + "/edit");
  };
  // If articles loading return loading state
  if (getUserArticlesQuery.isPending) {
    return <div>Chargement...</div>;
  }
  // If articles error return error state
  if (getUserArticlesQuery.isError) {
    return (
      <div>
        Erreur lors du chargement des articles :{" "}
        {getUserArticlesQuery.error.message}
      </div>
    );
  }
  // If no articles return empty state
  if (!getUserArticlesQuery.data || getUserArticlesQuery.data.length === 0) {
    return <div>Aucun article disponible.</div>;
  }
  // Else return the list of articles with the ArticleCard component
  return (
    <>
      {getUserArticlesQuery.data.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onDelete={() => deleteArticleHandler(article.id)}
          onEdit={() => onEditHandler(article.id)}
        />
      ))}
    </>
  );
}
