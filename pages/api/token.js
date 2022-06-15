import axios from "axios"
import { getCookies } from 'cookies-next'

const { CLIENT_ID, CLIENT_SECRET } = process.env
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

export default async (req, res) => {
    const refresh_token = getCookies({ req, res }).token
    const DATA = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
    })

    try {
        const response = await axios.post(TOKEN_ENDPOINT, DATA, {
            headers: {
                Authorization: `Basic ${AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        res.send(response.data.access_token)
    } catch (error) {
        // console.log(error)
        res.send({ error: error })
    }
}