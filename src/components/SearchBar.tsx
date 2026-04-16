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
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        value={search}
        placeholder="Rechercher un article..."
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          onSearch(value);
        }}
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <select
        value={category.id}
        onChange={(e) => {
          const selected = CATEGORIES.find(
            (cat) => cat.id === e.target.value,
          ) ?? { id: "", label: "" };
          setCategory(selected);
          onCategoryChange(selected);
        }}
        className="px-4 py-2 border rounded-lg"
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
        className="px-4 py-2 border rounded-lg"
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
            (sort) => sort.id === e.target.value,
          ) ?? { id: "", label: "" };

          setSort(selected);
          onSortChange(selected);
        }}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="">Trier Par</option>
        {ORDERBY.map((orderBy) => (
          <option key={orderBy.id} value={orderBy.id}>
            {orderBy.label}
          </option>
        ))}
      </select>
    </div>
  );
};
