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
  
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [artistIds, setArtistIds] = useState([])

  const fillPlaylists = async () => {
    const playlists_response = await getPlaylists()
    setPlaylists(playlists_response)
  }

  const fillTracksArtists = async (url) => {
    const tracks_response = await getTracks(url)
    setTracks(tracks_response)
    setArtists([])
    setArtistIds([])
    tracks_response.map((item) => {
      setArtists(artists => [...artists, ...item.track.artists])
      item.track.artists.map((artist) => {
        setArtistIds(artistIds => [...artistIds, artist.id])
      })
    })
  }

  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const playlistOptions = useMemo(() => 
    playlists.map(playlist => ({
      value: playlist.tracks.href,
      label: playlist.name
    }))
  , [playlists]);

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


        {/* <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          /> */}

        <button onClick={() => getGenresFromArtists(artistIds)}>hi</button>

        <section id="playlist-listing">
          {playlists.map((item, index) => (
            <div key={index}>
              <button onClick={() => fillTracksArtists(item.tracks.href)}>{item.name}</button>
            </div>
          ))}
        </section>

        <section id="playlist-analysis">
          {tracks.map((item, index) => (
            <div key={index}>
              <div>{item.track.name}</div>
            </div>
          ))}

          {artists.map((item, index) => (
            <div key={index}>
              <div>{item.name}</div>
            </div>
          ))}
        </section>
      </>}
    </main>
  )
}
