import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";

import { getAllPosts, getAllProducts } from "@/lib/api";

export async function generateMetadata() {
  const breeds = await getAllPosts();

  const images = breeds.map((breed) => breed?.image?.url);
  const keywords = breeds.map((breed) => breed?.title);

  return {
    title: "Blogs about dogs",
    description: "A home for dogs and dog lovers",
    openGraph: {
      title: "Blogs about dogs",
      images: images,
    },
    keywords,
  };
}

export default async function Home() {
  const { isEnabled } = draftMode();
  const posts = await getAllPosts(12, isEnabled);
  const products = await getAllProducts(12, isEnabled);

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center justify-between p-24">
      <div className="w-full grid grid-cols-3 gap-8">
        {posts.map((dog) => {
          return (
            <Link
              prefetch={false}
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

      <div className="w-full mt-20 flex flex-col gap-2">
        <h2 className="text-4xl mb-8">OUR PRODUCTS</h2>

        {products.map((product, idx) => {
          return (
            <div
              className="flex justify-between items-center"
              key={`product-${idx}`}
            >
              <h1 className="text-2xl uppercase">{product?.title}</h1>
              <p className="text-xl text-gray-600">{product?.price}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
