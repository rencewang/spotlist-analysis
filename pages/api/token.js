import { getCookies } from 'cookies-next'

const { CLIENT_ID, CLIENT_SECRET } = process.env
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

export default async (req, res) => {
    const refresh_token = getCookies({ req, res }).token
    if (!refresh_token) {
        return res.status(401).send("No refresh token");
    }

    const DATA = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
    })

    try {
        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: DATA
        })
        const data = await response.json()
        res.send(data.access_token)
    } catch (error) {
        console.error("Token Error", error.message);
        res.status(500).send("Failed to retrieve token");
    }
}