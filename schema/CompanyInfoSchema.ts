export function renderSchema() {
    return {
        "@context":
            "https://schema.org", "@graph":
            [{
                "@type": ["EducationalOrganization", "Organization"],
                "@id": "https://edoo.pl/#organization",
                "name": "Szko\u0142a j\u0119zykowa online - edoo.pl",
                "url": "https://edoo.pl",
                "logo": {
                    "@type": "ImageObject",
                    "@id": "https://edoo.pl/#logo",
                    "url": "https://edoo.pl/wp-content/uploads/2014/10/edoo_logo.png",
                    "contentUrl": "https://edoo.pl/wp-content/uploads/2014/10/edoo_logo.png",
                    "caption": "Szko\u0142a j\u0119zykowa Edoo.pl",
                    "inLanguage": "pl-PL",
                    "width": "136",
                    "height": "63"
                }
            }, {
                "@type": "WebSite",
                "@id": "https://edoo.pl/#website",
                "url": "https://edoo.pl",
                "name": "Szko\u0142a j\u0119zykowa Edoo.pl",
                "publisher": {"@id": "https://edoo.pl/#organization"},
                "inLanguage": "pl-PL"
            }, {
                "@type": "ImageObject",
                "@id": "https://edoo.pl/wp-content/uploads/2023/12/slowka-na-mature.png",
                "url": "https://edoo.pl/wp-content/uploads/2023/12/slowka-na-mature.png",
                "width": "1024",
                "height": "1024",
                "caption": "S\u0142\u00f3wka na matur\u0119 z angielskiego",
                "inLanguage": "pl-PL"
            }, {
                "@type": "WebPage",
                "@id": "https://edoo.pl/blog/slowka-na-mature-z-angielskiego/#webpage",
                "url": "https://edoo.pl/blog/slowka-na-mature-z-angielskiego/",
                "name": "S\u0142\u00f3wka na matur\u0119 z angielskiego - Pobierz PDF z \u0107wiczeniami",
                "datePublished": "2023-12-12T10:09:47+00:00",
                "dateModified": "2023-12-20T15:02:33+00:00",
                "isPartOf": {"@id": "https://edoo.pl/#website"},
                "primaryImageOfPage": {"@id": "https://edoo.pl/wp-content/uploads/2023/12/slowka-na-mature.png"},
                "inLanguage": "pl-PL"
            }, {
                "@type": "Person",
                "@id": "https://edoo.pl/autor/pawel-wojnacki/",
                "name": "Pawe\u0142 Wojnacki - lektor j\u0119zyka angielskiego",
                "url": "https://edoo.pl/autor/pawel-wojnacki/",
                "image": {
                    "@type": "ImageObject",
                    "@id": "https://secure.gravatar.com/avatar/98cf343c65bc496b2a26712e10d36a98?s=96&amp;d=blank&amp;r=g",
                    "url": "https://secure.gravatar.com/avatar/98cf343c65bc496b2a26712e10d36a98?s=96&amp;d=blank&amp;r=g",
                    "caption": "Pawe\u0142 Wojnacki - lektor j\u0119zyka angielskiego",
                    "inLanguage": "pl-PL"
                },
                "sameAs": ["https://edoo.pl/"],
                "worksFor": {"@id": "https://edoo.pl/#organization"}
            }, {
                "@type": "BlogPosting",
                "headline": "S\u0142\u00f3wka na matur\u0119 z angielskiego - Pobierz PDF z \u0107wiczeniami",
                "datePublished": "2023-12-12T10:09:47+00:00",
                "dateModified": "2023-12-20T15:02:33+00:00",
                "author": {
                    "@id": "https://edoo.pl/autor/pawel-wojnacki/",
                    "name": "Pawe\u0142 Wojnacki - lektor j\u0119zyka angielskiego"
                },
                "publisher": {"@id": "https://edoo.pl/#organization"},
                "description": "Ucz si\u0119 i trenuj s\u0142\u00f3wka na matur\u0119 podstawow\u0105 oraz rozszerzon\u0105 z angielskiego. Podzia\u0142 na kategorie tematyczne. \u2b50 \u0106wiczenia. \u2705 Pobierz PDF!",
                "name": "S\u0142\u00f3wka na matur\u0119 z angielskiego - Pobierz PDF z \u0107wiczeniami",
                "@id": "https://edoo.pl/blog/slowka-na-mature-z-angielskiego/#richSnippet",
                "isPartOf": {"@id": "https://edoo.pl/blog/slowka-na-mature-z-angielskiego/#webpage"},
                "image": {"@id": "https://edoo.pl/wp-content/uploads/2023/12/slowka-na-mature.png"},
                "inLanguage": "pl-PL",
                "mainEntityOfPage": {"@id": "https://edoo.pl/blog/slowka-na-mature-z-angielskiego/#webpage"}
            }]
    }
}