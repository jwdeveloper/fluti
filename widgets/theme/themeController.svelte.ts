export class ThemeController {
    theme: string = $state('')
    themes: any[] = $state([])

    constructor() {
        this.themes = [
            {
                text: "Ciemny",
                value: "dark-1"
            },
            {
                text: "Ciemny 2",
                value: "dark-2"
            },
            {
                text: "Ciemny 3",
                value: "dark-3"
            }
            ,
            {
                text: "Jasny",
                value: "light-1"
            },
            {
                text: "Ciemny 4",
                value: "dark-4"
            }
        ]
    }

    load() {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('theme='));

        const themeValue = cookie?.split('=')[1];

        if (themeValue) {
            document.documentElement.setAttribute("data-theme", themeValue);
            this.theme = themeValue;
        }
    }

    setTheme(name: string) {
        document.documentElement.setAttribute("data-theme", name);
        document.cookie = `theme=${name}; path=/; max-age=31536000`; // 1 year
        this.theme = name;
    }

}

let theme = new ThemeController()

export let useThemes = () => {
    return theme;
}