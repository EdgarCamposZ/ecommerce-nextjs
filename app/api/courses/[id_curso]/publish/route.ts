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
            return new NextResponse("No autorizado", { status: 401 });
        }

        const course = await db.tbl_cursos.findUnique({
            where: {
                id_curso: parseInt(params.id_curso),
                id_usuario: userId,
            },
        });

        if (!course) {
            return new NextResponse("Curso no encontrado", { status: 404 });
        }

        if (!course.titulo || !course.descripcion || !course.imagen_url || !course.id_categoria) {
            return new NextResponse("Faltan campos requeridos", { status: 401 });
        }

        const publishedCourse = await db.tbl_cursos.update({
            where: {
                id_curso: parseInt(params.id_curso),
                id_usuario: userId,
            },
            data: {
                publicado: true,
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
