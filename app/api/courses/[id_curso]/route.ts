import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
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

        const deletedCourse = await db.tbl_cursos.delete({
            where: {
                id_curso: parseInt(params.id_curso),
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id_curso: string } }
) {
    try {
        const { userId } = auth();
        const { id_curso } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const course = await db.tbl_cursos.update({
            where: {
                id_curso: parseInt(id_curso),
                id_usuario: userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}
