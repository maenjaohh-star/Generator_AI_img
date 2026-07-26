"use client";

interface Props{

    prompt:string;

}

export default function PromptPreview({

    prompt

}:Props){

    return(

        <div className="rounded-xl border p-4">

            <h2 className="font-semibold mb-3">

                Prompt

            </h2>

            <p className="text-sm whitespace-pre-wrap">

                {prompt}

            </p>

        </div>

    );

}