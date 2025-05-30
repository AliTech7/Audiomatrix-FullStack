import { defineField, defineType } from "sanity";
import { MdFavorite as icon } from "react-icons/md";

export default defineType({
    name: "favorite",
    title: "Favorite",
    type: "document",
    icon,
    fields: [
        defineField({
            name: "userId",
            title: "User ID",
            type: "string",
            description: "The ID of the user who favorited this music",
        }),
        defineField({
            name: "music",
            title: "Music",
            type: "reference",
            to: [{ type: "music" }],
            description: "The music that was favorited",
        }),
        defineField({
            name: "favoritedAt",
            title: "Favorited At",
            type: "datetime",
            description: "When the music was favorited",
        }),
    ],
    preview: {
        select: {
            title: "music.title",
            artist: "music.artist",
            media: "music.coverImage",
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