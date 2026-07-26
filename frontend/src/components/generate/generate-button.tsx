"use client";

import { Button } from "@/components/ui/button";

interface Props{

    loading:boolean;

    onClick:()=>void;

}

export default function GenerateButton({

    loading,

    onClick

}:Props){

    return(

        <Button

            className="w-full"

            onClick={onClick}

            disabled={loading}

        >

            {

                loading

                ? "Generating..."

                : "Generate Asset"

            }

        </Button>

    );

}