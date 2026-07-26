export interface VariationOptions {
    enabled: boolean;
    count: number;
}

const SubjectVariations = [

    "{{subject}}",

    "minimal {{subject}}",

    "modern {{subject}}",

    "professional {{subject}}",

    "premium {{subject}}",

    "clean {{subject}}",

    "simple {{subject}}",

    "commercial {{subject}}"

];

export function generateVariations(
    subject: string,
    options: VariationOptions
): string[] {

    if (!options.enabled) {
        return [subject];
    }

    const total = Math.min(
        Math.max(options.count, 1),
        SubjectVariations.length
    );

    return SubjectVariations
        .slice(0, total)
        .map(template =>
            template.replace(
                "{{subject}}",
                subject
            )
        );

}