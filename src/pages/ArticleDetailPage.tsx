import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

type UserIconProps = {
  className?: string;
}

function UserIcon({ className }: UserIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

type ErrorMessageProps = {
  message: string;
}

function ErrorMessage({message}: ErrorMessageProps){
  return <div className="w-full text-center">
    <p className="text-5xl mb-10">{message}</p>
    <Link to="/" className="text-neutral-400">Revenir au catalogue</Link>
  </div>
}

export default function ArticleDetailPage() {
  let params = useParams();

  if (!params.id) return;

  let articleId: string = params.id;

  const {isPending, isError, data, error} = useQuery({
    queryKey: ['article'],
    queryFn: async () => {
      const response = fetch(`/api/articles${articleId}`);
      if (! (await response).ok){
        if ((await response).status === 404){
          throw new Error("Article inexistant.");
        } else {
          throw new Error("Une erreur est survenue.")
        }
      }
      return (await response).json();
    },
    retry: 2,
    retryDelay: 250,
  });

  if (isPending){
    return <p>Chargement...</p>;
  }

  if (isError){
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  let createdAtFormatted = new Date(Date.parse(data.createdAt));
  let dateFormatOptions = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  return (
    <div className="flex justify-between flex-col mt-4 w-max">
    <div className="flex">
      <img
        src={data.imageUrl}
        alt={`Photo du produit : ${data.description}`}
        className="mr-4 rounded-md"
      />
      <div className="flex gap-1 flex-col ">
        <div className="flex flex-1">
          <UserIcon className={"size-6"}></UserIcon>
          <p>{data.userName}</p>
        </div>
        <h1 className="flex-1 font-semibold text-3xl">{data.title}</h1>
        <h2 className="flex-2 font-normal">{data.description}</h2>
        <div className="flex-none flex gap-2 text-md">
          <p className="text-neutral-500 my-auto">taille</p>
          <p className="p-1 font-semibold border border-neutral-500 rounded-lg ">{data.size}</p>
        </div>
        <div className="flex-none flex gap-2 text-md">
          <p className="text-neutral-500 my-auto">catégorie</p>
          <p className="p-1 font-semibold border border-neutral-500 rounded-lg ">{data.category}</p>
        </div>
        <div className="flex-none flex gap-2 text-md">
          <p className="text-neutral-500 my-auto">état</p>
          <p className="p-1 font-semibold border border-neutral-500 rounded-lg ">{data.condition}</p>
        </div>
        <h2 className="text-teal-600 text-3xl">{data.price} €</h2>
        <p className="flex-initial">Publiée le {createdAtFormatted.toLocaleDateString(undefined, dateFormatOptions)}</p>
      </div>
    </div>
    <Link to="/" className="text-neutral-400">Revenir au catalogue</Link>
    </div>
  );
}
