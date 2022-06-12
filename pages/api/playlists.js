import { fetchByURL } from '../../utils/spotify'
import { getSession } from 'next-auth/react'

const handler = async (req, res) => {
    let playlists = []

    try {
        const {
            token: { accessToken },
        } = await getSession({req})
        const response = await fetchByURL(accessToken, 'https://api.spotify.com/v1/me/playlists')
        let { items, next } = await response.json()
        playlists.push(...items)

        while (next) {
            const nextPage = await fetchByURL(accessToken, next)
            const nextPageData = await nextPage.json()

            items = nextPageData.items
            next = nextPageData.next
            playlists.push(...items)
        }
        return res.status(200).json({ playlists })
        
    } catch (error) {
        return error
    }
}

export default handler