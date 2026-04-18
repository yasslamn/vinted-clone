import ArticleCard from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
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

  const { data, error, isLoading } = useQuery<Article[]>({
    queryKey: [
      "articles-list",
      search,
      category,
      condition,
      priceMin,
      priceMax,
      sort,
    ],
    initialData: [],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category.id);
      if (condition) params.append("condition", condition.value);
      if (priceMin) params.append("priceMin", priceMin.toString());
      if (priceMax) params.append("priceMax", priceMax.toString());
      if (sort) params.append("sort", sort.id);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      return await api.get<Article[]>("/api/articles" + queryString);
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {(error as Error).message}</p>;

  return (
    <div className="p-6">
      <SearchBar
        onCategoryChange={setCategory}
        onConditionChange={setCondition}
        onPriceMaxChange={() => {}}
        onPriceMinChange={() => {}}
        onSearch={setSearch}
        onSortChange={setSort}
      />
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-lg">
            Aucun article ne correspond à vos envies
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
