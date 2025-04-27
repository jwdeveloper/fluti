export function random(from: number, to?: number): number {
    const max = to === undefined ? from : to;
    const offset = to === undefined ? from : 0;
    const number = Math.floor(offset + Math.random() * max)
    return number;
}

export function randomItems<T>(array: T[], amount: number, from: number = 0, to: number = array.length): T[] {
    if (array.length === 0 || amount <= 0) {
        return [];
    }

    const start = Math.max(0, from);
    const end = Math.min(array.length, to);

    if (start >= end) {
        return [];
    }

    const availableItems = array.slice(start, end);
    const result: T[] = [];

    const taken = new Set<number>();

    while (result.length < Math.min(amount, availableItems.length)) {
        const index = Math.floor(Math.random() * availableItems.length);
        if (!taken.has(index)) {
            result.push(availableItems[index]);
            taken.add(index);
        }
    }

    return result;
}


export function range(start: number, end?: number): number[] {
    if (end === undefined) {
        end = start - 1;
        start = 0;
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
}