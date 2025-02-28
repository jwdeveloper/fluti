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

export function formatNumberToBetterReadable(input: string | number, endfix: string = '') {

    if (typeof input === 'number')
        input += ""

    let value = input.replace(/\s/g, "");
    if (/^\d*$/.test(value))
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + endfix;

    return input + endfix
}

export function formatRelativeDate(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    // Convert to "YYYY-MM-DD" format for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Calculate the difference in days
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 21) return "2 weeks ago";
    if (diffDays < 30) return "3 weeks ago";
    return `${Math.floor(diffDays / 30)} months ago`;
}