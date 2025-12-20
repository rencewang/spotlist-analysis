import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCookies } from "cookies-next";
import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

import { getPlaylists, getTracks, getArtistDetails } from "../lib/spotify";
import { processPlaylistData, calculateAnalysis } from "../lib/analysis";
import { chartStyles } from "../styles/recharts";
import styles from "../styles/DashboardV2.module.css";

const DashboardV2 = () => {
  const router = useRouter();
  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState(null);

  const token = getCookies("token").token;
  useEffect(() => {
    if (!token) router.push("/");
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

  const { data: tracksData, isLoading } = useSWR(
    selectedPlaylistUrl ? ["tracks", selectedPlaylistUrl] : null,
    ([, url]) => getTracks(url)
  );

  const processedData = useMemo(() => {
    if (!tracksData) return null;
    return processPlaylistData(tracksData);
  }, [tracksData]);

  const artistIds = processedData?.uniqueArtistIds;
  const artistCounts = useMemo(() => {
    return (
      processedData?.artistStats?.reduce((acc, a) => {
        acc[a.name] = a.count;
        return acc;
      }, {}) || {}
    );
  }, [processedData]);

  const { data: artistData } = useSWR(
    artistIds?.length > 0 ? ["artists", artistIds] : null,
    ([, ids]) => getArtistDetails(ids, artistCounts)
  );

  const genresStats = artistData?.genreStats || [];
  const artistScatterData = artistData?.artistScatterData || [];

  const analysis = useMemo(() => {
    if (!processedData) return null;
    return calculateAnalysis(processedData);
  }, [processedData]);

  const yearChartData = useMemo(() => {
    if (!analysis) return [];
    const keys = Object.keys(analysis.yearsDist).sort();
    return keys.map((year) => ({
      year,
      count: analysis.yearsDist[year].count,
    }));
  }, [analysis]);

  const decadeChartData = useMemo(() => {
    if (!analysis) return [];
    const keys = Object.keys(analysis.decades).sort();
    return keys.map((decade) => ({
      decade: `${decade}s`,
      count: analysis.decades[decade].count,
    }));
  }, [analysis]);

  const scatterData = processedData?.chartData?.scatter || [];
  const artistsStats = processedData?.artistStats || [];
  const albumStats = processedData?.albumStats || [];
  const tracks = processedData?.tracks || [];

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Select a playlist
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Anatomy of {selectedPlaylistInfo?.name || "Playlist"}</title>
      </Head>

      {/* Row 1: Header */}
      <div className={styles.header}>
        <select
          value={selectedPlaylistUrl || ""}
          onChange={(e) => setSelectedPlaylistUrl(e.target.value)}
        >
          {playlists?.map((p) => (
            <option key={p.id} value={p.tracks.href}>
              Anatomy of {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Metadata */}
      <div className={styles.metadataRow}>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Creator</span>
          <span className={styles.value}>
            {selectedPlaylistInfo?.owner?.display_name || "Unknown"}
          </span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Tracks</span>
          <span className={styles.value}>{analysis.trackCount}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>
            {analysis.totalDurationFormatted}
          </span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Avg Duration</span>
          <span className={styles.value}>{analysis.avgDurationFormatted}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Avg Popularity</span>
          <span className={styles.value}>{analysis.avgPopularity}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Explicit</span>
          <span className={styles.value}>{analysis.explicitPct}%</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.label}>Year Span</span>
          <span className={styles.value}>{analysis.yearRange}yr</span>
        </div>
      </div>

      {/* Row 3: Main Content - 3 Columns (OLD - HIDDEN) */}
      <div className={styles.mainContent} style={{ display: "none" }}>
        {/* Column 1: Years Bar Chart + Decades */}
        <div className={styles.column}>
          {selectedPlaylistInfo?.images?.[0]?.url && (
            <div className={styles.card}>
              <h2>Playlist Cover</h2>
              <div style={{ padding: "0.5rem" }}>
                <img
                  src={selectedPlaylistInfo.images[0].url}
                  alt={selectedPlaylistInfo.name}
                  className={styles.playlistImage}
                />
              </div>
            </div>
          )}

          <div className={styles.card}>
            <h2>Timeline by Year</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={yearChartData}>
                <XAxis
                  dataKey="year"
                  tick={chartStyles.axis.tick}
                  stroke={chartStyles.axis.stroke}
                />
                <YAxis hide />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div style={chartStyles.tooltip}>
                        {data.year}: {data.count} tracks
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" {...chartStyles.bar} />
              </BarChart>
            </ResponsiveContainer>

            <h2>Timeline by Decade</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={decadeChartData}>
                <XAxis
                  dataKey="decade"
                  tick={chartStyles.axis.tick}
                  stroke={chartStyles.axis.stroke}
                />
                <YAxis hide />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div style={chartStyles.tooltip}>
                        {data.decade}: {data.count} tracks
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" {...chartStyles.bar} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Scatter Plot + Genres (2 columns) */}
        <div className={styles.column}>
          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Duration vs Popularity</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={chartStyles.margin}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Duration (min)",
                      position: "bottom",
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Popularity",
                      angle: -90,
                      position: "left",
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.title}
                          <br />
                          Pop: {data.y} | Dur: {data.x.toFixed(2)}m
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} {...chartStyles.scatter} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.genreGrid}>
            <div className={styles.card}>
              <h2>Top Albums</h2>
              <ul className={styles.artistList}>
                {albumStats.slice(0, 6).map((album, i) => (
                  <li key={i}>
                    <span className={styles.name} title={album.name}>
                      {i + 1}. {album.name}
                    </span>
                    <span className={styles.count}>{album.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h2>Top Artist Genres</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={genresStats.slice(0, 10)} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 8, fontFamily: chartStyles.fontFamily }}
                    stroke={chartStyles.stroke}
                    width={60}
                  />
                  <Bar dataKey="count" {...chartStyles.bar} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3: Playlist Image + Top Artists + Top Albums */}
        <div className={styles.column}>
          <div className={styles.card}>
            <h2>Top Artists</h2>
            <ul className={styles.artistList}>
              {artistsStats.slice(0, 10).map((artist, i) => (
                <li key={i}>
                  <span className={styles.name} title={artist.name}>
                    {i + 1}. {artist.name}
                  </span>
                  <span className={styles.count}>{artist.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Artist Followers vs Popularity</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={chartStyles.margin}>
                  <XAxis
                    type="number"
                    dataKey="followers"
                    scale="log"
                    domain={["auto", "auto"]}
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Followers (log)",
                      position: "bottom",
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="popularity"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Popularity",
                      angle: -90,
                      position: "left",
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.name}
                          <br />
                          Followers: {data.followers.toLocaleString()}
                          <br />
                          Popularity: {data.popularity}
                          <br />
                          Tracks: {data.trackCount}
                        </div>
                      );
                    }}
                  />
                  <Scatter data={artistScatterData} {...chartStyles.scatter} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Main Content - 5 Columns (NEW) */}
      <div className={styles.mainContentNew}>
        {/* Column 1: Playlist Image Only */}
        <div className={styles.columnNew}>
          {selectedPlaylistInfo?.images?.[0]?.url && (
            <div className={styles.card} style={{ height: "100%" }}>
              <h2>Playlist Cover</h2>
              <div
                style={{
                  padding: "0.5rem",
                  width: "100%",
                }}
              >
                <img
                  src={selectedPlaylistInfo.images[0].url}
                  alt={selectedPlaylistInfo.name}
                  className={styles.playlistImage}
                />
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Popularity vs Duration Scatter (swapped axes) */}
        <div className={styles.columnNew}>
          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Popularity vs Duration</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={chartStyles.margin}>
                  <XAxis
                    type="number"
                    dataKey="y"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Popularity",
                      position: "bottom",
                      offset: 5,
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="x"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Duration (min)",
                      angle: -90,
                      position: "left",
                      offset: 10,
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.title}
                          <br />
                          Pop: {data.y} | Dur: {data.x.toFixed(2)}m
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} {...chartStyles.scatter} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3: Timeline by Year + Top Albums */}
        <div className={styles.columnNew}>
          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Timeline by Year</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearChartData}>
                  <XAxis
                    dataKey="year"
                    tick={{
                      ...chartStyles.axis.tick,
                      angle: -45,
                      textAnchor: "end",
                    }}
                    height={60}
                    stroke={chartStyles.axis.stroke}
                  />
                  <YAxis hide />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.year}: {data.count} tracks
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" {...chartStyles.bar} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.card}>
            <h2>Top Albums</h2>
            <ul className={styles.artistList}>
              {albumStats.slice(0, 10).map((album, i) => (
                <li key={i}>
                  <span className={styles.name} title={album.name}>
                    {i + 1}. {album.name}
                  </span>
                  <span className={styles.count}>{album.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 4: Top Artist Genres + Top Artists */}
        <div className={styles.columnNew}>
          <div className={styles.card}>
            <h2>Top Artists</h2>
            <ul className={styles.artistList}>
              {artistsStats.slice(0, 10).map((artist, i) => (
                <li key={i}>
                  <span className={styles.name} title={artist.name}>
                    {i + 1}. {artist.name}
                  </span>
                  <span className={styles.count}>{artist.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Top Artist Genres</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genresStats.slice(0, 10)} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 8, fontFamily: chartStyles.fontFamily }}
                    stroke={chartStyles.stroke}
                    width={60}
                  />
                  <Bar dataKey="count" {...chartStyles.bar} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 5: Artist Followers vs Popularity (swapped axes) */}
        <div className={styles.columnNew}>
          <div
            className={styles.card}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2>Artist Followers vs Popularity</h2>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={chartStyles.margin}>
                  <XAxis
                    type="number"
                    dataKey="popularity"
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Popularity",
                      position: "bottom",
                      offset: 5,
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="followers"
                    scale="log"
                    domain={["auto", "auto"]}
                    tick={chartStyles.axis.tick}
                    stroke={chartStyles.axis.stroke}
                    label={{
                      value: "Followers (log)",
                      angle: -90,
                      position: "left",
                      offset: 10,
                      style: {
                        fontSize: 10,
                        fontFamily: chartStyles.fontFamily,
                      },
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div style={chartStyles.tooltip}>
                          {data.name}
                          <br />
                          Followers: {data.followers.toLocaleString()}
                          <br />
                          Popularity: {data.popularity}
                          <br />
                          Tracks: {data.trackCount}
                        </div>
                      );
                    }}
                  />
                  <Scatter data={artistScatterData} {...chartStyles.scatter} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Full Tracklist */}
      <div className={styles.tracklistRow}>
        <div className={styles.tracklist}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th style={{ textAlign: "right" }}>Pop</th>
                <th style={{ textAlign: "right" }}>Year</th>
                <th style={{ textAlign: "right" }}>Duration</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((item, i) => (
                <tr key={item.track?.id || i}>
                  <td>{i + 1}</td>
                  <td title={item.track?.name}>{item.track?.name}</td>
                  <td
                    title={item.track?.artists?.map((a) => a.name).join(", ")}
                  >
                    {item.track?.artists?.map((a) => a.name).join(", ")}
                  </td>
                  <td title={item.track?.album?.name}>
                    {item.track?.album?.name}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {item.track?.popularity}
                  </td>
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
                  <td>
                    {item.added_at
                      ? new Date(item.added_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;
