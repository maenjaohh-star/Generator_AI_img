"use client";

interface Props {
    image?: string;
    open: boolean;
    onClose: () => void;
}

export default function ImagePreviewModal({
    image,
    open,
    onClose,
}: Props) {

    if (!open || !image) return null;

    return (

        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-10"
        >

            <img
                src={`http://localhost:5000${image}`}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                onClick={(e)=>e.stopPropagation()}
            />

        </div>

    );

}