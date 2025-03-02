import type {FaqPanelItem} from "./FaqPanelTypes";

export let generateFAQSchema = (items: FaqPanelItem[]) => {

    return `
  <script type="application/ld+json">
{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
          ${items.map(generateItemTemplate).join('\n')}        
      ]
    }
  </script>
`
}

let generateItemTemplate = (item: FaqPanelItem) => {
    return `{
          "@type": "Question",
          "name": "${item.question}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${item.answer}"
          }},`
}