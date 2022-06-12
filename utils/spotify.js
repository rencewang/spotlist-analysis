const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async (refresh_token) => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
      })
    
    return response.json()
}

export const fetchByURL = async (refresh_token, URL) => {
    const { access_token } = await getAccessToken(refresh_token)
    return fetch(URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })
}