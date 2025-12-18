'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/api';
import MtgCard from '@/components/card/mtgCard';
export default function CardPage({ params }) {
  const { slug } = use(params); // Make sure slug is properly unwrapped

  console.log('Slug value:', slug); // Debug: check what slug actually is

  const { data, isLoading, error } = useQuery({
    queryKey: ['card-info', slug],
    queryFn: async () => {
      console.log('Query running with slug:', slug); // Debug: confirm query runs
      const response = await API.get('/cards/id', {
        id: slug,
      });
      console.log('Response:', response);
      return response.data ?? {};
    },
    enabled: !!slug, // Add this - only run when slug exists
  });

  console.log('Query state:', { slug, data, isLoading, error });

  if (!slug) return <div>No slug provided</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <MtgCard data={data} />
    </div>
  );
}
