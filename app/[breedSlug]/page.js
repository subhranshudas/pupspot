import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { getPost } from "@/lib/api";

export default async function BreedPage({ params }) {
  const { breedSlug } = params;

  const breed = await getPost(breedSlug);

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
