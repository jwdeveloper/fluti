export function random(from: number, to?: number): number {
    const max = to === undefined ? from : to;
    const offset = to === undefined ? from : 0;
    const number = Math.floor(offset + Math.random() * max)
    return number;
}


export function range(start: number, end?: number): number[] {
    if (end === undefined) {
        end = start - 1;
        start = 0;
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
}