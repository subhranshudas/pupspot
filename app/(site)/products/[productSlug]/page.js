import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getProduct, getAllProducts } from "@/lib/api/product";

export async function generateStaticParams() {
  const products = await getAllProducts();

  const slugs = products.map((product) => ({
    productSlug: product.slug,
  }));

  return slugs;
}

export async function generateMetadata({ params }) {
  const { isEnabled } = draftMode();
  const { productSlug } = params;
  const product = await getProduct(productSlug, isEnabled);

  if (!product) {
    return notFound();
  }

  return {
    title: product?.title,
    description: product?.description,
    openGraph: {
      title: product?.title,
      images: [],
    },
    keywords: [product?.title],
  };
}

export default async function ProductPage({ params }) {
  const { productSlug } = params;
  const { isEnabled } = draftMode();
  const product = await getProduct(productSlug, isEnabled);

  if (!product) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center p-24">
      <div className="w-full mt-20 flex flex-col gap-4">
        <h1 className="text-4xl mb-8">{product?.title}</h1>

        <p className="text-base line-clamp-1">${product?.price}</p>
        <p className="text-xl text-yellow-600">{`${product?.rating}/5`}</p>

        <p className="text-base text-slate-500">{product?.description}</p>
      </div>
    </main>
  );
}
