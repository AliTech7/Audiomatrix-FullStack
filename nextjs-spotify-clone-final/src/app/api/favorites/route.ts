import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { serverClient } from "@/lib/sanity";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const query = `*[_type == "favorite" && userId == $email] {
            _id,
            favoritedAt,
            music-> {
                _id,
                title,
                artist,
                album,
                releaseDate,
                coverImage {
                    _type,
                    asset
                },
                artistImage {
                    _type,
                    asset
                }
            }
        }`;

        const params = { email: session.user.email };
        const favorites = await serverClient.fetch(query, params);

        return NextResponse.json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { musicId } = await request.json();

        // Checking if the favorite already exists
        const existingFavorite = await serverClient.fetch(
            `*[_type == "favorite" && userId == $email && music._ref == $musicId][0]`,
            { email: session.user.email, musicId }
        );

        if (existingFavorite) {
            return NextResponse.json(existingFavorite);
        }

        // Creating new favorite
        const favorite = await serverClient.create({
            _type: "favorite",
            userId: session.user.email,
            music: {
                _type: "reference",
                _ref: musicId
            },
            favoritedAt: new Date().toISOString()
        });

        return NextResponse.json(favorite);
    } catch (error) {
        console.error("Error creating favorite:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} 