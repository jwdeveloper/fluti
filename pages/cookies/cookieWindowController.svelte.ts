import type {CookieCategoryProps} from "$lib/fluti/pages/cookies/cookiePageTypes";

export class CookieWindowControllerSvelte {

    isOpen: boolean = $state(true)

    handleSaveClick(data: CookieCategoryProps[])
    {
        console.log('saved data', data)



    }

}


export function useCookieWindow() {
    return new CookieWindowControllerSvelte();
}