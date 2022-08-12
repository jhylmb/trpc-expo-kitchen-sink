import { useRouter } from 'next/dist/client/router';
import NextError from 'next/error';
import { useProtectedPath } from '../../utils/paths';
import { trpc } from '../../utils/trpc';

export default function PostViewPage() {
  useProtectedPath();

  const id = useRouter().query.id as string;
  const postQuery = trpc.proxy.post.get.useQuery({ id });

  if (postQuery.error) {
    const statusCode = postQuery.error.data?.httpStatus ?? 500;
    return (
      <NextError title={postQuery.error.message} statusCode={statusCode} />
    );
  }

  if (postQuery.status === 'loading') {
    return <>Loading...</>;
  }

  return (
    <>
      <h1>{postQuery.data?.title}</h1>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(postQuery.data ?? null, null, 4)}</pre>
    </>
  );
}
