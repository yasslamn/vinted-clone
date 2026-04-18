import ArticleCard from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";
import { api } from "@/services/api";
import type { Article, Category, Condition, Sort } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CataloguePage() {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<Category>({ id: "", label: "" });
  const [condition, setCondition] = useState<Condition>({
    value: "",
    label: "",
  });
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>();
  const [sort, setSort] = useState<Sort>({ id: "", label: "" });

  const { favoriteIds } = useFavorites();

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<Article[]>({
    queryKey: [
      "articles-list",
      search,
      category,
      condition,
      priceMin,
      priceMax,
      sort,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category.id) params.append("category", category.id);
      if (condition.value) params.append("condition", condition.value);
      if (priceMin) params.append("priceMin", priceMin.toString());
      if (priceMax) params.append("priceMax", priceMax.toString());
      if (sort.id) params.append("sort", sort.id);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      return await api.get<Article[]>("/api/articles" + queryString);
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Catalogue</h1>
      <SearchBar
        onCategoryChange={setCategory}
        onConditionChange={setCondition}
        onPriceMaxChange={setPriceMax}
        onPriceMinChange={setPriceMin}
        onSearch={setSearch}
        onSortChange={setSort}
      />
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
            Aucun article ne correspond à vos envies
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={favoriteIds.has(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
