export function humanize(value: unknown): string {
    if (value == null) return '';

    // Date or ISO string
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
        const date = value instanceof Date ? value : new Date(value);
        return timeAgo(date);
    }

    // Number
    if (typeof value === 'number') {
        return abbreviateNumber(value);
    }

    // String
    if (typeof value === 'string') {
        return sentenceCase(value);
    }

    return String(value);
}

function timeAgo(date: Date): string {
    const now = new Date().getTime();
    const diff = Math.floor((now - date.getTime()) / 1000); // in seconds

    const units: [number, string][] = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [30, 'day'],
        [12, 'month'],
        [Number.MAX_SAFE_INTEGER, 'year'],
    ];

    let i = 0;
    let time = diff;

    for (; i < units.length && time >= units[i][0]; i++) {
        time = Math.floor(time / units[i][0]);
    }

    const label = units[i - 1][1];
    return `${time} ${label}${time !== 1 ? 's' : ''} ago`;
}

function abbreviateNumber(num: number): string {
    if (num < 1000) return num.toString();

    const units = ['K', 'M', 'B', 'T'];
    let unitIndex = -1;
    let reduced = num;

    while (reduced >= 1000 && unitIndex < units.length - 1) {
        reduced /= 1000;
        unitIndex++;
    }

    return `${+reduced.toFixed(1)}${units[unitIndex]}`;
}

function sentenceCase(str: string): string {
    // Split PascalCase or camelCase into words
    const result = str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
}
