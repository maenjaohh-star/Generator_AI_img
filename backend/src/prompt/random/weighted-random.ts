import { WeightedItem } from "./random.types";

export function weightedRandom(

    items: WeightedItem[]

): string {

    const total = items.reduce(

        (sum, item) => sum + item.weight,

        0

    );

    let random = Math.random() * total;

    for (const item of items) {

        random -= item.weight;

        if (random <= 0) {

            return item.value;

        }

    }

    return items[0].value;

}