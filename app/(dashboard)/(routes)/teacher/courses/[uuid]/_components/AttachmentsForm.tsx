"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { tbl_adjuntos, tbl_categorias, tbl_cursos } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";

interface AttachmentFormProps {
    initialData: tbl_cursos & { categoria: tbl_categorias | null, adjuntos: tbl_adjuntos[] };
    id_curso: number;
};

const formSchema = z.object({
    url: z.string().min(1),
    nombre: z.string().min(1)
});

export const AttachmentsForm = ({
    initialData,
    id_curso
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${id_curso}/attachments`, values);
            toast.success("Curso Actualizado");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Sucedio un error al agregar el adjunto");
        }
    };

    const onDelete = async (id_adjunto: number) => {
        try {
            setDeletingId(id_adjunto);
            await axios.delete(`/api/courses/${id_curso}/attachments/${id_adjunto}`);
            toast.success("Adjunto eliminado");
            router.refresh();
        } catch {
            toast.error("Sucedio un error al eliminar el adjunto");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-[#cfcfcf] dark:bg-[#1f1f1f] rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Adjuntos del curso
                <Button onClick={toggleEdit} variant="customghost">
                    {isEditing && (
                        <>Cancelar</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Agregar un archivo
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.adjuntos.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            *Aun no se han agregado adjuntos*
                        </p>
                    )}
                    {initialData.adjuntos.length > 0 && (
                        <div className="space-y-2">
                            {initialData.adjuntos.map((adjunto) => (
                                <div
                                    key={adjunto.id_adjunto}
                                    className="flex items-center p-3 w-full bg-sky-100 dark:bg-[#313138] border-sky-200 dark:border-white border dark:text-teal-400 text-sky-700 rounded-md mt-2"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-sm line-clamp-1">
                                        {adjunto.nombre}
                                    </p>
                                    {deletingId === adjunto.id_adjunto && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== adjunto.id_adjunto && (
                                        <button
                                            onClick={() => onDelete(adjunto.id_adjunto)}
                                            className="ml-auto hover:opacity-75 transition bg-red-700 text-white rounded-full p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url, nombre) => {
                            if (url && nombre) {
                                onSubmit({ url: url, nombre: nombre });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Agrega cualquier cosa que tus estudiantes puedan necesitar para completar el curso.
                    </div>
                </div>
            )}
        </div>
    )
}
