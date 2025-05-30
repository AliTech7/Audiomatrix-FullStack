import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { serverClient } from "@/lib/sanity";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Verifying the favorite belongs to the user
        const favorite = await serverClient.fetch(
            `*[_type == "favorite" && _id == $id && userId == $email][0]`,
            { id, email: session.user.email }
        );

        if (!favorite) {
            return new NextResponse("Favorite not found", { status: 404 });
        }

        await serverClient.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing favorite:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} 