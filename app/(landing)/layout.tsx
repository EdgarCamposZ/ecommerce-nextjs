import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

const HomeLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-[#eae5e5] dark:bg-[#313138]">
            <Navbar />
            <main className="pt-40 pb-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default HomeLayout;
