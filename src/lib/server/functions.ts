import { CLIENT_SECRET } from "$env/static/private"
import { PUBLIC_CLIENT_ID, PUBLIC_URL, PUBLIC_PROFILE_US, PUBLIC_PROFILE_EU } from "$env/static/public"

export async function getAccessToken(code: string) {
    const request = await fetch(`https://oauth.battle.net/token?redirect_uri=${PUBLIC_URL}&grant_type=authorization_code&code=${code}`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${btoa(PUBLIC_CLIENT_ID + ":" + CLIENT_SECRET)}`
        }
    })

    const { access_token } = await request.json()

    return {
        access_token
    }
}

export async function getCharacters(access_token: string) {
    let eu_characters = { wow_accounts: [{ characters: [] }] }
    let na_characters = { wow_accounts: [{ characters: [] }] }

    try {
        const request_na = await fetch(PUBLIC_PROFILE_US, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        na_characters = await request_na.json()
    } catch (e) {
        console.error(e)
    }

    try {
        const request_eu = await fetch(PUBLIC_PROFILE_EU, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        eu_characters = await request_eu.json()
    } catch (e) {
        console.error(e)
    }

    return { na_characters: na_characters.wow_accounts[0].characters, eu_characters: eu_characters.wow_accounts[0].characters }
}

export async function getCharacterImage(access_token: string, region: "eu" | "na", realm: string, characterName: string) {
    const request = await fetch(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${characterName.toLowerCase()}/character-media?namespace=profile-${region}&locale=${region == "eu" ? "en_GB" : "en_US"}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const { assets } = await request.json()

    return {
        image: assets[0].value
    }
}