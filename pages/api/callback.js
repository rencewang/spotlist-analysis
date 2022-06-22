import axios from 'axios'
import { setCookies } from 'cookies-next'

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, DOMAIN_URL } = process.env
const AUTH_ENDPOINT = 'https://accounts.spotify.com/api/token'
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

export default async (req, res) => {
    const code = req.query.code || null
    const DATA = new URLSearchParams({
        code: code, 
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
    })
    console.log(DOMAIN_URL)

    try {
        const response = await axios.post(AUTH_ENDPOINT, DATA, {
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        })
        setCookies('token', response.data.refresh_token, { req, res, httpOnly: false, maxAge: 60 * 60 * 24 })
        res.redirect(DOMAIN_URL)
    } catch (error) {
        console.log(error)
        res.redirect(500, '/')
    }
}