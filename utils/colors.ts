export function randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function hexToHue(hex: string): number {
    // Remove leading #
    hex = hex.replace(/^#/, '');

    // Expand shorthand (#abc → #aabbcc)
    if (hex.length === 3) {
        hex = hex.split('').map(ch => ch + ch).join('');
    }

    if (hex.length !== 6) {
        throw new Error('Invalid hex color');
    }

    // Parse RGB
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;

    if (delta !== 0) {
        switch (max) {
            case r:
                h = ((g - b) / delta) % 6;
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }

        h *= 60;
        if (h < 0) h += 360;
    }

    return h;
}

export function getHexColorBrightness(hex: string): number {
    // Normalize using CSS parser (e.g. convert "red" → "#ff0000")
    //@ts-ignore
    hex = parseCssColorToHex(hex);

    if (!hex) {
        throw new Error("Invalid CSS color");
    }

    hex = hex.replace(/^#/, '');

    // Expand shorthand (#abc → #aabbcc)
    if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // Support #RRGGBB and #RRGGBBAA
    if (hex.length !== 6 && hex.length !== 8) {
        throw new Error("Invalid hex color format");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    // Perceived brightness formula (normalized to 0–1), affected by alpha
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return brightness * a;
}

function hexToHSL(hex: string) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l: number = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
        }
        //@ts-ignore
        h /= 6;
    }
    //@ts-ignore
    return {h: h * 360, s: s * 100, l: l * 100};
}

function hslToHex(h:number, s:number, l:number) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let [r, g, b] = [0, 0, 0];

    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function makeVibrant(hex:string, saturationBoost = 1.3, lightnessBoost = 1.1) {
    let hsl = hexToHSL(hex);
    hsl.s = Math.min(100, hsl.s * saturationBoost);
    hsl.l = Math.min(100, hsl.l * lightnessBoost);
    return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustHexIntensity(hex: string, intensity: number): string {
    // Remove # and normalize
    const parsed = parseCssColorToHex(hex);
    if (!parsed) throw new Error("Invalid CSS color");

    hex = parsed

    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(ch => ch + ch).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0));
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }

        h *= 60;
    }

    // Adjust intensity by changing lightness
    let newL = Math.min(1, Math.max(0, l * intensity));

    // Convert back to RGB
    const c = (1 - Math.abs(2 * newL - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = newL - c / 2;

    let r1 = 0, g1 = 0, b1 = 0;

    if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];

    const toHex = (n: number) =>
        Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, '0');

    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

export function parseCssColorToHex(cssColor: string): string | null {
    const tempEl = document.createElement("div");
    tempEl.style.color = cssColor;
    document.body.appendChild(tempEl);

    const computed = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const match = computed.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
    if (!match) return null;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;

    const toHex = (n: number) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}


export function adjustHexTransparencyToHex(hex: string, alpha: number): string {
    // Optional: convert named colors, rgba, etc. to hex
    const parsed = parseCssColorToHex(hex);
    if (!parsed) throw new Error("Invalid CSS color");

    hex = parsed.replace(/^#/, '');

    // Handle #RRGGBBAA (8-digit hex)
    let r: number, g: number, b: number;
    if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        // ignore original alpha and override with new one
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        throw new Error("Invalid hex color format");
    }

    // Clamp alpha and convert to 0–255
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255);

    const toHex = (n: number) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}