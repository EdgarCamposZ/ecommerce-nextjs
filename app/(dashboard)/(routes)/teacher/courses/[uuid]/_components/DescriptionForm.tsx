"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { tbl_cursos } from "@prisma/client";

interface DescriptionFormProps {
    initialData: tbl_cursos
    id_curso: number;
};

const formSchema = z.object({
    descripcion: z.string().min(5, {
        message: "La descripcion es requerida",
    }),
});

export const DescriptionForm = ({
    initialData,
    id_curso
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing((current) => !current);
        if (!isEditing) {
            form.setValue("descripcion", initialData?.descripcion || "");
        }
    };

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descripcion: initialData?.descripcion || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${id_curso}`, values);
            toast.success("Curso Actualizado");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Sucedio un error");
        }
    }

    return (
        <div className="mt-6 border bg-[#cfcfcf] dark:bg-[#1f1f1f] rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Descripción del curso
                <Button onClick={toggleEdit} variant="customghost">
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar descripción
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm",
                    "text-slate-700 dark:text-white",
                    "mt-2",
                    !initialData.descripcion && "italic"
                )}>
                    {initialData.descripcion || "* Sin descripción *"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="ej. Este curso es sobre..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                variant="success"
                            >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
