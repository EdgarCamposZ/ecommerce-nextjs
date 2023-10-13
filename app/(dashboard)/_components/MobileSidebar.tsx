import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export const MobileSidebar = () => {
    return (
        <div>
            <Sheet>
                <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="p-0  bg-[#ededed] dark:bg-[#1f1f1f] ">
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileSidebar;
