export interface PageRecordItem {
    link: string
    modified: string
    updateFrequency: string
    priority: number
}


export function generateItem(data: PageRecordItem) {
    return `
       <url>
        <loc>${data.link}</loc>
        <lastmod>${data.modified}</lastmod>
        <changefreq>${data.updateFrequency}</changefreq>
        <priority>${data.priority}</priority>
     </url>
    `
}

export function generateWebsiteMap(data: PageRecordItem[]) {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
     ${data.map(e => generateItem(e)).join("")}
        
   </urlset>
    `
}