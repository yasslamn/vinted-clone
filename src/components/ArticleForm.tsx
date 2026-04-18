import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, type ArticleFormValues } from "../schemas/article";
import { CATEGORIES, CONDITIONS } from "../types/article";
import { z } from "zod";
import { useEffect } from "react";

type ArticleFormProps = {
  onSubmit: (data: ArticleFormValues) => void;
  initialValues?: ArticleFormValues;
  isSubmitting?: boolean;
  isDraft?: boolean;
};

export default function ArticleForm({
  onSubmit,
  initialValues,
  isSubmitting,
  isDraft,
}: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof articleSchema>, unknown, ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialValues,
  });

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
  const errorClass = "mt-1 text-sm text-red-600";

  useEffect(() => {
    if (!isDraft) return;
    const subscription = watch((values) => {
      localStorage.setItem("article-draft", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre
        </label>
        <input
          type="text"
          placeholder="Ex : Chemise en coton"
          className={inputClass}
          {...register("title")}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Décrivez votre article..."
          rows={4}
          className={inputClass}
          {...register("description")}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            className={inputClass}
            {...register("price")}
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taille
          </label>
          <input
            type="text"
            placeholder="Ex : M, Taille unique"
            className={inputClass}
            {...register("size")}
          />
          {errors.size && <p className={errorClass}>{errors.size.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select className={inputClass} {...register("category")}>
            <option value="">Sélectionner...</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            État
          </label>
          <select className={inputClass} {...register("condition")}>
            <option value="">Sélectionner...</option>
            {CONDITIONS.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
          {errors.condition && (
            <p className={errorClass}>{errors.condition.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de l'image
        </label>
        <input
          type="text"
          placeholder="https://..."
          className={inputClass}
          {...register("imageUrl")}
        />
        {errors.imageUrl && (
          <p className={errorClass}>{errors.imageUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Publication en cours..." : "Publier"}
      </button>
    </form>
  );
}
