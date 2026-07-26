"use client";

import { Input } from "@/components/ui/input";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function SubjectInput({
    value,
    onChange
}: Props) {

    return (

        <div className="space-y-2">

            <label className="font-medium">

                Subject

            </label>

            <Input

                placeholder="coffee cup"

                value={value}

                onChange={(e) =>
                    onChange(e.target.value)
                }

            />

        </div>

    );

}