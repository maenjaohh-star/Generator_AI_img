"use client";

import { X, Download, Trash2, Heart } from "lucide-react";

interface Props {

    asset: any;

    open: boolean;

    onClose: () => void;

}

export default function GalleryPreview({

    asset,

    open,

    onClose

}: Props) {

    if (!open || !asset) return null;

    return (

        <div

            className="

                fixed

                inset-0

                z-50

                bg-black/80

                flex

                items-center

                justify-center

                p-10

            "

        >

            <div

                className="

                    bg-white

                    rounded-2xl

                    overflow-hidden

                    w-full

                    max-w-7xl

                    h-[90vh]

                    flex

                "

            >

                {/* LEFT */}

                <div

                    className="

                        flex-1

                        bg-gray-100

                        flex

                        items-center

                        justify-center

                    "

                >

                    <img

                        src={`http://localhost:5000${asset.imageUrl}`}

                        className="

                            max-h-full

                            max-w-full

                            object-contain

                        "

                    />

                </div>

                {/* RIGHT */}

                <div

                    className="

                        w-[380px]

                        border-l

                        p-6

                        overflow-y-auto

                    "

                >

                    <div

                        className="

                            flex

                            justify-between

                            items-center

                            mb-6

                        "

                    >

                        <h2

                            className="

                                font-bold

                                text-xl

                            "

                        >

                            Detail Asset

                        </h2>

                        <button onClick={onClose}>

                            <X />

                        </button>

                    </div>

                    <h3 className="font-semibold">

                        Judul

                    </h3>

                    <p className="mb-5">

                        {asset.title}

                    </p>

                    <h3 className="font-semibold">

                        Prompt

                    </h3>

                    <p className="mb-5 text-sm text-gray-600">

                        {asset.finalPrompt}

                    </p>

                    <h3 className="font-semibold">

                        Category

                    </h3>

                    <p className="mb-5">

                        {asset.category}

                    </p>

                    <h3 className="font-semibold">

                        Keywords

                    </h3>

                    <div className="flex flex-wrap gap-2 mt-2 mb-6">

                        {(asset.keywords ?? "")
                            .split(",")

                            .map((k: string) => (

                                <span

                                    key={k}

                                    className="

                                        bg-gray-100

                                        px-2

                                        py-1

                                        rounded

                                        text-xs

                                    "

                                >

                                    {k}

                                </span>

                            ))}

                    </div>

                    <div className="space-y-3">

                        <button

                            className="

                                w-full

                                bg-blue-600

                                text-white

                                rounded-xl

                                py-3

                                flex

                                justify-center

                                items-center

                                gap-2

                            "

                        >

                            <Download size={18} />

                            Download

                        </button>

                        <button

                            className="

                                w-full

                                border

                                rounded-xl

                                py-3

                                flex

                                justify-center

                                items-center

                                gap-2

                            "

                        >

                            <Heart size={18} />

                            Favorite

                        </button>

                        <button

                            className="

                                w-full

                                border

                                border-red-300

                                text-red-600

                                rounded-xl

                                py-3

                                flex

                                justify-center

                                items-center

                                gap-2

                            "

                        >

                            <Trash2 size={18} />

                            Delete

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}