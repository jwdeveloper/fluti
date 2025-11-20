import type {TextAndImageSectionProps} from "$lib/fluti/sections/textAndImageSection/types";

export function exampleTextAndImagesData(): TextAndImageSectionProps {

    let sectionData = {
        subTitle: "Oczyść umysł",
        title: "Twórz zadania w mgnieniu oka",
        text: "Poświęciliśmy ponad dekadę ulepszając Todoist do tego stopnia, by mógł stać się intuicyjnym menedżerem Twoich myśli. Zapisuj i porządkuj zadania w mgnieniu oka, korzystając ze swobodnego, naturalnego języka."
    }

    let items = [
        {color: "rgba(241,101,14,0.88)", image: '/banners/main2.png', ...sectionData},
        {color: "rgba(0,149,255,0.67)", image: '/screenshots/s2.png', ...sectionData},
        {color: "rgba(7,81,222,0.95)", image: '/screenshots/s3.png', ...sectionData},
        {color: "rgba(155,24,220,0.67)", image: '/screenshots/s4.png', ...sectionData},
    ]


    return {
        items: [
            {...sectionData, ...items[0]},
            {...sectionData, ...items[1]},
            {...sectionData, ...items[2]},
            {...sectionData, ...items[3]}
        ]
    }
}