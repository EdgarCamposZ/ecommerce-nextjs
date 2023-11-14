import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CircleDollarSign, File, LayoutDashboard } from "lucide-react";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoriesForm } from "./_components/CategoriesForm";
import { PriceForm } from "./_components/PriceForm";
import { Prisma } from "@prisma/client";
import { AttachmentsForm } from "./_components/AttachmentsForm";
import { Banner } from "@/components/Banner";
import { Actions } from "./_components/Actions";

const CourseUuidPage = async ({
    params
}: {
    params: { uuid: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.tbl_cursos.findFirst({
        where: {
            uuid: params.uuid,
            id_usuario: userId
        },
        include: {
            categoria: true,
            adjuntos: true
        },
    });

    const categories = await db.tbl_categorias.findMany({
        orderBy: {
            nombre: "asc"
        }
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.titulo,
        course.descripcion,
        course.imagen_url,
        course.precio,
        course.id_categoria];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!course.publicado && (
                <Banner
                    label="Este curso no esta publicado. No sera visible para los estudiantes."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Configuracion del curso
                        </h1>
                        <span className="text-sm text-slate-700 dark:text-white">
                            Completar todos los campos {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        id_curso={course.id_curso}
                        isPublished={course.publicado}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="rounded-full flex items-center justify-center bg-sky-100 dark:bg-[#1f1f1f] p-2">
                                <LayoutDashboard className="h-8 w-8 text-teal-700 dark:text-yellow-500" />
                            </div>
                            <h2 className="text-xl">
                                Personaliza tu curso
                            </h2>
                        </div>
                        <TitleForm
                            initialData={course}
                            id_curso={course.id_curso}
                        />
                        <DescriptionForm
                            initialData={course}
                            id_curso={course.id_curso}
                        />
                        <CategoriesForm
                            initialData={course}
                            id_curso={course.id_curso}
                            options={categories.map((category) => ({
                                label: category.nombre,
                                value: category.id_categoria,
                            }))}
                        />
                        <ImageForm
                            initialData={course}
                            id_curso={course.id_curso}
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-x-2">
                            <div className="rounded-full flex items-center justify-center bg-sky-100 dark:bg-[#1f1f1f] p-2">
                                <CircleDollarSign className="h-8 w-8 text-teal-700 dark:text-yellow-500" />
                            </div>
                            <h2 className="text-xl">
                                Pon precio a tu curso
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            id_curso={course.id_curso}
                        />
                        <div className="flex items-center gap-x-2">
                            <div className="rounded-full flex items-center justify-center bg-sky-100 dark:bg-[#1f1f1f] p-2">
                                <File className="h-8 w-8 text-teal-700 dark:text-yellow-500" />
                            </div>
                            <h2 className="text-xl">
                                Recursos y Adjuntos (Opcional)
                            </h2>
                        </div>
                        <AttachmentsForm
                            initialData={course}
                            id_curso={course.id_curso}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseUuidPage;
