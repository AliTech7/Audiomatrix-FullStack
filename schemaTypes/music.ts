import { defineField, defineType } from "sanity";
import { MdLibraryMusic as icon } from "react-icons/md";


export default defineType({
    name: "music",
    title: "Music",
    type: "document",
    icon,
    fields: [
        defineField({
            name: "userId",
            title: "User ID",
            type: "string",
            description: "The ID of the user who owns this music",
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().min(1)
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 100,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "artist",
            title: "Artist",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "artistImage",
            title: "Artist Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "album",
            title: "Album",
            type: "string",
        }),
        defineField({
            name: "coverImage",
            title: "Cover Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "releaseDate",
            title: "Release Date",
            type: "datetime",
        }),
        defineField({
            name: "genre",
            title: "Genre",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "blockContent",
        }),
    ],
    preview: {
        select: {
            title: "title",
            artist: "artist",
            media: "coverImage",
        },
        prepare({ title, artist, media }) {
            return {
                title: title,
                subtitle: artist,
                media: media,
            }
        },
    },
})