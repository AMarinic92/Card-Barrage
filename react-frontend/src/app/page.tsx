import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center  font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert border-amber-100 border-2"
          src="/card-barrage.jpg"
          alt="Next.js logo"
          width={500}
          height={500}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Home Page
          </h1>
          <p className="max-w-md text-3xl leading-8 text-zinc-600 dark:text-zinc-400">
            Card Barrage, a work in progress magic the gathering deck helper
          </p>
        </div>

      </main>
    </div>
  );
}
