"use client";

import { Bell } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {

    return (

        <header className="

            h-16

            border-b

            flex

            items-center

            justify-between

            px-8

            bg-background

        ">

            <h2 className="

                text-xl

                font-semibold

            ">

                Dashboard

            </h2>

            <div className="

                flex

                items-center

                gap-6

            ">

                <Bell
                    className="cursor-pointer"
                    size={20}
                />

                <Avatar>

                    <AvatarFallback>

                        A

                    </AvatarFallback>

                </Avatar>

            </div>

        </header>

    );

}