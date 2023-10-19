import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { titulo } = await req.json();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const course = await db.tbl_cursos.create({
            data: {
                id_usuario: userId,
                titulo,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[CURSOS]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
