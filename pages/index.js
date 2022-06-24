import React, { useEffect, useMemo, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getCookies } from 'cookies-next'
import Select from 'react-select'

import { getPlaylists, getTracks, getGenresFromArtists } from '../utils/spotify'
import Tracklist from '../utils/tracklist'
import Analysis from '../utils/analysis'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

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
  
  const fillPlaylists = async () => {
    const playlists_response = await getPlaylists()
    setPlaylists(playlists_response)
  }
  
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])

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

  const copied = useRef(null)
  const tryagain = useRef(null)
  const [onTracklist, setOnTracklist] = useState(true)

  // For "Copied" alert
  const ShowAlert = (ref) => {
    ref.current.style.opacity = 1
    ref.current.style.display = "block"
    setTimeout(() => ref.current.style.opacity = 0, 300)
    setTimeout(() => ref.current.style.display = "none", 400)
  }

  

  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="alert-message" ref={copied}>Copied!</div>
      <div className="alert-message" ref={tryagain}>Try again with a valid playlist ID or link</div>

      {isLoading ? <div>loading...</div> : 
      <>
        <header>
          <div>Spotlist</div>
          <button onClick={() => setOnTracklist(true)}>Tracklist</button>
          <button onClick={() => setOnTracklist(false)}>Analysis</button>
          {loggedIn 
            ? 
            <Select
              defaultValue={selectedPlaylist}
              onChange={setSelectedPlaylist}
              options={playlistOptions}
            />
            : 
            <button><Link href="/api/login">Sign in</Link></button>
          }
        </header>

        {onTracklist 
          ?
          <Tracklist name={selectedPlaylist} owner="who" tracks={tracks} ShowAlert={ShowAlert} copiedRef={copied} />
          :
          <Analysis artists={artists} genres={genres} /> 
        }
        
        
      </>}
    </main>
  )
}
