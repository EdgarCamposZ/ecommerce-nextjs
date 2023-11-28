import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { auth, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
    const { userId } = auth();
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm  bg-[#ededed] dark:bg-[#1f1f1f] flex items-center">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="flex gap-x-8 ml-auto">
                    {!userId && (
                        <>
                            <Button size="sm" variant="customghost" asChild>
                                <Link href="/sign-in">
                                    Iniciar sesión
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/sign-up">
                                    Registrate gratis
                                </Link>
                            </Button>
                        </>
                    )}
                    {userId && (
                        <Button size="sm" variant="customghost" asChild>
                            <Link href="/student">
                                Dashboard
                            </Link>
                        </Button>
                    )}
                    <UserButton
                        afterSignOutUrl="/"
                    />
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};
