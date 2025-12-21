'use client';

import { use, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '@/lib/api';
import ManaCostDisplay from '@/components/card/manaCostDisplay';
import OracleText from '@/components/card/oracleText';
import Image from 'next/image';
import MtgCard from '@/components/card/mtgCard';
import { Button } from '@/components/ui/button';
export default function CardPage({ params }) {
  const { slug } = use(params); // Make sure slug is properly unwrapped

  const { data, isLoading, error } = useQuery({
    queryKey: ['card-info', slug],
    queryFn: async () => {
      const response = await API.get('/cards/id', {
        id: slug,
      });
      return response.data ?? {};
    },
    enabled: !!slug, // Add this - only run when slug exists
  });

  // Similar Cards Mutation
  const similarMutation = useMutation({
    mutationFn: async (currentCard) => {
      const payload = {
        name: currentCard?.Name,
        oracle_texts: currentCard?.OracleText?.split('\n') || [],
      };
      console.debug(payload);
      return await API.post('/cards/similar', payload);
    },
  });

  const handleGetSimilar = () => {
    similarMutation.mutate(cards?.[0]);
  };

  const imageUri = useMemo(() => {
    if (!data) return undefined;
    const images = JSON.parse(data?.ImageURIs);
    const image = images != null ? images?.png : undefined;
    const cardFaces = JSON.parse(data?.CardFaces);
    const cardFacesUris =
      cardFaces != null
        ? cardFaces?.map((val) => val?.image_uris?.png)
        : undefined;
    return image != undefined ? [image] : cardFacesUris;
  }, [data]);

  const cards = useMemo(() => {
    if (!data) return undefined;
    const images = JSON.parse(data?.ImageURIs);
    const out = !!data?.CardFaces
      ? JSON.parse(data?.CardFaces)
      : [{ ...data, ImageURIs: images }];
    return out;
  }, [data]);

  const similar = useMemo(() => {
    if (!similarMutation?.data) return [];
    return similarMutation.data;
  }, [similarMutation.data]);
  if (!slug) return <div>No slug provided</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(similar);
  return (
    <>
      {cards?.map((card, i) => {
        return (
          <div key={`${card.ID}-${i}`} className="flex flex-row">
            <div className="flex-col items-left p-4 m-4 gap-4 border rounded-2xl bg-card">
              <div
                className="flex flex-col gap-4 items-center"
                style={{ width: '400px' }}
              >
                <Image
                  src={card?.ImageURIs?.png || card?.iamge_uris?.png}
                  width={488}
                  height={680}
                  className="h-auto w-full rounded-[4.75%] shadow-2xl"
                  alt={card?.Name}
                  priority={true}
                />
                <Button
                  className="max-w-24"
                  onClick={handleGetSimilar}
                  disabled={similar?.length || similarMutation.isPending}
                >
                  {similarMutation.isPending ? 'Finding...' : 'Get Similar'}
                </Button>
              </div>
            </div>
            <div>
              <div className="flex flex-row text-4xl min-w-full items-left p-4 m-4 flex-nowrap gap-4 border rounded-2xl bg-card">
                {card?.Name}
                <ManaCostDisplay manaCost={card?.ManaCost} />
              </div>
              <div className="flex flex-col text-4xl min-w-fill items-left p-4 m-4 gap-4 border rounded-2xl bg-card whitespace-pre-line">
                <OracleText text={data?.OracleText} size="lg" />
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap flex-row justify-center items-center w-fit h-fit max-h-fit max-w-fit">
        {!!similar ? (
          similar?.map((simCard) => {
            return (
              <div key={simCard.ID || simCard.Name} className="flex-col">
                <MtgCard isLoading={similarMutation.isPending} data={simCard} />
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
