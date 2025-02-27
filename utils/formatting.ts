export function removePolishCharacters(str: string): string {
    const diacriticMap: { [key: string]: string } = {
        'Ą': 'a', 'ą': 'a',
        'Ć': 'c', 'ć': 'c',
        'Ę': 'e', 'ę': 'e',
        'Ł': 'l', 'ł': 'l',
        'Ń': 'n', 'ń': 'n',
        'Ó': 'o', 'ó': 'o',
        'Ś': 's', 'ś': 's',
        'Ź': 'z', 'ź': 'z',
        'Ż': 'z', 'ż': 'z'
    };
    return str
        .replace(/[ĄąĆćĘęŁłŃńÓóŚśŹźŻż]/g, match => diacriticMap[match] || match)
        .toLowerCase();
}

export function formatNumberToBetterReadable(input: string) {
    let value = input.replace(/\s/g, "");
    if (/^\d*$/.test(value))
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return input
}