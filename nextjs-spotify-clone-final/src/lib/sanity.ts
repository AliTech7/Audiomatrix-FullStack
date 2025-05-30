import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"

/**
 * Represents a Sanity reference to another document
 */
interface SanityReference {
  _ref: string;
  _type: "reference";
}

/**
 * Represents a Sanity image document
 */
interface SanityImage {
  _type: "image";
  asset: SanityReference;
}

// Creating client for server-side operations
export const serverClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
    perspective: "published",
})

// Creating client for client-side operations(without token)
export const publicClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
    perspective: "published",
    stega: false
})

// Using the public client for image URL builder
const builder = imageUrlBuilder(publicClient)

/**
 * Generates a URL for a Sanity image
 * @param source - The Sanity image object to generate a URL for
 * @returns The URL for the image, or undefined if no source is provided
 */
export function urlFor(source: any) {
    if (!source) return undefined
    return builder.image(source)
}