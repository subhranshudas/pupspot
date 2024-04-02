import Link from "next/link";
import Image from "next/image";

import { getAllPosts } from "@/lib/api";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center justify-between p-24">
      <div className="w-full grid grid-cols-3 gap-8">
        {posts.map((dog) => {
          return (
            <Link
              key={dog?.slug}
              className="flex flex-col"
              href={`/${dog?.slug}`}
            >
              <h2 className="text-2xl my-4">{dog?.title}</h2>

              <div className="relative min-h-[400px]">
                <Image
                  src={dog?.image?.url}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  alt={dog?.image?.description || "dog image"}
                  className="object-cover bg-center rounded-md"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
