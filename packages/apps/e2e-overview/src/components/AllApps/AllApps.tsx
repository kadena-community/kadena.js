import { useAllApps } from '@/hooks/getAllApps';

export const AllApps = () => {
  const { data, isLoading, error } = useAllApps();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <ul>{data?.map((movie) => <li key={movie.id}>{movie.name}</li>)}</ul>;
};
