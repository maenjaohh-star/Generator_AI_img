"use client";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface Props {

    enabled: boolean;

    count: number;

    onEnable: (v: boolean) => void;

    onCount: (v: number) => void;

}

export default function VariationCard({

    enabled,

    count,

    onEnable,

    onCount

}: Props) {

    return (

        <div className="space-y-4">

            <div className="flex justify-between">

                <span>

                    Enable Variation

                </span>

                <Switch

                    checked={enabled}

                    onCheckedChange={onEnable}

                />

            </div>

            <div>

                <label>

                    Count

                </label>

                <Input

                    type="number"

                    min={1}

                    max={10}

                    value={count}

                    onChange={(e)=>

                        onCount(

                            Number(e.target.value)

                        )

                    }

                />

            </div>

        </div>

    );

}