import axios from "axios"

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const getAccessToken = async (refresh_token) => {
    const AUTH = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64')
    const DATA = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
    })
    
    const response = await axios.post(TOKEN_ENDPOINT, DATA, {
        headers: {
            Authorization: `Basic ${AUTH}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })

    console.log(response)
    
    return response.json().access_token
}

export default getAccessToken

// export const fetchByURL = async (refresh_token, URL) => {
//     const access_token = await getAccessToken()
//     return fetch(URL, {
//         headers: {
//             Authorization: `Bearer ${access_token}`,
//         },
//     })
// }