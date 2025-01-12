import {redirect} from "@sveltejs/kit";


export const redirectTo = async (url: string) => {
    throw redirect(307, url)
}
