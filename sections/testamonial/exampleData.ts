import type {Testamonial, TestamonialSectionProps} from "$lib/fluti/sections/testamonial/types";


export function exampleTestamonials(): Testamonial[] {

    return [
        {
            name: 'Anna Smith',
            stars: 5,
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            picture: 'https://img.freepik.com/free-photo/handsome-man-smiling-happy-face-portrait-close-up_53876-146189.jpg?semt=ais_hybrid&w=740',
            position: 'CEO',
            companyName: 'Company Name',
        },
        {
            name: 'John Doe',
            stars: 4,
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            picture: 'https://img.freepik.com/free-photo/handsome-man-smiling-happy-face-portrait-close-up_53876-146189.jpg?semt=ais_hybrid&w=740',
            position: 'CEO',
            companyName: 'Company Name',
        },
        {
            name: 'Alice Johnson',
            stars: 5,
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            picture: 'https://img.freepik.com/free-photo/handsome-man-smiling-happy-face-portrait-close-up_53876-146189.jpg?semt=ais_hybrid&w=740',
            position: 'CEO',
            companyName: 'Company Name',
        }
    ]

}