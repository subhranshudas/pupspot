import { draftMode } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export async function generateStaticParams() {
  const breeds = await getAllPosts();

  return breeds.map((breed) => ({
    breedSlug: breed.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { breedSlug } = params;

  const { isEnabled } = draftMode();
  const breed = await getPost(breedSlug, isEnabled);

  if (!breed) {
    return notFound();
  }

  return {
    title: breed?.title,
    description: breed?.title,
    openGraph: {
      title: breed?.title,
      images: [breed?.image?.url],
    },
  };
}

import { getAllPosts, getPost } from "@/lib/api";

export default async function BreedPage({ params }) {
  const { breedSlug } = params;

  const { isEnabled } = draftMode();
  const breed = await getPost(breedSlug, isEnabled);

  return (
    <section className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center gap-4 py-8">
      <h1 className="text-3xl">{breed?.title}</h1>

      <div className="relative w-full min-h-[600px]">
        <Image
          src={breed?.image?.url}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          alt={breed?.image?.description || "breed image"}
          className="object-contain bg-center rounded-md"
        />
      </div>

      <div className="w-3/5 mx-auto flex flex-col mt-8">
        {documentToReactComponents(breed.body.json)}
      </div>
    </section>
  );
}
