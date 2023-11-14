"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
    disabled: boolean;
    id_curso: number;
    isPublished: boolean;
};

export const Actions = ({
    disabled,
    id_curso,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${id_curso}/unpublish`);
                toast.success("Curso despublicado");
            } else {
                await axios.patch(`/api/courses/${id_curso}/publish`);
                toast.success("Curso publicado");
                confetti.onOpen();
            }

            router.refresh();
        } catch {
            toast.error("Sucedió un error al actualizar el curso");

        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${id_curso}`);

            toast.success("Curso eliminado");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="customghost"
                size="sm"
            >
                {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading} variant={"destructive"}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}
