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
        let themeValue = localStorage.getItem("theme");
        if (themeValue === null)
            themeValue = "light";
        document.documentElement.setAttribute("data-theme", themeValue);
        this.theme = themeValue;
    }

    setTheme(name: string) {
        document.documentElement.setAttribute("data-theme", name);
        localStorage.setItem("theme", name);
        this.theme = name;
    }

}

let theme = new ThemeController()

export let useThemes = () => {
    return theme;
}