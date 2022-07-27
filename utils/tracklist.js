import React, { useRef } from 'react'
import { Icon } from '@iconify/react'

import * as Styled from '../styles/pages'
import * as General from '../styles/general'

// still needed: loading indicator

const Tracklist = (props) => {
    const {name, tracks, copied, downloaded} = props

    const TracksToCSV = (tracks) => {
        let csvTracks = tracks.map(row => 
            '"' + row.track.name + 
            '","' + row.track.artists.map(artist => artist.name).join(', ') + 
            '","' + row.track.album.name + 
            '",' + row.added_at
        ).join('\r\n')
        return ("track_name, artists, album_name, added_at \r\n" + csvTracks)
    }

    const DownloadCSV = (event, generate_function, name) => {
        event.preventDefault()
        // Create a blob
        var blob = new Blob([generate_function], { type: 'text/csv;charset=utf-8;' })
        var url = URL.createObjectURL(blob)
        // Create a link to download it
        var pom = document.createElement('a')
        pom.href = url
        pom.setAttribute('download', `spotlist-tracks-${name}.csv`)
        pom.click()
      }

    // Copy to clipboard action
    const CopyToClipboard = (element) => {
        var range = document.createRange()
        range.selectNode(document.getElementById( element ))
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand("copy")
        window.getSelection().removeAllRanges()
    }

    // Disply copied & downloaded alert
    const ShowAlert = (ref) => {
        ref.current.style.opacity = 1
        ref.current.style.display = "block"
        setTimeout(() => ref.current.style.opacity = 0, 500)
        setTimeout(() => ref.current.style.display = "none", 700)
    }

    // Copy button component
    const CopyButton = ({ element }) => 
    <General.Button onClick={() => {CopyToClipboard(element); ShowAlert(copied)}}>
        <Icon icon="bx:copy" width="20px" />
    </General.Button>


    return (
        <Styled.Page>
            <General.Button className="download" onClick={(e) => {DownloadCSV(e, TracksToCSV(tracks), name.label); ShowAlert(downloaded)}}>Download tracklist as CSV</General.Button>

            <Styled.Table id="tracktable">
                <Styled.TracklistTableHead id='trackhead'>
                    <tr>
                        <th>#</th>
                        <th>Track</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Added on</th>
                    </tr>
                </Styled.TracklistTableHead>
            
                <Styled.TracklistTableBody>
                    {tracks.map((track, index) => ( 
                        <tr key={index}>
                            <td label="#">{index+1}</td>

                            <td label="Track">
                                <General.Justified>
                                    <div id={`${index}trackname`}>
                                        <General.Link href={track.track ? track.track.external_urls.spotify : null} target="_blank" rel="noopener noreferrer"> {track.track ? track.track.name : null}</General.Link>
                                    </div>
                                    <CopyButton element={`${index}trackname`} />
                                </General.Justified>
                            </td>

                            <td label="Artist">
                                <General.Justified>
                                    <div id={`${index}artistname`}>
                                        {track.track 
                                            ? track.track.artists.map((artist, index) => (
                                                index === 0 
                                                    ? <span key={index}>
                                                        <General.Link href={track.track.artists[index].external_urls.spotify || null} target="_blank" rel="noopener noreferrer">{artist.name}</General.Link>
                                                    </span> 
                                                    : <span key={index}>,&nbsp;
                                                        <General.Link href={track.track.artists[index].external_urls.spotify || null} target="_blank" rel="noopener noreferrer">{artist.name}</General.Link>
                                                    </span>
                                            )) 
                                            : null
                                        }
                                    </div>
                                    <CopyButton element={`${index}artistname`} />
                                </General.Justified>
                            </td>

                            <td label="Album">
                                <General.Justified>
                                    <div id={`${index}albumname`}>
                                        <General.Link href={track.track ? track.track.album.external_urls.spotify : null} target="_blank" rel="noopener noreferrer">{track.track ? track.track.album.name: null}</General.Link>
                                    </div>
                                    <CopyButton element={`${index}albumname`} />
                                </General.Justified>
                            </td>

                            <td label="Added on">
                                {track.added_at.substring(5,7)}/{track.added_at.substring(8,10)}/{track.added_at.substring(0,4)}
                            </td>
                        </tr> || null
                    ))}
                </Styled.TracklistTableBody>
            </Styled.Table>
        </Styled.Page>
    )
}

export default Tracklist