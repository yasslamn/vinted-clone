import type { Article } from "@/types/article";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  article: Article;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ArticleCard({
  article,
  onEdit,
  onDelete,
}: ArticleCardProps) {
  return (
    <div className="w-full rounded-xl bg-white shadow transition-shadow hover:shadow-lg overflow-hidden">
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
        <div className="flex gap-2 p-3 pt-0">
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
