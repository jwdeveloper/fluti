import {addClass, addElement, animate, animateProperty, move, pos} from "./AnimatorExtensions";
import {wait} from "$lib/fluti/utils/Wait";

export let defaultTime = 600;
export let longestTime = 600;

const extensionMethods: any = {}


export function addExtension(fn: any, name: string) {
    extensionMethods[name] = fn;
}

addExtension(addElement, "addElement")
addExtension(move, "move")
addExtension(addClass, "addClass")
addExtension(pos, "pos")
addExtension(animate, "animate")
addExtension(animateProperty, "animateProperty")


export function animatedElement(element: any) {

    const handler =
        {
            get: function (target: any, propertyName: any, handlerInstance: any) {
                if (propertyName in extensionMethods) {
                    return extensionMethods[propertyName].bind(handlerInstance);
                }

                if (propertyName === 'rect')
                    return element.getBoundingClientRect().toJSON()

                if (propertyName === 'style')
                    return element.style;

                if (propertyName === 'parent')
                    return animatedElement(element.parentElement)

                if (propertyName === 'element')
                    return element;

                if (propertyName === 'child') {
                    return (name: string) => {
                        return animatedElement(element.querySelector(name))
                    }
                }

                if (propertyName === 'children') {
                    let res = []
                    for (let el of element.children) {
                        res.push(animatedElement(el))
                    }
                    return res;
                }
                return async (targetValue: any, time: any, mathFn: any) => {
                    if (time === undefined)
                        time = defaultTime;
                    return doAnimateProperty(element, propertyName, targetValue, time, target, mathFn);
                };
            }
        };
    return new Proxy(element, handler);
}

export function doAnimateProperty(element: any, property: any, targetValue: any, time: any, target: any, animationMetod: any) {

    if (property === "then") {
        return targetValue();
    }

    if (animationMetod === undefined)
        animationMetod = "ease-in-out"

    let promise = new Promise((resolve) => {
        let payload = {};
        //@ts-ignore
        payload[property] = targetValue;
        const animation = element.animate(
            payload,
            {
                duration: time,
                fill: 'forwards',
                easing: animationMetod,
            }
        );
        // Listen for the animation's finish event
        animation.onfinish = () => {
            resolve(target);
        };
    });

    //@ts-ignore
    Promise.prototype.wait = async function (time) {
        const result = await this;
        await wait(time);
        return result;
    };
    return promise;
}







