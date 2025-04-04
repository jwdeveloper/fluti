import {all} from "$lib/fluti/utils/Wait";
import {animatedElement, defaultTime, doAnimateProperty} from "./AnimatedElement";

export function addElement(content: any) {
    //@ts-ignore
    let element = this.element;

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    const newElement = tempContainer.firstChild;

    element.appendChild(newElement);
    return animatedElement(newElement)
}

export function pos(targetValue: any, time: any, mathFn: any) {
    //@ts-ignore
    let instance = this;
    if (time === undefined)
        time = defaultTime;

    let x = targetValue.split(",")[0]
    let y = targetValue.split(",")[1]


    //@ts-ignore
    this.element.style.position = 'absolute'
    return all(async () => {
        //@ts-ignore
        doAnimateProperty(this.element, "left", x, time, instance, mathFn);
        //@ts-ignore
        doAnimateProperty(this.element, "top", y, time, instance, mathFn);
    }, time)
}

export function move(targetValue: string, time: number, mathFn: string) {
    //@ts-ignore
    let instance = this;
    if (time === undefined)
        time = defaultTime;
    //@ts-ignore
    return doAnimateProperty(this.element, "transform", `translate(${targetValue})`, time, instance, mathFn);
}


export function addClass(name: string) {
    return (name: string, time: number) => {
        if (time === undefined)
            time = defaultTime;

        //@ts-ignore
        let element = this.element;
        const elementStyles = getComputedStyle(element);

        let beforeApply = getStylesValues(elementStyles)
        element.classList.add(name);
        let afterApply = getStylesValues(elementStyles)
        element.classList.remove(name);

        const keyframes = {};
        for (let key in beforeApply) {
            //@ts-ignore
            const currentValue = beforeApply[key];
            //@ts-ignore
            const targetValue = afterApply[key];

            if (currentValue === targetValue)
                continue
            //@ts-ignore
            keyframes[key] = [currentValue, targetValue];
        }
        const animation = element.animate(keyframes, {
            duration: time,
            easing: 'ease-in-out'
        });
        animation.onfinish = () => {
            element.classList.add(name);
        };
    }
}


export const isAnimatable = (property: string) => {
    // List of animatable properties (you can expand this list)
    const animatableProperties = [
        'opacity', 'transform', 'color', 'background-color',
        'width', 'height', 'margin', 'padding', 'border-width',
        'top', 'left', 'right', 'bottom', 'font-size',
        'line-height', 'letter-spacing', 'word-spacing', 'text-shadow',
        'box-shadow', 'border-radius'
    ];

    // Check if the property is in the animatable list
    return animatableProperties.includes(property);
};


export function getStylesValues(styles: any) {
    let result = {}
    for (let i = 0; i < styles.length; i++) {
        const property = styles[i];

        if (!isAnimatable(property)) {
            continue
        }

        //@ts-ignore
        const currentValue = styles.getPropertyValue(property);
        //@ts-ignore
        result[property] = currentValue
    }
    return result;
}


export function animate(frames: Keyframe[] | PropertyIndexedKeyframes) {
    //@ts-ignore
    let element = this.element;
    element.animate(
        frames,
        {
            duration: 600,
            fill: 'forwards',
            easing: 'ease-in-out',
        }
    );
}


export interface AnimatePropertyOptions {
    property: string
    from: any,
    to: any,
    time?: number
    easing?: string
}

export function animateProperty(options: AnimatePropertyOptions) {
    //@ts-ignore
    const element:HTMLHtmlElement = this.element;

    const frame1 = {}
    const frame2 = {}

    //@ts-ignore
    frame1[options.property] = options.from;
    //@ts-ignore
    frame2[options.property] = options.to;
    const frames: any = [frame1, frame2]
    element.animate(
        frames,
        {
            duration: options.time ?? defaultTime,
            fill: 'forwards',
            easing: options.easing ?? 'ease-in-out',
        }
    );
}