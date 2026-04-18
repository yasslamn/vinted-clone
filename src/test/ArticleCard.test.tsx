import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import type { Article } from "@/types/article";

// Mock the api module
vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockArticle: Article = {
  id: "1",
  title: "T-shirt vintage",
  description: "Un beau t-shirt vintage en bon état",
  price: 25.5,
  category: "tops",
  condition: "bon_etat",
  size: "M",
  imageUrl: "https://example.com/image.jpg",
  userName: "JohnDoe",
  userId: "user123",
  createdAt: "2024-01-15T10:00:00Z",
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe("ArticleCard", () => {
  it("affiche le titre, le prix et la taille de l'article", () => {
    renderWithProviders(
      <ArticleCard article={mockArticle} isFavorite={false} />,
    );

    expect(screen.getByText("T-shirt vintage")).toBeInTheDocument();
    expect(screen.getByText("25.5 €")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("affiche l'étoile jaune quand l'article est en favori", () => {
    renderWithProviders(
      <ArticleCard article={mockArticle} isFavorite={true} />,
    );

    const starButton = screen.getByRole("button");
    const starIcon = starButton.querySelector("svg");

    expect(starIcon).toHaveClass("text-yellow-500");
    expect(starIcon).toHaveClass("fill-yellow-500");
  });

  it("affiche l'étoile grise quand l'article n'est pas en favori", () => {
    renderWithProviders(
      <ArticleCard article={mockArticle} isFavorite={false} />,
    );

    const starButton = screen.getByRole("button");
    const starIcon = starButton.querySelector("svg");

    expect(starIcon).toHaveClass("text-gray-600");
    expect(starIcon).not.toHaveClass("fill-yellow-500");
  });

  it("toggle l'état favori quand on clique sur l'étoile", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ArticleCard article={mockArticle} isFavorite={false} />,
    );

    const starButton = screen.getByRole("button");
    const starIcon = starButton.querySelector("svg");

    //gris de base
    expect(starIcon).toHaveClass("text-gray-600");

    //on ajoute au favc
    await user.click(starButton);

    //ça foit etre jaune
    expect(starIcon).toHaveClass("text-yellow-500");
    expect(starIcon).toHaveClass("fill-yellow-500");
  });

  it("affiche les boutons Modifier et Supprimer quand les callbacks sont fournis", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <ArticleCard
        article={mockArticle}
        isFavorite={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Modifier")).toBeInTheDocument();
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  it("appelle onDelete quand on clique sur Supprimer", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderWithProviders(
      <ArticleCard
        article={mockArticle}
        isFavorite={false}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByText("Supprimer"));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
