import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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

export default function ArticleDetailPage() {
  let params = useParams();

  if (!params.id) return;

  let articleId: string = params.id;

  const {isPending, isError, data, error} = useQuery({
    queryKey: ['article'],
    queryFn: () => fetch(`/api/articles/${articleId}`).then((res) => res.json()),
  });

  if (isPending){
    return <p>Chargement...</p>;
  }

  if (isError){
    console.log(`Une erreur est survenue : ${error.message}`);
    return <p>Une erreur est survenue.</p>;
  }

  let createdAtFormatted = new Date(Date.parse(data.createdAt));
  let dateFormatOptions = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  return (
    <div className="flex mt-4">
      <img
        src={data.imageUrl}
        alt={`Photo du produit : ${data.description}`}
        className="mx-4 rounded-md"
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
        <p className="flex-initial">{createdAtFormatted.toLocaleDateString(undefined, dateFormatOptions)}</p>
      </div>
    </div>
  );
}
