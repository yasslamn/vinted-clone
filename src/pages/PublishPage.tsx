import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ArticleFormValues } from "../schemas/article";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";

export default function PublishPage() {
  const queryClient = useQueryClient();
  
  const navigate = useNavigate();

  const createArticleMutation = useMutation({
    mutationFn: (article: ArticleFormValues): Promise<{ id: string }> => {
      return api.post("/api/articles", article);
    },
    onSuccess: (data: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["user-articles"] });
      navigate("/articles/" + data.id);
    },
  });

  const submitHandler = (data: ArticleFormValues) => {
    createArticleMutation.mutate(data);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publier un article</h1>
      {createArticleMutation.isError && (
        <p className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{createArticleMutation.error.message}</p>
      )}
      <ArticleForm onSubmit={submitHandler} isSubmitting={createArticleMutation.isPending} />
    </>
  );
}
