export interface BlogPageProps {
    data: BlogData
    htmlBlogContent: string
    htmlTags: string
    htmlSchemaBlog: string
}

export interface BlogData {
    headline: string
    url: string
    shortDescription: string
    image: string,
    datePublished: string
    author: {
        name: string
    },
    publisher: {
        name: string
        logo: {
            url: string
        }
    }
}

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#039;");
}

export function createBlogMetaTags(props: BlogData) {
    const title = escapeHtml(props.headline);
    const description = escapeHtml(props.shortDescription);
    const author = escapeHtml(props.author.name);
    const url = escapeHtml(props.url);
    const image = escapeHtml(props.image);

    return `
     <meta name="description" content="${description}" />
     <meta name="author" content="${author}" />
     <title>${title}</title>
     <link rel="canonical" href="${url}" />

     <meta property="og:title" content="${title}" />
     <meta property="og:description" content="${description}" />
     <meta property="og:type" content="article" />
     <meta property="og:url" content="${url}" />
     <meta property="og:image" content="${image}" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="${title}" />
     <meta name="twitter:description" content="${description}" />
     <meta name="twitter:image" content="${image}" />
     <meta name="twitter:url" content="${url}" />
    `
}

export function createBlogJsonSchema(props: BlogData) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": props.headline,
        "image": props.image,
        "author": {
            "@type": "Person",
            "name": props.author.name
        },
        "publisher": {
            "@type": "Organization",
            "name": props.publisher.name,
            "logo": {
                "@type": "ImageObject",
                "url": props.publisher.logo.url
            }
        },
        "datePublished": props.datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": props.url
        }
    };

    return `
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    `
}
