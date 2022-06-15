import axios from 'axios'
import querystring from 'querystring'
import  { getCookies, getCookie, setCookies, removeCookies } from 'cookies-next'

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env
const AUTH_ENDPOINT = 'https://accounts.spotify.com/api/token'
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

export default async (req, res) => {
    const code = req.query.code || null
    const DATA = new URLSearchParams({
        code: code, 
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
    })

    try {
        const response = await axios.post(AUTH_ENDPOINT, DATA, {
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        })
        console.log(response.data.refresh_token)

        setCookies('token', response.data.refresh_token, { req, res, httpOnly: false, maxAge: 60 * 60 * 24 })
        // res.send({ refresh_token: response.data.refresh_token })
    } catch (error) {
        console.log(error)
        // res.send({ error: error })
    }

    return res.redirect(302, '/')
}

// export default Login