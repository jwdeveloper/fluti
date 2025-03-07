import type {OAuthEvent} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";
import type {FlutiUser} from "$lib/fluti/server/serverTypes";
import {pocketbaseClientAdmin} from "$lib/fluti/clients/pocketbase-client-admin";


export async function handlePocketBaseOAuth(event: OAuthEvent): Promise<FlutiUser> {
    let provider = await getProvider(event.provider);
    if (!provider) {
        throw new Error("OAuth provider not found!")
    }
    const admin = await pocketbaseClientAdmin();
    const result = await admin.collection('users')
        .authWithOAuth2Code(event.provider,
            event.code,
            event.verifier,
            event.redirect)

    const user = remapUserToFlutiUser(result, event.provider);
    return user;
}

async function getProvider(name: string) {
    const admin = await pocketbaseClientAdmin();
    const authProviders = await admin.collection('users').listAuthMethods();
    if (!authProviders.oauth2.enabled)
        throw new Error("OAuth disabled!")

    return authProviders.oauth2
        .providers
        .find(e => e.name === name.toLowerCase());
}

export function remapUserToFlutiUser(record: any, provider: string): FlutiUser {
    const user = record.meta;
    const id = record.record.id;
    const baseMapping = {
        id: id,
        login: user.email,
        email: user.email,
        verified: false,
        permissions: [],
        roles: [],
        country: 'en',
        claims: {},
        admin: record.record?.admin ?? false,
        profile: {
            name: user.name,
            firstName: user.name,
            lastName: user.name,
            picture: user.avatarUrl,
        }
    }
    const rawUser = user.rawUser;
    if (rawUser)
        switch (provider) {
            case 'google':
                baseMapping.verified = rawUser.email_verified;
                baseMapping.profile.firstName = rawUser.given_name
                baseMapping.profile.lastName = rawUser.family_name
                break;
            case 'discord':
                baseMapping.verified = rawUser.verified;
                baseMapping.login = rawUser.username;
                baseMapping.country = rawUser.locale;
                break
            case 'github':
                baseMapping.verified = true;
                baseMapping.login = rawUser.login;
                break
        }
    return baseMapping;
}
