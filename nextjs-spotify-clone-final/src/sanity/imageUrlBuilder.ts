import imageUrlBuilder from "@sanity/image-url";
import { publicClient } from "../lib/sanity"; 
import { SanityImageSource } from "@sanity/image-url/lib/types/types"; 

const builder = imageUrlBuilder(publicClient);

export const urlFor = (source: SanityImageSource | undefined) => {
  if (!source) return undefined;
  return builder.image(source);
};
