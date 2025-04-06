import type {CookieCategoryProps} from "$lib/fluti/pages/cookies/cookiePageTypes";

export class CookieWindowControllerSvelte {

    isOpen: boolean = $state(false)
    isOpenBanner: boolean = $state(false)

    openCookiesWindow() {
        if (localStorage.getItem("cookie-window-accepted")) {
            this.isOpen = false;
            this.isOpenBanner = false;
            return
        }
        this.isOpenBanner = true;
    }

    handleSaveClick(data: CookieCategoryProps[]) {

        localStorage.setItem("cookie-window-accepted", JSON.stringify(data))
        this.isOpen = false;
        this.isOpenBanner = false;
    }

    handleEditCookiesClick() {
        this.isOpen = true;
    }

}


export function useCookieWindow() {
    return new CookieWindowControllerSvelte();
}