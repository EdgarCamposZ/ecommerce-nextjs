import { tbl_categorias, tbl_cursos } from "@prisma/client";
import { CourseCard } from "./CourseCard";

type CourseWithCategory = tbl_cursos & {
    categoria: tbl_categorias | null;
};

interface CoursesListProps {
    items: CourseWithCategory[];
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.uuid}
                        id={item.uuid}
                        title={item.titulo!}
                        imageUrl={item.imagen_url!}
                        price={item.precio!}
                        category={item?.categoria?.nombre!}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    )
}
