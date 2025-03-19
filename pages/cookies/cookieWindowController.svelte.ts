import type {CookieCategoryProps} from "$lib/fluti/pages/cookies/cookiePageTypes";

export class CookieWindowControllerSvelte {

    isOpen: boolean = $state(false)

    openCookiesWindow() {
        if (localStorage.getItem("cookie-window-accepted")) {
            this.isOpen = false;
            return
        }
        this.isOpen = true;
    }

    handleSaveClick(data: CookieCategoryProps[]) {
        localStorage.setItem("cookie-window-accepted", JSON.stringify(data))
        this.isOpen = false;
    }

}


export function useCookieWindow() {
    return new CookieWindowControllerSvelte();
}