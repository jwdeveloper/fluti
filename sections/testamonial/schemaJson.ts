import type {Testamonial, TestamonialSectionProps} from "$lib/fluti/sections/testamonial/types";

export function createReviewSchemaScriptTag(items: Testamonial[], title: string, subTitle: string): string {
    if (items.length === 0) return '';

    const reviews = items.map((item) => ({
        "@type": "Review",
        author: {
            "@type": "Person",
            name: item.name
        },
        reviewBody: item.quote,
        reviewRating: {
            "@type": "Rating",
            ratingValue: item.stars,
            bestRating: 5,
            worstRating: 1
        }
    }));

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: subTitle,
        review: reviews
    };

    return `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;
}