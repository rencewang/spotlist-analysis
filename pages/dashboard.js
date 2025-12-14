import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCookies } from "cookies-next";
import Link from "next/link";
import useSWR from "swr";
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

import { getPlaylists, getTracks, getArtistDetails } from "../lib/spotify";
import { processPlaylistData, calculateAnalysis } from "../lib/analysis";
import { chartStyles } from "../styles/recharts";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const router = useRouter();
  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState(null);
  const [timeMode, setTimeMode] = useState("DECADE");

  const token = getCookies("token").token;
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const { data: playlists } = useSWR(token ? "playlists" : null, getPlaylists);

  useEffect(() => {
    if (playlists?.length > 0 && !selectedPlaylistUrl) {
      setSelectedPlaylistUrl(playlists[0].tracks.href);
    }
  }, [playlists, selectedPlaylistUrl]);

  const selectedPlaylistInfo = playlists?.find(
    (p) => p.tracks.href === selectedPlaylistUrl
  );

  const { data: tracksData, isLoading: tracksLoading } = useSWR(
    selectedPlaylistUrl ? ["tracks", selectedPlaylistUrl] : null,
    ([, url]) => getTracks(url)
  );

  const processedData = useMemo(() => {
    if (!tracksData) return null;
    return processPlaylistData(tracksData);
  }, [tracksData]);

  const artistIds = processedData?.uniqueArtistIds;
  const { data: artistData } = useSWR(
    artistIds?.length > 0 ? ["artists", artistIds] : null,
    ([, ids]) => getArtistDetails(ids)
  );

  const genresStats = artistData?.genreStats || [];

  const analysis = useMemo(() => {
    if (!processedData) return null;
    return calculateAnalysis(processedData);
  }, [processedData]);

  const isLoading = tracksLoading;

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

  const scatterData = processedData?.chartData?.scatter || [];
  const artistsStats = processedData?.artistStats || [];
  const albumStats = processedData?.albumStats || [];
  const tracks = processedData?.tracks || [];

  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);

  const genreBarData = useMemo(() => {
    return genresStats.slice(0, 10).map((g) => ({
      name: g.name,
      count: g.count,
    }));
  }, [genresStats]);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Dashboard // Know Your Playlist</title>
      </Head>
      <nav className={styles.nav}>
        <Link href="/">HOME</Link>
        <span className={styles.active}>DASHBOARD</span>
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
      </nav>

      <div className={styles.container}>
        <div className={styles.sidePanel}>
          <div className={styles.header}>
            <select
              onChange={(e) => setSelectedPlaylistUrl(e.target.value)}
              value={selectedPlaylistUrl || ""}
            >
              <option value="" disabled>
                Change Source...
              </option>
              {playlists?.map((p) => (
                <option key={p.id} value={p.tracks.href}>
                  {p.name} ({p.tracks.total})
                </option>
              ))}
            </select>
          </div>

          {analysis ? (
            <>
              <div className={styles.statRow}>
                <span className={styles.label}>Tracks</span>
                <span className={styles.val}>{analysis.trackCount}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Duration</span>
                <span className={styles.val}>{analysis.totalDurationFormatted}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Average Duration</span>
                <span className={styles.val}>{analysis.avgDurationFormatted}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Average Popularity</span>
                <span className={styles.val}>{analysis.avgPopularity}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Explicitness</span>
                <span className={styles.val}>{analysis.explicitPct}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Year Span</span>
                <span className={styles.val}>{analysis.yearRange} yr</span>
              </div>

              <div style={{ height: "2rem" }} />

              <h2>
                Timeline
                <div>
                  <button
                    className={`${styles.toggle} ${timeMode === "DECADE" ? styles.active : ""}`}
                    onClick={() => setTimeMode("DECADE")}
                  >
                    DEC
                  </button>
                  <button
                    className={`${styles.toggle} ${timeMode === "YEAR" ? styles.active : ""}`}
                    onClick={() => setTimeMode("YEAR")}
                  >
                    YR
                  </button>
                </div>
              </h2>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={timeChartData}>
                  <XAxis dataKey="label" tick={chartStyles.axis.tick} stroke={chartStyles.axis.stroke} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.label}: {data.value} tracks<br />
                          Avg Pop: {data.avgPopularity}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" {...chartStyles.bar} />
                </BarChart>
              </ResponsiveContainer>

              <h2>Top Artists</h2>
              <table className={styles.denseTable}>
                <tbody>
                  {artistsStats
                    .slice(0, showAllArtists ? 10 : 5)
                    .map((a, i) => (
                      <tr key={i}>
                        <td style={{ width: "20px" }}>{i + 1}</td>
                        <td>{a.name}</td>
                        <td style={{ textAlign: "right" }}>{a.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {artistsStats.length > 5 && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onClick={() => setShowAllArtists(!showAllArtists)}
                >
                  {showAllArtists ? "▲ Show Less" : "▼ Show More"}
                </div>
              )}

              <div style={{ height: "1rem" }} />

              <h2>Top Albums</h2>
              <table className={styles.denseTable}>
                <tbody>
                  {albumStats.slice(0, showAllAlbums ? 10 : 5).map((a, i) => (
                    <tr key={i}>
                      <td style={{ width: "20px" }}>{i + 1}</td>
                      <td>{a.name}</td>
                      <td style={{ textAlign: "right" }}>{a.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {albumStats.length > 5 && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onClick={() => setShowAllAlbums(!showAllAlbums)}
                >
                  {showAllAlbums ? "▲ Show Less" : "▼ Show More"}
                </div>
              )}

              <h2>Top Genres</h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={genreBarData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 9, fontFamily: chartStyles.fontFamily }}
                    stroke={chartStyles.stroke}
                    width={80}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.name}: {data.count}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" {...chartStyles.bar} />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ height: "1rem" }} />

              <h2>Genre Cloud</h2>
              <div className={styles.genreCloud}>
                {genresStats.slice(0, 20).map((g, i) => (
                  <span key={g.name} className={`${styles.genreTag} ${i < 3 ? styles.high : ""}`}>
                    {g.name} ({g.count})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "1rem" }}>Select a playlist...</div>
          )}
        </div>

        <div className={styles.mainPanel}>
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
                <ScatterChart margin={chartStyles.margin}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Duration"
                    unit="m"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Duration (min)",
                      position: "bottom",
                      style: { fontSize: chartStyles.fontSize, fontFamily: chartStyles.fontFamily },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Popularity"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Popularity",
                      angle: -90,
                      position: "left",
                      style: { fontSize: chartStyles.fontSize, fontFamily: chartStyles.fontFamily },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.title}<br />
                          Pop: {data.y} | Dur: {data.x.toFixed(2)}m
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} {...chartStyles.scatter} />
                </ScatterChart>
              </ResponsiveContainer>

              <h2>Tracklist Log</h2>
              <table className={styles.denseTable}>
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
                      <td>
                        {item.track?.artists?.map((a) => a.name).join(", ")}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {item.track?.popularity}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {item.track?.album?.release_date?.substring(0, 4)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {item.track
                          ? `${Math.floor(
                              item.track.duration_ms / 60000
                            )}:${String(
                              Math.floor(
                                (item.track.duration_ms % 60000) / 1000
                              )
                            ).padStart(2, "0")}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ padding: "2rem" }}>
              Select a playlist to begin analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
