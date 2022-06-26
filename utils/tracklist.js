import React, { useRef } from 'react'
import { Icon } from '@iconify/react'

import * as Styled from '../styles/tracklist'
import * as General from '../styles/general'

// const CopyButton = (element, ref) => {


//     return (
        
//     )
// }

const Tracklist = (props) => {
    const {name, owner, tracks} = props
    const copied = useRef(null)

    const TracksToCSV = (tracks) => {
        let csvTracks = tracks.map(row => 
            '"' + row.track.name + 
            '","' + row.track.artists.map(artist => artist.name).join(', ') + 
            '","' + row.track.album.name + 
            '",' + row.added_at
        ).join('\r\n')
        return ("track_name, artists, album_name, added_at \r\n" + csvTracks)
    }

    const DownloadCSV = (event) => {
        event.preventDefault()
        // Create a blob
        var blob = new Blob([TracksToCSV(tracks)], { type: 'text/csv;charset=utf-8;' })
        var url = URL.createObjectURL(blob)
        // Create a link to download it
        var pom = document.createElement('a')
        pom.href = url
        pom.setAttribute('download', `spotlist-export-${name}.csv`)
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

    // Disply copied alert
    const ShowAlert = (ref) => {
        ref.current.style.opacity = 1
        ref.current.style.display = "block"
        setTimeout(() => ref.current.style.opacity = 0, 300)
        setTimeout(() => ref.current.style.display = "none", 400)
    }

    // Copy button component
    const CopyButton = ({ element }) => 
    <General.Button onClick={() => {CopyToClipboard(element); ShowAlert(copied)}}>
        <Icon icon="bx:copy" width="20px" />
    </General.Button>


    return (
        <Styled.Tracklist>
            <General.Alert ref={copied}>Copied!</General.Alert>
                <General.Button onClick={(e) => DownloadCSV(e)} id='download'>Download tracklist as CSV</General.Button>

            <Styled.Table id="tracktable">
                <Styled.TableHead id='trackhead'>
                    <tr>
                        <th>#</th>
                        <th>Track</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Added on</th>
                    </tr>
                </Styled.TableHead>
            
                <Styled.TableBody>
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
                                                    : <span key={index}>, 
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
                </Styled.TableBody>
            </Styled.Table>
        </Styled.Tracklist>
    )
}

export default Tracklist