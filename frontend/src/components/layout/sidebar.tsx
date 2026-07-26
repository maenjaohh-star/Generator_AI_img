"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Sparkles,
    Image,
    Library,
    Settings
} from "lucide-react";

const menus = [

    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },

    {
        title: "Generate",
        href: "/generate",
        icon: Sparkles
    },

    {
        title: "Assets",
        href: "/assets",
        icon: Image
    },

    {
        title: "Prompt Library",
        href: "/prompts",
        icon: Library
    },

    {
        title: "Settings",
        href: "/settings",
        icon: Settings
    }

];

export default function Sidebar() {

    const pathname = usePathname();

    return (

        <aside className="w-64 border-r h-screen bg-background">

            <div className="p-6">

                <h1 className="text-2xl font-bold">

                    AI Asset

                </h1>

                <p className="text-sm text-muted-foreground">

                    Generator

                </p>

            </div>

            <nav className="px-3">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    const active =
                        pathname === menu.href;

                    return (

                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`

                                flex
                                items-center
                                gap-3

                                rounded-xl

                                px-4
                                py-3

                                mb-2

                                transition

                                ${
                                    active
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                }

                            `}
                        >

                            <Icon size={18} />

                            {menu.title}

                        </Link>

                    );

                })}

            </nav>

        </aside>

    );

}