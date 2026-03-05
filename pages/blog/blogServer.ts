import snarkdown from "snarkdown";
import {CacheService} from "$lib/fluti/services/CacheService";
import {type BlogData, type BlogPageProps, createBlogJsonSchema, createBlogMetaTags} from "$lib/fluti/pages/blog/types";
import {error} from "@sveltejs/kit";
import {stat} from "node:fs/promises";

const path = '../../../../assets/blog/'
const files = import.meta.glob('../../../../assets/blog/*.md');
const cachedPages = new CacheService()
const BLOG_DOMAIN = "https://sklep.wwsystemdev.pl";

function normalizeWhitespace(input: string): string {
    return input.replace(/\s+/g, " ").trim();
}

function markdownToPlainText(markdown: string): string {
    return normalizeWhitespace(
        markdown
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/`[^`]+`/g, " ")
            .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
            .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
            .replace(/#{1,6}\s+/g, " ")
            .replace(/[*_~>-]/g, " ")
    );
}

function extractHeadline(markdown: string, fallback: string): string {
    const matched = markdown.match(/^#\s+(.+)$/m);
    return normalizeWhitespace(matched?.[1] ?? fallback);
}

function extractDescription(markdown: string, fallback: string): string {
    const lines = markdown.split("\n").map(line => line.trim());
    const paragraph = lines.find(line => line.length > 0 && !line.startsWith("#") && !line.startsWith("-"));
    const source = paragraph ?? markdown;
    const text = markdownToPlainText(source);
    if (!text) {
        return fallback;
    }
    return text.slice(0, 180);
}

export async function loadBlogContent(name: string): Promise<BlogPageProps> {
    const filePath = path + name + '.md';
    if (cachedPages.has(filePath))
        return cachedPages.get(filePath)

    const importer = files[filePath];
    if (!importer) {
        throw error(404, "Blog page not found");
    }

    const fileContent: any = await importer();
    const markdownContent = fileContent.default as string;
    const parsed = snarkdown(markdownContent);
    const fileStats = await stat(new URL(`${path}${name}.md`, import.meta.url));
    const fallbackTitle = name.replaceAll("-", " ");
    const headline = extractHeadline(markdownContent, fallbackTitle);
    const shortDescription = extractDescription(markdownContent, headline);
    const url = `${BLOG_DOMAIN}/blog/${name}`;
    const data: BlogData = {
        url,
        shortDescription,
        author: {
            name: "WWSystem"
        },
        datePublished: fileStats.mtime.toISOString(),
        headline,
        image: `${BLOG_DOMAIN}/logo.png`,
        publisher: {
            name: 'WWSystem',
            logo: {
                url: `${BLOG_DOMAIN}/logo.png`
            }
        }
    }
    const schema = createBlogJsonSchema(data);
    const pageTags = createBlogMetaTags(data);
    const blogPageProps: BlogPageProps = {
        data: data,
        htmlBlogContent: parsed,
        htmlTags: pageTags,
        htmlSchemaBlog: schema
    };
    cachedPages.set(filePath, blogPageProps);
    return blogPageProps;
}
