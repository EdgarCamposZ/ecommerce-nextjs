import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { id_curso: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("No Autorizado", { status: 401 });
        }

        const course = await db.tbl_cursos.findUnique({
            where: {
                id_curso: parseInt(params.id_curso),
                id_usuario: userId,
            },
        });

        if (!course) {
            return new NextResponse("Curso No encontrado", { status: 404 });
        }

        const unpublishedCourse = await db.tbl_cursos.update({
            where: {
                id_curso: parseInt(params.id_curso),
                id_usuario: userId,
            },
            data: {
                publicado: false,
            }
        });

        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
