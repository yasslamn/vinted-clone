import ArticleForm from "@/components/ArticleForm";
import { getUserId } from "@/lib/userId";
import type { ArticleFormValues } from "@/schemas/article";
import { api } from "@/services/api";
import type { Article } from "@/types/article";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function EditArticlePage() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const articleId = useParams().id;
  const userId = getUserId();
  // query get article by id from url params

  const getArticleQuery = useQuery<Article>({
    queryKey: ["user-articles", articleId],
    queryFn: () => {
      return api.get<Article>("/api/articles/" + articleId);
    },
  });

  // update mutation + handler to pass as onSubmit prop
  const updateArticleMutation = useMutation({
    mutationFn: (data: ArticleFormValues) => {
      return api.put("/api/articles/" + articleId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-articles", articleId] });
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      navigate("/articles/" + articleId);
    }
  });

  const updateArticleHandler = (data: ArticleFormValues) => {
    return updateArticleMutation.mutate(data);
  };

  // use article form to display + pass query data as initial values + onSubmit handler
  if (getArticleQuery.isPending) {
    return <div>Chargement...</div>;
  }

  if (getArticleQuery.isError) {
    return (
      <div>
        Erreur lors du chargement de l'article : {getArticleQuery.error.message}
      </div>
    );
  }

  if (getArticleQuery.data?.userId !== userId) {
    return <div>Seul le créateur de l'annonce peut la modifier.</div>;
  }

  return (
    <>
      <ArticleForm
        onSubmit={updateArticleHandler}
        initialValues={getArticleQuery.data}
      />
    </>
  );
}
