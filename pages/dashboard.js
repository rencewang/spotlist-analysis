import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCookies } from 'cookies-next';
import Link from 'next/link';

import { getPlaylists, getTracks, getGenresFromArtists } from '../lib/spotify';
import { calculateAnalysis } from '../lib/analysis';

import { 
    Wrapper, Nav, Container, MainPanel, SidePanel, Header, StatRow, AiNote 
} from '../components/Dashboard/Layout';
import { 
    BarChartContainer, Bar, DenseTable, GenreCloud, GenreTag 
} from '../components/Dashboard/Visualizations';

const Dashboard = () => {
    const router = useRouter();
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistInfo, setSelectedPlaylistInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Data State
    const [tracks, setTracks] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [artistsStats, setArtistsStats] = useState([]);
    const [genresStats, setGenresStats] = useState([]);

    // Check Auth
    useEffect(() => {
        const token = getCookies('token').token;
        if (!token) {
            router.push('/');
        } else {
            fetchPlaylists();
        }
    }, [router]);

    const fetchPlaylists = async () => {
        const data = await getPlaylists();
        setPlaylists(data || []);
        // Auto-select first playlist if available
        if (data && data.length > 0) {
           handlePlaylistSelect(data[0].tracks.href, data[0]);
        }
    };

    const handlePlaylistSelect = async (url, playlistInfo) => {
        if (!url) return;
        setIsLoading(true);
        setSelectedPlaylistInfo(playlistInfo);
        
        // 1. Fetch Tracks
        const tracksData = await getTracks(url);
        setTracks(tracksData);
        
        // 2. Extract Artist IDs & Calculate Stats
        const artistsCount = {};
        const artistIds = [];
        tracksData.forEach(item => {
            if(item.track && item.track.artists) {
                item.track.artists.forEach(artist => {
                    artistsCount[artist.name] = (artistsCount[artist.name] || 0) + 1;
                    artistIds.push(artist.id);
                });
            }
        });

        // 3. Fetch Genres
        const uniqueArtistIds = [...new Set(artistIds)];
        const genreData = await getGenresFromArtists(uniqueArtistIds); // returns { Genre: Count }
        
        // 4. Sort & Set State
        const sortedArtists = Object.entries(artistsCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a,b) => b.count - a.count)
            .slice(0, 50);

        const sortedGenres = Object.entries(genreData)
            .map(([name, count]) => ({ name, count }))
            .sort((a,b) => b.count - a.count);

        setArtistsStats(sortedArtists);
        setGenresStats(sortedGenres);
        
        // 5. Run Analysis Engine
        const analysisResult = calculateAnalysis(tracksData);
        setAnalysis(analysisResult);
        
        setIsLoading(false);
    };
    
    // Helper to format decades for chart
    const decadeChartData = useMemo(() => {
        if (!analysis || !analysis.decades) return [];
        const decades = Object.keys(analysis.decades).sort();
        if (decades.length === 0) return [];
        
        const total = Object.values(analysis.decades).reduce((a,b)=>a+b, 0);
        
        return decades.map(d => ({
            label: `${d}s`,
            value: analysis.decades[d],
            pct: (analysis.decades[d] / total) * 100
        }));
    }, [analysis]);

    // AI Roast Logic (Simple Rule Based)
    const getRoast = () => {
        if(!analysis) return "Analyzing...";
        if (analysis.hipsterIndex > 80) return "AI DIAGNOSIS: Terminal Uniqueness Syndrome. You listen to music that doesn't exist yet.";
        if (analysis.hipsterIndex < 30) return "AI DIAGNOSIS: Top 40 Consumer. You are keeping the music industry alive single-handedly.";
        if (analysis.attentionLabel === 'TIKTOK') return "AI DIAGNOSIS: Dopamine Fried. Your attention span is shorter than a vine.";
        if (analysis.vibe === 'MELANCHOLY') return "AI DIAGNOSIS: Are you okay? This playlist constitutes a cry for help.";
        return "AI DIAGNOSIS: Statistically average. The worst kind of insult.";
    };

    return (
        <Wrapper>
            <Head>
                <title>Dashboard // Know Your Playlist</title>
            </Head>
            <Nav>
                <Link href="/">
                    <a>HOME</a>
                </Link>
                <span className="active">DASHBOARD</span>
                <Link href="/api/logout">
                     <span style={{ marginTop: 'auto', marginBottom: '1rem', color: '#ff3b30', opacity: 1 }}>LOG OUT</span>
                </Link>
            </Nav>

            <Container>
                {/* 1. LEFT PANEL: SUMMARY */}
                <SidePanel>
                    <h2>Analysis_Metrics</h2>
                    {analysis ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <StatRow><span className="label">TRACKS</span><span className="val">{analysis.trackCount}</span></StatRow>
                            <StatRow><span className="label">TOTAL DURATION</span><span className="val">{analysis.durationFormatted}</span></StatRow>
                            <StatRow><span className="label">AVERAGE POPULARITY</span><span className="val">{analysis.avgPopularity}</span></StatRow>
                            <StatRow><span className="label">EXPLICIT</span><span className="val">{analysis.explicitPct}%</span></StatRow>
                            
                            <div style={{ height: '20px' }} />
                            
                            <StatRow><span className="label">HIPSTER INDEX</span><span className="val">{analysis.hipsterIndex}</span></StatRow>
                            <StatRow><span className="label">DIVERSITY</span><span className="val">{analysis.diversityLabel}</span></StatRow>
                            <StatRow><span className="label">ATTENTION</span><span className="val">{analysis.attentionLabel}</span></StatRow>
                            <StatRow><span className="label">VIBE</span><span className="val">{analysis.vibe}</span></StatRow>
                            <StatRow><span className="label">RANGE</span><span className="val">{analysis.yearRange} yr</span></StatRow>
                            
                            <AiNote>
                                {getRoast()}
                            </AiNote>
                        </div>
                    ) : (
                        <div>Select a playlist...</div>
                    )}
                </SidePanel>

                {/* 2. MAIN PANEL: CONTENT */}
                <MainPanel>
                    <Header>
                        <h1>{selectedPlaylistInfo ? selectedPlaylistInfo.name : 'Select Playlist'}</h1>
                        {analysis && <div className="meta">ID: {selectedPlaylistInfo.id} • {analysis.trackCount} TRACKS</div>}
                        
                        <select 
                            onChange={(e) => {
                                const playlist = playlists.find(p => p.tracks.href === e.target.value);
                                handlePlaylistSelect(e.target.value, playlist);
                            }}
                            value={selectedPlaylistInfo ? selectedPlaylistInfo.tracks.href : ''}
                        >
                            <option value="" disabled>Change Source...</option>
                            {playlists.map(p => (
                                <option key={p.id} value={p.tracks.href}>
                                    {p.name} ({p.tracks.total})
                                </option>
                            ))}
                        </select>
                    </Header>

                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Menlo, monospace' }}>
                            FETCHING_DATA... [{Math.random().toFixed(4)}]
                        </div>
                    ) : analysis ? (
                        <>
                            <h2>Decade Distribution</h2>
                            <BarChartContainer>
                                {decadeChartData.map((d) => (
                                    <Bar 
                                        key={d.label} 
                                        style={{ height: `${d.pct}%` }} 
                                        data-label={`${d.label}: ${d.value}`}
                                    />
                                ))}
                            </BarChartContainer>

                            <h2>Tracklist Log</h2>
                            <DenseTable>
                                <thead>
                                    <tr>
                                        <th style={{width: '30px'}}>#</th>
                                        <th>TITLE</th>
                                        <th>ARTIST</th>
                                        <th style={{textAlign: 'right'}}>POP</th>
                                        <th style={{textAlign: 'right'}}>YEAR</th>
                                        <th style={{textAlign: 'right'}}>TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map((item, i) => (
                                        <tr key={item.track?.id || i}>
                                            <td>{i+1}</td>
                                            <td>{item.track?.name}</td>
                                            <td>{item.track?.artists?.map(a=>a.name).join(', ')}</td>
                                            <td style={{textAlign: 'right'}}>{item.track?.popularity}</td>
                                            <td style={{textAlign: 'right'}}>
                                                {item.track?.album?.release_date?.substring(0,4)}
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                                {item.track ? 
                                                    `${Math.floor(item.track.duration_ms/60000)}:${String(Math.floor((item.track.duration_ms%60000)/1000)).padStart(2,'0')}` 
                                                : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DenseTable>
                        </>
                    ) : null}
                </MainPanel>

                {/* 3. RIGHT PANEL: ARTISTS */}
                <SidePanel>
                     <h2>Top Artists</h2>
                     <DenseTable>
                        <tbody>
                            {artistsStats.map((a, i) => (
                                <tr key={a.name}>
                                     <td style={{width: '20px'}}>{i+1}</td>
                                     <td>{a.name}</td>
                                     <td style={{textAlign: 'right'}}>{a.count}</td>
                                </tr>
                            ))}
                        </tbody>
                     </DenseTable>

                     <div style={{ height: '2rem' }} />

                     <h2>Genre Cloud</h2>
                     <GenreCloud>
                        {genresStats.slice(0, 30).map((g, i) => (
                            <GenreTag 
                                key={g.name}
                                className={i < 3 ? 'high' : i < 10 ? 'med' : 'low'}
                            >
                                {g.name.toUpperCase()}
                            </GenreTag>
                        ))}
                     </GenreCloud>
                </SidePanel>
            </Container>
        </Wrapper>
    );
};

export default Dashboard;
