import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS, type Article } from "../types/article";
import { getUserId } from "../lib/userId";

type UserIconProps = {
  className?: string;
};

function UserIcon({ className }: UserIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full text-center py-12">
      <p className="text-xl text-gray-700 mb-4">{message}</p>
      <Link to="/" className="text-teal-600 hover:text-teal-700 text-sm">
        Revenir au catalogue
      </Link>
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = getUserId();

  if (!params.id) return;

  const articleId: string = params.id;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => api.get<Article>(`/api/articles/${articleId}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/articles/${articleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["user-articles"] });
      navigate("/my-articles");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Supprimer cet article ?")) {
      deleteMutation.mutate();
    }
  };

  if (isPending) {
    return <p>Chargement...</p>;
  }

  if (isError) {
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  const createdAtFormatted = new Date(data.createdAt);
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  return (
    <div className="space-y-6">
      {userId !== data.userId && (
        <Link
          to="/"
          className="inline-block text-sm text-teal-600 hover:text-teal-700"
        >
          &larr; Revenir au catalogue
        </Link>
      )}
      {userId === data.userId && (
        <Link
          to="/my-articles"
          className="inline-block text-sm text-teal-600 hover:text-teal-700"
        >
          &larr; Revenir à mes annonces
        </Link>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={data.imageUrl}
          alt={`Photo du produit : ${data.title}`}
          className="w-full md:w-96 rounded-lg object-cover aspect-square"
        />

        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserIcon className="size-5" />
            <span>{data.userName}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
          <p className="text-2xl font-semibold text-teal-600">{data.price} €</p>
          <p className="text-gray-600">{data.description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Taille</span>
              <span className="px-2 py-1 font-medium border border-gray-300 rounded-md">
                {data.size}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Catégorie</span>
              <span className="px-2 py-1 font-medium border border-gray-300 rounded-md">
                {CATEGORIES.find((c) => c.id === data.category)?.label ??
                  data.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">État</span>
              <span className="px-2 py-1 font-medium border border-gray-300 rounded-md">
                {CONDITIONS.find((c) => c.value === data.condition)?.label ??
                  data.condition}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Publiée le{" "}
            {createdAtFormatted.toLocaleDateString(
              undefined,
              dateFormatOptions,
            )}
          </p>

          {data.userId === userId && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate(`/articles/${articleId}/edit`)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
