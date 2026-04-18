import {
  CATEGORIES,
  CONDITIONS,
  ORDERBY,
  type Category,
  type Condition,
  type Sort,
} from "@/types/article";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (search: string) => void;
  onSortChange: (sort: Sort) => void;
  onCategoryChange: (category: Category) => void;
  onConditionChange: (condition: Condition) => void;
  onPriceMinChange: (priceMin: number) => void;
  onPriceMaxChange: (priceMax: number) => void;
};

export const SearchBar = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  onPriceMaxChange,
  onPriceMinChange,
  onConditionChange,
}: SearchBarProps) => {
  const [search, setSearch] = useState<string>("");
  const [condition, setCondition] = useState<Condition>({
    value: "",
    label: "",
  });
  const [category, setCategory] = useState<Category>({ label: "", id: "" });
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>();
  const [sort, setSort] = useState<Sort>({ label: "", id: "" });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Barre de recherche */}
        <input
          type="text"
          value={search}
          placeholder="Rechercher un article..."
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            onSearch(value);
          }}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />

        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          <select
            value={category.id}
            onChange={(e) => {
              const selected = CATEGORIES.find(
                (cat) => cat.id === e.target.value,
              ) ?? { id: "", label: "" };
              setCategory(selected);
              onCategoryChange(selected);
            }}
            className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={condition.value}
            onChange={(e) => {
              const selected = CONDITIONS.find(
                (cond) => cond.value === e.target.value,
              ) ?? { value: "", label: "" };
              setCondition(selected);
              onConditionChange(selected);
            }}
            className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Tous les états</option>
            {CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>

          <select
            value={sort.id}
            onChange={(e) => {
              const selected = ORDERBY.find(
                (s) => s.id === e.target.value,
              ) ?? { id: "", label: "" };
              setSort(selected);
              onSortChange(selected);
            }}
            className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Trier par</option>
            {ORDERBY.map((orderBy) => (
              <option key={orderBy.id} value={orderBy.id}>
                {orderBy.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prix min/max */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Prix :</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceMin || ""}
              placeholder="Min"
              min={0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceMin(value);
                onPriceMinChange(value);
              }}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceMax || ""}
              placeholder="Max"
              min={0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceMax(value);
                onPriceMaxChange(value);
              }}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-400">€</span>
          </div>
        </div>
      </div>
    </div>
  );
};
