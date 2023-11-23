"use client";

import { tbl_categorias } from "@prisma/client";
import {
    FcDepartment,
    FcMultipleDevices,
    FcMusic,
    FcCalculator,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./Category-item";

interface CategoriesProps {
    items: tbl_categorias[];
}

const iconMap: Record<tbl_categorias["nombre"], IconType> = {
    "Artes y musica": FcMusic,
    "Matemáticas y Física": FcCalculator,
    "Programación y TI": FcMultipleDevices,
    "Arquitectura y diseño": FcDepartment,
};

export const Categories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 content-between justify-center">
            {items.map((item) => (
                <CategoryItem
                    key={item.uuid}
                    label={item.nombre}
                    icon={iconMap[item.nombre]}
                    value={item.uuid}
                />
            ))}
        </div>
    )
}
