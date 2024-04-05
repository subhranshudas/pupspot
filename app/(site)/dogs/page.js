import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";

import { getAllDogs } from "@/lib/api/dog";

export async function generateMetadata() {
  const breeds = await getAllDogs();

  const images = breeds.map((breed) => breed?.image?.url);
  const keywords = breeds.map((breed) => breed?.title);

  return {
    title: "PupSpot | Dogs",
    description: "A home for dogs and dog lovers",
    openGraph: {
      title: "PupSpot | Dogs",
      images: images,
    },
    keywords,
  };
}

export default async function DogsPage() {
  const { isEnabled } = draftMode();
  const dogs = await getAllDogs(12, isEnabled);

  return (
    <main className="flex min-h-screen max-w-[1440px] mx-auto flex-col items-center p-24">
      <div className="w-full mt-20 flex flex-col gap-2">
        <Link href="/dogs" className="text-4xl mb-8 hover:text-green-600">
          DOGS
        </Link>

        <div className="w-full grid grid-cols-1 gap-8">
          {dogs.map((dog) => {
            return (
              <Link
                key={dog?.slug}
                className="flex justify-between items-center gap-4 hover:shadow-xl rounded-lg border"
                href={`/dogs/${dog?.slug}`}
              >
                <div className="flex flex-col p-8 gap-4">
                  <h2 className="text-4xl">{dog?.title}</h2>
                  <p className="text-base line-clamp-1">{dog?.subtitle}</p>
                </div>

                <div className="basis-1/2 relative h-[300px]">
                  <Image
                    src={dog?.image?.url}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    alt={dog?.image?.description || "dog image"}
                    className="object-cover bg-center"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
