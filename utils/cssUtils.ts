export function transparentColor(color: string, alpha: number=0.8): string {
    const hexMatch = color.match(/^#([A-Fa-f0-9]{3}){1,2}$/);
    if (hexMatch) {
        // Convert hex to RGB
        let r: number, g: number, b: number;
        if (color.length === 4) {
            // Short hex (#RGB)
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);
        } else {
            // Full hex (#RRGGBB)
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // If it's not a hex color, assume it's a CSS color and return with alpha applied
    return `rgba(var(${color}), ${alpha})`;
}