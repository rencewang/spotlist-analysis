import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getCookies } from 'cookies-next'
import Select from 'react-select'

import { getPlaylists, getTracks, getGenresFromArtists } from '../utils/spotify'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => { 
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
  }, [selectedPlaylist])

  const fillTracksArtistsGenres = async (url) => {
    const tracks_response = await getTracks(url)
    const artists_response = tracks_response.flatMap(item => item.track.artists)
    const artists_ids = artists_response.map(({ id }) => id)
    const genre_response = await getGenresFromArtists(artists_ids)

    setTracks(tracks_response)
    setArtists(artists_response)
    setGenres(genre_response)
  }

  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? <div>loading...</div> : 
      <>
        <header>
          <div>Spotlist</div>
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

        <div className="listing-container">
          <section className="listing-table" id="playlist-tracks">
            {tracks.map((item, index) => (
              <div key={index}>
                <div>{item.track.name}</div>
              </div>
            ))}
          </section>

          <section className="listing-table" id="playlist-artists">
            {artists.map((item, index) => (
              <div key={index}>
                <div>{item.name}</div>
              </div>
            ))}
          </section>

          <section className="listing-table" id="playlist-genres">
            {Object.keys(genres).map((item, index) => (
              <div key={index}>
                <div>{item}:{genres[item]}</div>
              </div>
            ))}
          </section>
        </div>
      </>}
    </main>
  )
}
