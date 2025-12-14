import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCookies } from "cookies-next";
import Link from "next/link";

import { getPlaylists, getTracks, getArtistDetails } from "../lib/spotify";
import {
  processPlaylistData,
  calculateAnalysis,
} from "../lib/analysis";

import {
  Wrapper,
  Nav,
  Container,
  MainPanel,
  SidePanel,
  Header,
  StatRow,
  Toggle,
} from "../components/Dashboard/Layout";
import {
  DenseTable,
  GenreCloud,
  GenreTag,
} from "../components/Dashboard/Visualizations";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const router = useRouter();
  // Playlist state
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistInfo, setSelectedPlaylistInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // View state
  const [timeMode, setTimeMode] = useState("DECADE"); // 'DECADE' or 'YEAR'

  // Processed data state
  const [processedData, setProcessedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [genresStats, setGenresStats] = useState([]);

  // Check Auth
  useEffect(() => {
    const token = getCookies("token").token;
    if (!token) {
      router.push("/");
    } else {
      fetchPlaylists();
    }
  }, [router]);

  /**
   * Fetches user's playlists and auto-selects the first one.
   */
  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylists(data || []);
    if (data && data.length > 0) {
      handlePlaylistSelect(data[0].tracks.href, data[0]);
    }
  };

  /**
   * Handles playlist selection and orchestrates data fetching/processing.
   *
   * @param {string} url - Tracks endpoint URL
   * @param {Object} playlistInfo - Playlist metadata
   */
  const handlePlaylistSelect = async (url, playlistInfo) => {
    if (!url) return;

    setIsLoading(true);
    setSelectedPlaylistInfo(playlistInfo);

    try {
      // Step 1: Fetch tracks
      const tracksData = await getTracks(url);

      // Step 2: Process all track data in one pass
      const processed = processPlaylistData(tracksData);

      if (!processed) {
        setIsLoading(false);
        return;
      }

      // Step 3: Fetch artist details and genres (sorted)
      const { genreStats } = await getArtistDetails(processed.uniqueArtistIds);

      // Step 4: Calculate final analysis
      const analysisResult = calculateAnalysis(processed);

      // Update state
      setProcessedData(processed);
      setGenresStats(genreStats);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error processing playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart Logic: Time Distribution
  const timeChartData = useMemo(() => {
    if (!analysis) return [];
    const source =
      timeMode === "DECADE" ? analysis.decades : analysis.yearsDist;
    if (!source) return [];

    const keys = Object.keys(source).sort();
    if (keys.length === 0) return [];
    const total = Object.values(source).reduce((a, b) => a + b.count, 0);

    return keys.map((d) => ({
      label: timeMode === "DECADE" ? `${d}s` : d,
      value: source[d].count,
      avgPopularity: source[d].avgPopularity,
      pct: (source[d].count / total) * 100,
    }));
  }, [analysis, timeMode]);

  // Extract chart data from processed data
  const scatterData = processedData?.chartData?.scatter || [];
  const artistsStats = processedData?.artistStats || [];
  const albumStats = processedData?.albumStats || [];
  const tracks = processedData?.tracks || [];

  // Expandable list state
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);

  // Genre bar chart data (top 10)
  const genreBarData = useMemo(() => {
    return genresStats.slice(0, 10).map(g => ({
      name: g.name,
      count: g.count,
    }));
  }, [genresStats]);

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
          <span
            style={{
              marginTop: "auto",
              marginBottom: "1rem",
              color: "#ff3b30",
              opacity: 1,
            }}
          >
            LOG OUT
          </span>
        </Link>
      </Nav>

      <Container>
        {/* 1. LEFT PANEL (NARROW) */}
        <SidePanel>
          <Header>
            <select
              onChange={(e) => {
                const playlist = playlists.find(
                  (p) => p.tracks.href === e.target.value
                );
                handlePlaylistSelect(e.target.value, playlist);
              }}
              value={
                selectedPlaylistInfo ? selectedPlaylistInfo.tracks.href : ""
              }
            >
              <option value="" disabled>
                Change Source...
              </option>
              {playlists.map((p) => (
                <option key={p.id} value={p.tracks.href}>
                  {p.name} ({p.tracks.total})
                </option>
              ))}
            </select>
          </Header>

          {analysis ? (
            <>
              <StatRow>
                <span className="label">Tracks</span>
                <span className="val">{analysis.trackCount}</span>
              </StatRow>
              <StatRow>
                <span className="label">Duration</span>
                <span className="val">{analysis.totalDurationFormatted}</span>
              </StatRow>
              <StatRow>
                <span className="label">Average Duration</span>
                <span className="val">{analysis.avgDurationFormatted}</span>
              </StatRow>
              <StatRow>
                <span className="label">Average Popularity</span>
                <span className="val">{analysis.avgPopularity}</span>
              </StatRow>
              <StatRow>
                <span className="label">Explicitness</span>
                <span className="val">{analysis.explicitPct}</span>
              </StatRow>
              <StatRow>
                <span className="label">Year Span</span>
                <span className="val">{analysis.yearRange} yr</span>
              </StatRow>

              <div style={{ height: "2rem" }} />

              <h2>
                Timeline
                <div>
                  <Toggle
                    className={timeMode === "DECADE" ? "active" : ""}
                    onClick={() => setTimeMode("DECADE")}
                  >
                    DEC
                  </Toggle>
                  <Toggle
                    className={timeMode === "YEAR" ? "active" : ""}
                    onClick={() => setTimeMode("YEAR")}
                  >
                    YR
                  </Toggle>
                </div>
              </h2>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={timeChartData}>
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fontFamily: 'Menlo, monospace' }}
                    stroke="#000"
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: '#000',
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontFamily: 'Menlo, monospace',
                            border: '2px solid #000',
                          }}
                        >
                          {data.label}: {data.value} tracks<br />
                          Avg Pop: {data.avgPopularity}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" fill="#000" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>

              <h2>Top Artists</h2>
              <DenseTable>
                <tbody>
                  {artistsStats.slice(0, showAllArtists ? 10 : 5).map((a, i) => (
                    <tr key={i}>
                      <td style={{ width: "20px" }}>{i + 1}</td>
                      <td>{a.name}</td>
                      <td style={{ textAlign: "right" }}>{a.count}</td>
                    </tr>
                  ))}
                </tbody>
              </DenseTable>
              {artistsStats.length > 5 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', cursor: 'pointer', opacity: 0.7 }} onClick={() => setShowAllArtists(!showAllArtists)}>
                  {showAllArtists ? '▲ Show Less' : '▼ Show More'}
                </div>
              )}

              <div style={{ height: "1rem" }} />

              <h2>Top Albums</h2>
              <DenseTable>
                <tbody>
                  {albumStats.slice(0, showAllAlbums ? 10 : 5).map((a, i) => (
                    <tr key={i}>
                      <td style={{ width: "20px" }}>{i + 1}</td>
                      <td>{a.name}</td>
                      <td style={{ textAlign: "right" }}>{a.count}</td>
                    </tr>
                  ))}
                </tbody>
              </DenseTable>
              {albumStats.length > 5 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', cursor: 'pointer', opacity: 0.7 }} onClick={() => setShowAllAlbums(!showAllAlbums)}>
                  {showAllAlbums ? '▲ Show Less' : '▼ Show More'}
                </div>
              )}

              <h2>Top Genres</h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={genreBarData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 9, fontFamily: 'Menlo, monospace' }}
                    stroke="#000"
                    width={80}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: '#000',
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontFamily: 'Menlo, monospace',
                            border: '2px solid #000',
                          }}
                        >
                          {data.name}: {data.count}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" fill="#000" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ height: "1rem" }} />

              <h2>Genre Cloud</h2>
              <GenreCloud>
                {genresStats.slice(0, 20).map((g, i) => (
                  <GenreTag key={g.name} className={i < 3 ? "high" : "low"}>
                    {g.name} ({g.count})
                  </GenreTag>
                ))}
              </GenreCloud>
            </>
          ) : (
            <div style={{ padding: "1rem" }}>Select a playlist...</div>
          )}
        </SidePanel>

        {/* 2. MAIN PANEL (WIDE) */}
        <MainPanel>
          {isLoading ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                fontFamily: "Menlo, monospace",
              }}
            >
              FETCHING_DATA...
            </div>
          ) : analysis ? (
            <>
              <h2>Popularity vs Duration (Min)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Duration"
                    unit="m"
                    tick={{ fontSize: 10, fontFamily: 'Menlo, monospace' }}
                    stroke="#000"
                    label={{
                      value: 'Duration (min)',
                      position: 'bottom',
                      style: { fontSize: 10, fontFamily: 'Menlo, monospace' },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Popularity"
                    tick={{ fontSize: 10, fontFamily: 'Menlo, monospace' }}
                    stroke="#000"
                    label={{
                      value: 'Popularity',
                      angle: -90,
                      position: 'left',
                      style: { fontSize: 10, fontFamily: 'Menlo, monospace' },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: '#000',
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontFamily: 'Menlo, monospace',
                            border: '2px solid #000',
                          }}
                        >
                          {data.title}<br />
                          Pop: {data.y} | Dur: {data.x.toFixed(2)}m
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} fill="#000" isAnimationActive={false} />
                </ScatterChart>
              </ResponsiveContainer>

              <h2>Tracklist Log</h2>
              <DenseTable>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>#</th>
                    <th>TITLE</th>
                    <th>ARTIST</th>
                    <th style={{ textAlign: "right" }}>POP</th>
                    <th style={{ textAlign: "right" }}>YEAR</th>
                    <th style={{ textAlign: "right" }}>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((item, i) => (
                    <tr key={item.track?.id || i}>
                      <td>{i + 1}</td>
                      <td>{item.track?.name}</td>
                      <td>{item.track?.artists?.map(a => a.name).join(", ")}</td>
                      <td style={{ textAlign: "right" }}>{item.track?.popularity}</td>
                      <td style={{ textAlign: "right" }}>
                        {item.track?.album?.release_date?.substring(0, 4)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {item.track
                          ? `${Math.floor(item.track.duration_ms / 60000)}:${String(
                              Math.floor((item.track.duration_ms % 60000) / 1000)
                            ).padStart(2, "0")}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DenseTable>
            </>
          ) : (
            <div style={{ padding: "2rem" }}>
              Select a playlist to begin analysis.
            </div>
          )}
        </MainPanel>
      </Container>
    </Wrapper>
  );
};

export default Dashboard;
