import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ArticleForm from "../components/ArticleForm";

describe("ArticleForm", () => {
  it("affiche les erreurs de validation quand on soumet un formulaire vide", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ArticleForm onSubmit={onSubmit} />);

    //On clic sans rienc remplire
    await user.click(screen.getByRole("button", { name: /publier/i }));

    //on attend les erreurs
    await waitFor(() => {
      expect(
        screen.getByText(/le title doit contenir au moins 3 caractères/i),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /la description doit contenir au moins 10 caractères/i,
        ),
      ).toBeInTheDocument();
    });

    //On verfie que ça a pas envoyé
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("affiche tous les champs du formulaire", () => {
    render(<ArticleForm onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText(/chemise en coton/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/décrivez votre article/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/taille unique/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://...")).toBeInTheDocument();
    expect(screen.getByText("Titre")).toBeInTheDocument();
    expect(screen.getByText("Catégorie")).toBeInTheDocument();
  });

  it("affiche 'Publication en cours...' quand isSubmitting est true", () => {
    render(<ArticleForm onSubmit={vi.fn()} isSubmitting={true} />);

    expect(
      screen.getByRole("button", { name: /publication en cours/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("pré-remplit les champs quand initialValues est fourni", () => {
    const initialValues = {
      title: "Mon article",
      description: "Une description de test",
      price: 50,
      size: "L",
      category: "tops" as const,
      condition: "bon_etat" as const,
      imageUrl: "https://example.com/image.jpg",
    };

    render(<ArticleForm onSubmit={vi.fn()} initialValues={initialValues} />);

    expect(screen.getByPlaceholderText(/chemise en coton/i)).toHaveValue("Mon article");
    expect(screen.getByPlaceholderText(/décrivez votre article/i)).toHaveValue(
      "Une description de test",
    );
    expect(screen.getByPlaceholderText("0,00")).toHaveValue(50);
    expect(screen.getByPlaceholderText(/taille unique/i)).toHaveValue("L");
  });
});
