"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
    price: number;
    id_curso: number;
}

export const CourseEnrollButton = ({
    price,
    id_curso,
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`/api/courses/${id_curso}/checkout`)

            window.location.assign(response.data.url);
        } catch {
            toast.error("Sucedio un error al procesar el pago");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            Inscribete por {formatPrice(price)}
        </Button>
    )
}
