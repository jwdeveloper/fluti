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
    const totalStars = items.reduce((sum, item) => sum + item.stars, 0);
    const averageRating = (totalStars / items.length).toFixed(1); // rounded to one decimal

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: subTitle,
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: items.length
        },
        review: reviews
    };

    return `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;
}