import { fetchByURL } from '../../../utils/spotify'
import { getSession } from 'next-auth/react'

const handler = async (req, res) => {
    const { pid } = req.query
    let tracks = []

    try {
        const {
            token: { accessToken },
        } = await getSession({req})
        const response = await fetchByURL(accessToken, `https://api.spotify.com/v1/playlists/${pid}/tracks`)
        let { items, next } = await response.json()
        tracks.push(...items)

        while (next) {
            const nextPage = await fetchByURL(accessToken, next)
            const nextPageData = await nextPage.json()

            items = nextPageData.items
            next = nextPageData.next
            tracks.push(...items)
        }

        return res.status(200).json({ tracks })
    } catch (error) {
        return error
    }
}

export default handler