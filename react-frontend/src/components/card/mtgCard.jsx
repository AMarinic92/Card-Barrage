import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import Loading from '@/components/loading/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function MtgCard({ data, isLoading = false }) {
  const imageUri = useMemo(() => {
    if (!data) return undefined;
    const images = JSON.parse(data?.ImageURIs);
    const image = images != null ? images?.normal : undefined;
    const cardFaces = JSON.parse(data?.CardFaces);
    const cardFacesUris =
      cardFaces != null
        ? cardFaces?.map((val) => val?.image_uris?.normal)
        : undefined;
    return image != undefined ? [image] : cardFacesUris;
  }, [data]);
  return !isLoading && !!data ? (
    <Dialog>
      <DialogTrigger>
        <div
          className={`cursor-pointer flex flex-col items-center text-6xl p-3.5 m-3.5 gap-3.5`}
        >
          {data?.Name}
          {imageUri?.map((uri, i) => {
            return (
              <div key={data?.Name + i} className="mb-3">
                <Image
                  src={uri}
                  width={500}
                  height={500}
                  preload={true}
                  alt="Picture of the author"
                />
              </div>
            );
          })}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data?.Name}</DialogTitle>
          <DialogDescription>
            {data?.OracleText}
            {imageUri?.map((uri, i) => {
              return (
                <div key={data?.Name + i} className="mb-3">
                  <Image
                    src={uri}
                    width={500}
                    height={500}
                    preload={true}
                    alt="Picture of the author"
                  />
                </div>
              );
            })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : (
    isLoading && <Loading />
  );
}
