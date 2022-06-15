import querystring from 'query-string'

const { CLIENT_ID, REDIRECT_URI } = process.env
const SCOPES = [ "user-top-read user-read-recently-played user-read-currently-playing playlist-read-private user-library-read" ]
const AUTH_PARAM = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: true
})

export default async (req, res) => {
    // Redirect all requests to Spotify auth
    return res.redirect(`https://accounts.spotify.com/authorize?${AUTH_PARAM}`)
}