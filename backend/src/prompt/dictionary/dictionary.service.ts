import { SubjectDictionary } from "./subject.dictionary";
import { randomItem } from "../random.util";

export class DictionaryService {

    static enhance(

        subject: string

    ): string {

        const key =
            subject.toLowerCase().trim();

        const item =
            SubjectDictionary[key];

        if (!item) {

            return subject;

        }

        return randomItem(

            item.keywords

        );

    }

}