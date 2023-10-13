import { NavbarRoutes } from "@/components/NavbarRoutes";
import MobileSidebar from "./MobileSidebar";

export const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-[#ededed] dark:bg-[#1f1f1f] shadow-sm">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    );
}

export default Navbar;
