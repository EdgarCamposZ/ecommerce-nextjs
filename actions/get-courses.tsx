import { tbl_categorias, tbl_cursos } from "@prisma/client";

import { db } from "@/lib/db";

type CourseWithCategory = tbl_cursos & {
    categoria: tbl_categorias | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    category?: string;
};

export const getCourses = async ({
    userId,
    title,
    category
}: GetCourses): Promise<CourseWithCategory[]> => {
    try {
        const categoria = await db.tbl_categorias.findFirst({
            where: {
                uuid: category,
            },
        });

        const courses = await db.tbl_cursos.findMany({
            where: {
                publicado: true,
                titulo: {
                    contains: title,
                },
                id_categoria: category ? categoria?.id_categoria : undefined,
            },
            include: {
                categoria: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesList: CourseWithCategory[] = await Promise.all(
            courses.map(async course => {
                return {
                    ...course
                }
            })
        );
        return coursesList;

    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}
