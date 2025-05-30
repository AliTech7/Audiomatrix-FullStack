import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { publicClient as client } from "../../../lib/sanity";
import { urlFor } from "../../../sanity/imageUrlBuilder";
import Image from "next/image";
import Link from "next/link";

const MUSIC_QUERY = `*[_type == "music" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const music = await client.fetch<SanityDocument>(MUSIC_QUERY, { slug }, options);

  if (!music) {
    return (
      <main className="container mx-auto p-8">
        <p>Music not found.</p>
      </main>
    );
  }

  const coverImageUrl = music.coverImage
    ? urlFor(music.coverImage)?.width(300).height(300).url()
    : "/fallback.jpg";

  return (
    <div className="bg-neutral-900 min-h-screen w-full px-5">
      <Link 
        href="/music" 
        className="inline-block text-green-600 hover:text-yellow-400 font-medium transition-colors duration-200 text-xl mt-7 ml-4"
      >
        🎵Back to Music Library
      </Link>

      <main className="container mx-auto mt-5">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 mt-7">
          <div className="flex flex-col items-center gap-4 mt-7">
            <h1 className="text-3xl font-bold text-center text-white/80">{music.title}</h1>

            <Image
              src={coverImageUrl || "/fallback.jpg"}
              alt={music.title || "Music Cover"}
              width={250}
              height={250}
              className="rounded-lg shadow-lg"
            />

            <p className="text-lg text-green-600 text-center font-semibold">
              Artist: <span className="text-white/80">{music.artist || "Unknown"}</span>
            </p>

            <div className="prose max-w-none text-center">
              {Array.isArray(music.description) && (
                <PortableText value={music.description} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
