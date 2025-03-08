export class CookieWindowControllerSvelte {

    isOpen: boolean = $state(false)


}


export function useCookieWindow() {
    return new CookieWindowControllerSvelte();
}