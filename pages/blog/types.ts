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

export function createBlogMetaTags(props: BlogData) {
    return `
     <meta name="description" content="${props.shortDescription}" />
     <meta name="author" content="${props.author.name}" />
     <title>${props.headline}</title>

     <meta property="og:title" content="${props.headline}" />
     <meta property="og:description" content="${props.shortDescription}" />
     <meta property="og:type" content="article" />
     <meta property="og:url" content="${props.url}" />
     <meta property="og:image" content="${props.image}" />
    `
}

export function createBlogJsonSchema(props: BlogData) {
    return `
    <script type = "application/ld+json" >
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${props.headline}",
        "image": "${props.image}",
        "author": {
            "@type": "Person",
            "name": "${props.author.name}"
        },
        "publisher": {
            "@type": "Organization",
            "name": "${props.publisher.name}",
            "logo": {
                "@type": "ImageObject",
                "url": "${props.publisher.logo}"
            }
        },
        "datePublished": "${props.datePublished}"
    }
    </script>
    `
}

