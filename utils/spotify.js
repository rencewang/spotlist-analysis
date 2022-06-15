import axios from 'axios'

export const getPlaylists = async () => {
    let playlists = []
    try {
      const token_response = await axios.get('/api/token')
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token_response.data}`,
        }
      })
      let { items, next } = await response.json()
      playlists.push(...items)

      while (next) {
        const nextPage = await fetch(next, {
          headers: {
            Authorization: `Bearer ${token_response.data}`,
          }
        })
        const nextPageData = await nextPage.json()
        items = nextPageData.items
        next = nextPageData.next
        playlists.push(...items)
      }
    } catch (error) {
      console.log(error)
    }
    return playlists
}