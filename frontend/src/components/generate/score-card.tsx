interface Props {

    score:number;

}

export default function ScoreCard({

    score

}:Props){

    return(

        <div className="rounded-xl border p-5">

            <h3 className="font-semibold">

                Prompt Score

            </h3>

            <p className="text-4xl font-bold mt-4">

                {score}

            </p>

        </div>

    );

}