"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const NavbarRoutes = () => {
    return (
        <div className="flex gap-x-8 ml-auto">
            <Button size="sm" variant='customghost'>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
            </Button>
            <UserButton
                afterSignOutUrl="/"
            />
            <ModeToggle />
        </div>
    );
}
