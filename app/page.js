import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";

import { getAllDogs } from "@/lib/api/dog";
import { getAllProducts } from "@/lib/api/product";

export async function generateMetadata() {
  const breeds = await getAllDogs();

  const images = breeds.map((breed) => breed?.image?.url);
  const keywords = breeds.map((breed) => breed?.title);

  return {
    title: "PupSpot",
    description: "A home for dogs and dog lovers",
    openGraph: {
      title: "PupSpot: Dog and Dog care",
      images: images,
    },
    keywords,
  };
}

export default async function Home() {
  const { isEnabled } = draftMode();
  const dogs = await getAllDogs(12, isEnabled);
  const products = await getAllProducts(12, isEnabled);

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center p-24">
      <div className="w-full mt-20 flex flex-col gap-2">
        <Link href="/dogs" className="text-4xl mb-8 hover:text-green-600 w-fit">
          DOGS
        </Link>

        <div className="w-full grid grid-cols-4 gap-8">
          {dogs.map((dog) => {
            return (
              <Link
                key={dog?.slug}
                className="flex flex-col gap-4 hover:shadow-xl p-4 rounded-lg border"
                href={`/dogs/${dog?.slug}`}
              >
                <h2 className="text-2xl">{dog?.title}</h2>
                <p className="text-sm line-clamp-1">{dog?.subtitle}</p>

                <div className="relative min-h-[200px]">
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
      </div>

      <div className="w-full mt-20 flex flex-col gap-2">
        <Link
          href="/products"
          className="text-4xl mb-8 hover:text-green-600 w-fit"
        >
          PRODUCTS
        </Link>

        <div className="grid grid-cols-4 gap-4">
          {products.map((product, idx) => {
            return (
              <Link
                className="flex flex-col border p-4 hover:shadow-xl rounded-lg"
                key={`product-${idx}`}
                href={`/products/${product?.slug}`}
              >
                <div className="flex justify-between">
                  <h1 className="text-2xl font-medium">{product?.title}</h1>
                  <p className="text-xl text-gray-600">${product?.price}</p>
                </div>

                <p className="text-xl text-yellow-600">{`${product?.rating}/5`}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
