import {easeFunction} from "$lib/fluti/utils/ease";


export function flyWithNoOpacity(
    node: any,
    {
        delay = 0,
        duration = 400,
        easing = easeFunction.cubicOut(),
        x = 0,
        y = 0,
    } = {}
) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const [x_value, x_unit] = split_css_unit(x);
    const [y_value, y_unit] = split_css_unit(y);
    return {
        delay,
        duration,
        easing,
        css: (t: any, u: any) => `
			transform: ${transform} translate(${(1 - t) * x_value}${x_unit}, ${(1 - t) * y_value}${y_unit});
			`
    };
}

function split_css_unit(value: any) {
    const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
    return split ? [parseFloat(split[1]), split[2] || 'px'] : [/** @type {number} */ (value), 'px'];
}