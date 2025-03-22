import snarkdown from "snarkdown";
import {CacheService} from "$lib/fluti/services/CacheService";
import {type BlogData, type BlogPageProps, createBlogJsonSchema, createBlogMetaTags} from "$lib/fluti/pages/blog/types";

const path = '../../../../assets/blog/'
const files = import.meta.glob('../../../../assets/blog/*.md');
const cachedPages = new CacheService()

export async function loadBlogContent(name: string): Promise<BlogPageProps> {
    const filePath = path + name + '.md';
    if (cachedPages.has(filePath))
        return cachedPages.get(filePath)

    const importer = files[filePath];
    if (!importer) {

        //@ts-ignore
        return {status: 404, body: 'Page not found'};
    }

    const fileContent: any = await importer();
    const parsed = snarkdown(fileContent.default);
    const data: BlogData = {
        url: '',
        shortDescription: 'short blog description',
        author: {
            name: "Blog author"
        },
        datePublished: '',
        headline: '',
        image: '',
        publisher: {
            name: 'WWSystem',
            logo: {
                url: ''
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

