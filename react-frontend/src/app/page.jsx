import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center  font-sans dark:bg-black">
      <main className="flex m-4 p-4 gap-4 min-h-screen w-full  flex-row items-start justify-betweenbg-white dark:bg-black sm:items-start">
        <Image
          src="/CB_logo.png"
          alt="Card Barrage Logo"
          width={500}
          height={500}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Home Page
          </h1>
          <p className="max-w-md text-3xl leading-8 text-zinc-600 dark:text-zinc-400">
            Card Barrage, a work in progress magic the gathering deck helper.
            The end goal is a robust card suggestion engine using a graphical
            database.
          </p>
        </div>
      </main>
    </div>
  );
}
