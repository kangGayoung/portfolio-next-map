import { ReactNode } from "react";
import Navbar from "@/component/Navbar";

interface LayoutProps {
    children:ReactNode;
}
export default function Layout({children}: LayoutProps){
    return (
        <div className="layout">
            <Navbar />
            {children}
        </div>
    )
}