import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getCookies } from 'cookies-next'
import Select from 'react-select'

import { getPlaylists, getTracks, getGenresFromArtists } from '../utils/spotify'
import Tracklist from '../utils/tracklist'
import Analysis from '../utils/analysis'
import * as Styled from '../styles/general'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [onTracklistPage, setOnTracklistPage] = useState(true)

  useEffect(() => { 
    // remove search query in redirect
    if (window.location.search) {
      window.location.href = `${window.location.origin}${window.location.pathname}`
    }

    // fill playlists in once when first load
    (async () => {
      // user is logged in if there is a refresh token stored
      if (getCookies('token').token) { 
        await fillPlaylists()
        setLoggedIn(true)
      }
      setIsLoading(false)
    })()
  }, [])

  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])
  
  const fillPlaylists = async () => {
    const playlists_response = await getPlaylists()
    setPlaylists(playlists_response)
  }

  // dropdown options for selecting playlist
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const playlistOptions = useMemo(() => 
    playlists.map(playlist => ({
      value: playlist.tracks.href,
      label: playlist.name
    }))
  , [playlists])

  // fill tracks and artists when new playlist selected
  useEffect(() => {
    if (selectedPlaylist) fillTracksArtistsGenres(selectedPlaylist.value)
    console.log(selectedPlaylist)
  }, [selectedPlaylist])

  const fillTracksArtistsGenres = async (url) => {
    let artists = []
    let artists_ids = []
    let artists_count = {}

    // get artists from tracks and genres from artists
    const tracks_response = await getTracks(url)
    tracks_response.forEach(track => {
      track.track.artists.forEach(artist => {
        artists.push(artist)
        artists_ids.push(artist.id)
        artists_count[artist.name] = (artists_count[artist.name] || 0) + 1
      })
    })
    let genre_response = await getGenresFromArtists(artists_ids)

    // sort artists and genres by occurrence in playlist
    let artists_sort = []
    let genres_sort = []
    Object.keys(artists_count).forEach(artist => {
      artists_sort.push({name: artist, count: artists_count[artist]})
    })
    Object.keys(genre_response).forEach(genre => {
      genres_sort.push({name: genre, count: genre_response[genre]})
    })
    artists_sort.sort((a, b) => {return b.count - a.count})
    genres_sort.sort((a, b) => {return b.count - a.count})

    setTracks(tracks_response)
    setArtists(artists_sort)
    setGenres(genres_sort)
  }

  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      

      {isLoading 
        ? 
        <div>loading...</div> 
        : 
        <Styled.Container>
          <Styled.Header>
            <Styled.Flex>
              <Styled.Button onClick={() => setOnTracklistPage(true)}>Tracklist</Styled.Button>
              <Styled.Button onClick={() => setOnTracklistPage(false)}>Analysis</Styled.Button>
            </Styled.Flex>

            {loggedIn 
              ? 
              <Select defaultValue={selectedPlaylist} onChange={setSelectedPlaylist} options={playlistOptions} />
              : 
              <Link href="/api/login"><Styled.Button>Sign in</Styled.Button></Link>
            }
          </Styled.Header>

          <Styled.Content>
            {tracks.length 
              ? (onTracklistPage 
                ? <Tracklist name={selectedPlaylist} owner="who" tracks={tracks} />
                : <Analysis artists={artists} genres={genres} /> 
              )
              : <div>select a playlist</div>
            }
            
          </Styled.Content>
          
          
        </Styled.Container>
      }
    </main>
  )
}
