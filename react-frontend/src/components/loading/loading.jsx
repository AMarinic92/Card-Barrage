import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

export default function Loading({ card = true }) {
  return (
    <div className="relative w-fit h-fit overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <Spinner className="h-10 w-10 animate-spin text-white" />
      </div>
      {card ? (
        <Image
          src={'/card-back.png'}
          width={500}
          height={700} // Adjusted from 5000 to a standard card ratio
          priority={true} // 'preload' isn't a prop; 'priority' is the Next.js version
          alt="MTG Card"
          className="transition-all duration-300 blur-sm"
        />
      ) : undefined}
    </div>
  );
}
