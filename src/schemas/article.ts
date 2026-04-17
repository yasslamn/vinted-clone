import { z } from "zod";
import { CATEGORIES, CONDITIONS } from "../types/article";

export const articleSchema = z.object({
    title: z.string().min(3, "le title doit contenir au moins 3 caractères").max(100, "le title doit contenir no more than 100 characters"),
    description: z.string().min(10, "la description doit contenir au moins 10 caractères").max(1000, "la description doit contenir no more than 1000 characters"),
    price: z.coerce.number().positive("le prix doit être un nombre positif"),
    category: z.enum(CATEGORIES.map((c) => c.id), "la catégorie est requise"),
    condition: z.enum(CONDITIONS.map((c) => c.value), "l'état est requis"),
    size: z.string().min(1, "la taille est requise"),
    imageUrl: z.url("l'URL de l'image n'est pas valide"),

});

export type ArticleFormValues = z.infer<typeof articleSchema>;
