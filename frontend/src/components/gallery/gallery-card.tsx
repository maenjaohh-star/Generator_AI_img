"use client";

import { useState } from "react";

import { downloadAsset } from "@/services/download.service";

import {

    Heart,
    Trash2,
    Download,
    Eye,
    Calendar,
    ImageIcon,
    Check

} from "lucide-react";

interface Props {

    asset: any;

    selected?: boolean;

    onSelect?: (id: string) => void;

    onPreview?: (asset: any) => void;

    onDelete?: (asset: any) => void

}

export default function GalleryCard({

    asset,

    selected = false,

    onSelect,

    onPreview,

    onDelete

}: Props) {

    const [hover, setHover] = useState(false);

    const imageUrl = asset.imageUrl

        ? `http://localhost:5000${asset.imageUrl}`

        : "";

    return (

        <div

            className="

                rounded-2xl

                overflow-hidden

                border

                bg-white

                shadow-sm

                hover:shadow-xl

                transition-all

                duration-300

                group

            "

            onMouseEnter={() => setHover(true)}

            onMouseLeave={() => setHover(false)}

        >

            <div className="relative">

                {

                    imageUrl

                        ?

                        (

                            <img

                                src={imageUrl}

				onClick={() => onPreview?.(asset)}

                                className="

                                    aspect-square

                                    w-full

                                    object-cover

				    cursor-pointer

                                "

                            />

                        )

                        :

                        (

                            <div

                                className="

                                    aspect-square

                                    flex

                                    items-center

                                    justify-center

                                    bg-gray-100

                                "

                            >

                                <ImageIcon />

                            </div>

                        )

                }

                <button

                    onClick={(e) => {
			e.stopPropagation()
                        onSelect?.(asset.id)

                    }}

                    className="

                        absolute

                        top-3

                        left-3

                        bg-white

                        rounded-full

                        w-8

                        h-8

                        flex

                        items-center

                        justify-center

                        shadow

			z-20

                    "

                >

                    {

                        selected

                            ?

                            <Check

                                size={16}

                                className="text-blue-600"

                            />

                            :

                            null

                    }

                </button>

                <button

                    className="

                        absolute

                        top-3

                        right-3

                        bg-white

                        rounded-full

                        p-2

                        shadow

                    "

                >

                    <Heart

                        size={18}

                        className={

                            asset.favorite

                                ?

                                "fill-red-500 text-red-500"

                                :

                                ""

                        }

                    />

                </button>

                {

                    hover &&

                    (

                        <div

                            className="

                                absolute

                                inset-0

                                bg-black/40

                                flex

                                items-center

                                justify-center

                                gap-3

                            "

                        >

                            <button

                                onClick={() =>

                                    onPreview?.(asset)

                                }

                                className="

                                    bg-white

                                    rounded-full

                                    p-3

                                "

                            >

                                <Eye size={20} />

                            </button>

                            <button

                                onClick={() => {

                                    downloadAsset(asset.id);

                                }}

                                className="

                                    bg-white

                                    rounded-full

                                    p-3

				    hover:bg-gray-100

                                "

                            >

                                <Download size={20} />

                            </button>

                            <button

				onClick={() =>

       				    onDelete?.(asset)
				}

                                className="

                                    bg-white

                                    rounded-full

                                    p-3

				    hover:bg-red-100

                                "

                            >

                                <Trash2

                                    size={20}

                                    className="text-red-500"

                                />

                            </button>

                        </div>

                    )

                }

            </div>

            <div className="p-4">

                <h2

                    className="

                        text-sm

                        font-semibold

                        line-clamp-2

                    "

                >

                    {

                        asset.title ??

                        asset.prompt

                    }

                </h2>

                <div

                    className="

                        mt-4

                        flex

                        justify-between

                        text-xs

                        text-gray-500

                    "

                >

                    <span>

                        {asset.provider}

                    </span>

                    <span

                        className="

                            flex

                            items-center

                            gap-1

                        "

                    >

                        <Calendar size={12} />

                        {

                            new Date(

                                asset.createdAt

                            ).toLocaleDateString()

                        }

                    </span>

                </div>

            </div>

        </div>

    );

}