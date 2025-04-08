export function range(start: number, end?: number): number[] {
    if (end === undefined) {
        end = start - 1;
        start = 0;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}