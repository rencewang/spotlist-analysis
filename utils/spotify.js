import axios from 'axios'

const fetchByUrl = async (url) => {
  let results = []
  try {
    const token_response = await axios.get('/api/token')
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token_response.data}`,
      }
    })
    let { items, next } = await response.json()
    results.push(...items)

    // get next pages of API response
    while (next) {
      const nextPage = await fetch(next, {
        headers: {
          Authorization: `Bearer ${token_response.data}`,
        }
      })
      const nextPageData = await nextPage.json()
      items = nextPageData.items
      next = nextPageData.next
      results.push(...items)
    }
  } catch (error) {
    console.log(error)
  }
  return results
}

export const getPlaylists = async () => {
  return await fetchByUrl('https://api.spotify.com/v1/me/playlists')
}

export const getTracks = async (tracks_url) => {
  return await fetchByUrl(tracks_url)
}

// split array into smaller array of defined chunks
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

export const getGenresFromArtists = async (artistIds) => {
  const genres = new Map()
  // artists can only be called with maximum of 50
  const artistIdsList = chunk(artistIds, 50).map(e => e.join(','))

  try {
    const token_response = await axios.get('/api/token')
    artistIdsList.forEach(async (idList) => {
      const response = await axios.get('https://api.spotify.com/v1/artists', {
        params: {
          ids: idList,
        },
        headers: {
          Authorization: `Bearer ${token_response.data}`,
        }
      })
      const artists = response.data.artists
      artists.map(artist => {
        artist.genres.forEach(genre => {
          genres.set(genre, genres.get(genre) ? genres.get(genre) + 1 : 1)
        })
      })
      
      console.log(genres)
    })
    
    
  } catch (error) {
    console.log(error)
  }
}