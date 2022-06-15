import { getCookies, setCookies, removeCookies } from 'cookies-next';

const { CLIENT_ID, CLIENT_SECRET } = process.env
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'


export default async (req, res) => {
    const refresh_token = getCookies('token').token
    const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')
    const DATA = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
    })
    const PARAM = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
        client_id: CLIENT_ID,
        response_type: 'code'
    })

    try {
        const response = await axios.post(TOKEN_ENDPOINT, DATA, {
            headers: {
                Authorization: `Basic ${AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        
        res.send(response)
    } catch (error) {
        res.send(error)
    }

    // console.log(response)
    
    // return response.json().access_token
}