import type {CookieCategoryProps} from "$lib/fluti/pages/cookies/cookiePageTypes";

export class CookieWindowControllerSvelte {

    isOpen: boolean = $state(false)
    isOpenBanner: boolean = $state(true)

    openCookiesWindow() {
        if (localStorage.getItem("cookie-window-accepted")) {
            this.isOpen = false;
            this.isOpenBanner = false;
            return
        }
    }

    handleSaveClick(data: CookieCategoryProps[]) {

        localStorage.setItem("cookie-window-accepted", JSON.stringify(data))
        this.isOpen = false;
    }

    handleEditCookiesClick() {
        this.isOpen = true;
    }

}


export function useCookieWindow() {
    return new CookieWindowControllerSvelte();
}