import React, { useEffect, useMemo, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getCookies } from 'cookies-next'
import Select from 'react-select'

import { getPlaylists, getTracks, getGenresFromArtists } from '../utils/spotify'
import Tracklist from '../utils/tracklist'
import Analysis from '../utils/analysis'
import * as Styled from '../styles/general'

const Home = () => {
  const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false)
  const [isTracksLoading, setIsTracksLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(null)
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
        setLoggedIn(true)
        await fillPlaylists()
      } else {
        setLoggedIn(false)
      }
    })()
  }, [])

  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])
  
  const fillPlaylists = async () => {
    setIsPlaylistsLoading(true)
    const playlists_response = await getPlaylists()
    setPlaylists(playlists_response)
    setIsPlaylistsLoading(false)
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
  }, [selectedPlaylist])

  const fillTracksArtistsGenres = async (url) => {
    let artists = []
    let artists_ids = []
    let artists_count = {}

    setIsTracksLoading(true)
    const tracks_response = await getTracks(url)
    setTracks(tracks_response)
    setIsTracksLoading(false)

    // get artists from tracks and genres from artists
    tracks_response.forEach(track => {
      track.track.artists.forEach(artist => {
        artists.push(artist)
        artists_ids.push(artist.id)
        artists_count[artist.name] = (artists_count[artist.name] || 0) + 1
      })
    })

    // sort artists and genres by occurrence in playlist
    let genre_response = await getGenresFromArtists(artists_ids)
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

    setArtists(artists_sort)
    setGenres(genres_sort)
  }

  const copied = useRef(null)
  const downloaded = useRef(null)

  return (
    <main>
      <Head>
        <title>Spotlist</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {loggedIn !== null &&
      <Styled.Container>
        <Styled.Alert ref={copied}>Copied!</Styled.Alert>
        <Styled.Alert ref={downloaded}>Download started!</Styled.Alert>

        <Styled.Header>
          {loggedIn &&
            <Select 
              defaultValue={selectedPlaylist} 
              onChange={setSelectedPlaylist} 
              options={playlistOptions} 
              styles={Styled.SelectOptions}
              isLoading={isPlaylistsLoading}
              theme={(theme) => Styled.SelectTheme(theme)}
            />
          }

          <Styled.Flex>
            <Styled.Button onClick={() => setOnTracklistPage(true)}>Tracklist</Styled.Button>
            <Styled.Button onClick={() => setOnTracklistPage(false)}>Analysis</Styled.Button>
            {loggedIn 
              ? <Link href="/api/logout"><Styled.Button>Sign out</Styled.Button></Link>
              : <Link href="/api/login"><Styled.Button>Sign in</Styled.Button></Link>
            }
          </Styled.Flex>

        </Styled.Header>

        <Styled.Content>
          {isTracksLoading 
            ? <Styled.FullPage><div>Loading, please wait...</div></Styled.FullPage> 
            : (tracks.length
              ? (onTracklistPage 
                ? <Tracklist name={selectedPlaylist} tracks={tracks} copied={copied} downloaded={downloaded} />
                : <Analysis name={selectedPlaylist} artists={artists} genres={genres} downloaded={downloaded} /> 
              )
              : (loggedIn 
                ? (selectedPlaylist 
                  ? <Styled.FullPage><div>This playlist seems empty, try a different one...</div></Styled.FullPage>
                  : <Styled.FullPage><div>Select a playlist</div></Styled.FullPage>) 
                : <Styled.FullPage><div>Log in with Spotify to see your playlists</div></Styled.FullPage>
              )
            )
          }
        </Styled.Content>
      </Styled.Container>
      }
    </main>
  )
}

export default Home