import type {
    FooterCompanyInfo,
    FooterLinksColumns,
    FooterMessages,
    FooterSectionProps
} from "$lib/fluti/sections/footer/types";


export function exampleFooterSectionProps(): FooterSectionProps {
    return {
        showLogo: true,
        logoUrl: "favicon.ico",
        messages: exampleMessages(),
        linksColumns: exampleLinks(),
        companyInfo: exampleCompoanyInfo()
    }
}

export function exampleCompoanyInfo(): FooterCompanyInfo {

    return {
        companyName: 'Bestwebsite.com',
        slogan: 'Makes your live easier',
        address: 'St. Will 32/45 43-231',
        email: 'info@bestwebsite.com',
        phone: '564 546 546',
        workingHours: '09-16'
    }
}

export function exampleLinks(): FooterLinksColumns[] {
    const links: FooterLinksColumns[] = []
    const linksValues = [
        {
            name: 'Link 1 dasd  asdas asdasdsad',
            url: '#'
        },
        {
            name: 'Link 2',
            url: '#'
        },
        {
            name: 'Link 3',
            url: '#'
        },
        {
            name: 'Link 4',
            url: '#'
        },
    ]
    links.push({
        title: "Column one",
        links: linksValues
    })
    links.push({
        title: "Follow us",
        links: linksValues
    })
    links.push({
        title: "Follow us",
        links: linksValues
    })
    links.push({
        title: "Follow us",
        links: linksValues
    })


    return links;
}

export function exampleMessages(): FooterMessages {
    return {
        allRightsReserved: "wszystkie prawa zastrzeżone"
    }
}