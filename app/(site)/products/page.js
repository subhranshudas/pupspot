import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";

import { getAllProducts } from "@/lib/api/product";

export async function generateMetadata() {
  const products = await getAllProducts();

  const images = products.map((product) => "");
  const keywords = products.map((product) => product?.title);

  return {
    title: "PupSpot | Products",
    description: "A home for dogs and dog lovers",
    openGraph: {
      title: "PupSpot | Products",
      images: images,
    },
    keywords,
  };
}

export default async function ProductsPage() {
  const { isEnabled } = draftMode();
  const products = await getAllProducts(12, isEnabled);

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center p-24">
      <div className="w-full mt-20 flex flex-col gap-2">
        <Link href="/products" className="text-4xl mb-8 hover:text-green-600">
          PRODUCTS
        </Link>

        <div className="w-full grid grid-cols-1 gap-8">
          {products.map((product) => {
            return (
              <Link
                key={product?.slug}
                className="flex justify-between items-center gap-4 hover:shadow-xl rounded-lg border"
                href={`/products/${product?.slug}`}
              >
                <div className="flex flex-col p-8 gap-4">
                  <h2 className="text-4xl">{product?.title}</h2>
                  <p className="text-base line-clamp-1">${product?.price}</p>
                  <p className="text-xl text-yellow-600">{`${product?.rating}/5`}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
