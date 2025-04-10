import type {HowItWorksSectionProps} from "$lib/fluti/sections/howItWorks/types";

export function exampleHowItWorksSectionData(): HowItWorksSectionProps {
    // @ts-ignore
    return {
        title: 'Jak działa automatyzacja procesów i AI',
        subtitle: "Automatyzacja",
        summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        steps: [
            {
                icon: 'fa fa-envelope',
                title: 'Analiza potrzeb biznesowych',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
                image: ''
            },
            {
                icon: 'fa fa-home',
                title: 'Projektowanie rozwiązania',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
                image: ''
            },
            {
                icon: 'fa fa-star',
                title: 'Wdrożenie i testowanie',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
                image: ''
            }
        ]
    }
}