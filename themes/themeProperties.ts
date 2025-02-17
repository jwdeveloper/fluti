export const bgPrimary = "var(--bg-primary)"
export const bgSecondary = "var(--bg-secondary)"
export const bgTertiary = "var(--bg-tertiary)"
export const bgAccent = "var(--bg-accent)"
export const bgTransparent = "var(--bg-transparent)"


//TODO removal
export const accentPrimary = "var(--accent-primary)"

export const textLight = "var(--text-light)"
export const textPrimary = "var(--text-primary)"
export const textNeutral = "var(--text-neutral)"
export const textMuted = "var(--text-muted)"
export const textError = "var(--text-error)"
export const textAccent = "var(--text-accent)"


export const flutiTheme = {

    font: {
        tiny: 'var(--font-size-tiny)',
        small: 'var(--font-size-small)',
        medium: 'var(--font-size-medium)',
        large: 'var(--font-size-large)',
        huge: 'var(--font-size-huge)'

    },

    zIndex: {
        i1: `var(--z-index-1)`,
        i2: `var(--z-index-2)`,
        i3: `var(--z-index-3)`,
        i4: `var(--z-index-4)`,
        i5: `var(--z-index-5)`,
        i6: `var(--z-index-6)`,
    },

    radius: {
        tiny: 'var(--radius-tiny)',
        small: 'var(--radius)',
        medium: 'var(--radius-medium)',
        large: 'var(--radius-strong)',
        huge: 'var(--radius-max)'

    },
    border: {
        small: '',
        medium: '',
        big: ''
    },

    padding: {
        tiny: 'var(--padding-tiny)',
        small: 'var(--padding-small)',
        medium: 'var(--padding-medium)',
        large: 'var(--padding-large)',
        huge: 'var(--padding-huge)'
    },

    background: {
        primary: bgPrimary,
        secondary: bgSecondary,
        tertiary: bgTertiary,
        accent: accentPrimary,
        transparent: bgTransparent,
        shadow: 'var(--shadow)'
    },
    color: {
        light: textLight,
        primary: textPrimary,
        neutral: textNeutral,
        muted: textMuted,
        error: textError,
        accent: textAccent,
    }
}
