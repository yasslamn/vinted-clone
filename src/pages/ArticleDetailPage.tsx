import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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

  return <>
    <p>{data.title}</p>
    <p>{data.description}</p>
    <p>{data.price}</p>
    <p>{data.category}</p>
    <p>{data.size}</p>
    <p>{data.condition}</p>
    <p>{data.userName}</p>
    <p>{data.createdAt}</p>
  </>
}
