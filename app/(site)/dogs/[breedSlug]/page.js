import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getDog } from "@/lib/api/dog";

export async function generateMetadata({ params }) {
  const { isEnabled } = draftMode();
  const { breedSlug } = params;
  const dog = await getDog(breedSlug, isEnabled);

  if (!dog) {
    return notFound();
  }

  return {
    title: dog?.title,
    description: dog?.description,
    openGraph: {
      title: dog?.title,
      images: [dog?.image?.url],
    },
    keywords: [dog?.title],
  };
}

export default async function BreedPage({ params }) {
  const { breedSlug } = params;
  const { isEnabled } = draftMode();
  const dog = await getDog(breedSlug, isEnabled);

  if (!dog) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center p-24">
      <div className="w-full mt-20 flex flex-col gap-4">
        <h1 className="text-4xl mb-8">{dog?.title}</h1>

        <p className="text-lg line-clamp-1">{dog?.subtitle}</p>

        <div className="relative min-h-[500px]">
          <Image
            src={dog?.image?.url}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            alt={dog?.image?.description || "dog image"}
            className="object-contain bg-center rounded-md"
          />
        </div>

        <p className="text-base text-slate-500">{dog?.description}</p>
      </div>
    </main>
  );
}
