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
  Cell
} from "recharts";

import { getPlaylists, getTracks, getArtistDetails } from "../lib/spotify";
import { processPlaylistData, calculateAnalysis } from "../lib/analysis";
import styles from "../styles/DesignV2.module.css";

// Custom Tooltip for Recharts to match Brutalist Style
const BrutalistTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #000',
        padding: '5px 10px',
        fontSize: '0.7rem',
        fontFamily: "'Courier New', Courier, monospace",
        boxShadow: '4px 4px 0px #000'
      }}>
        {payload.map((p, i) => (
          <div key={i}>
            <span style={{ fontWeight: 700 }}>{p.name || p.dataKey}:</span> {p.value}
          </div>
        ))}
        {data.title && <div>{data.title}</div>}
      </div>
    );
  }
  return null;
};

const DesignV2 = () => {
  const router = useRouter();
  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState(null);
  const [timeMode, setTimeMode] = useState("DECADE");

  // --- Auth & Data Fetching (Copied from dashboard.js) ---
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
  const tracks = processedData?.tracks || [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Spotlist // V2</title>
      </Head>

      {/* --- SIDE PANEL --- */}
      <div className={styles.sidePanel}>
        <div className={styles.headerBlock}>
          Spotlist Analysis
        </div>

        {/* Playlist Selector */}
        <div className={styles.section}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              onChange={(e) => setSelectedPlaylistUrl(e.target.value)}
              value={selectedPlaylistUrl || ""}
            >
              <option value="" disabled>Select Source...</option>
              {playlists?.map((p) => (
                <option key={p.id} value={p.tracks.href}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Basic Stats */}
        {analysis && (
          <div className={styles.section}>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Total Tracks</span>
              <span className={styles.metricValue}>{analysis.trackCount}</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Duration</span>
              <span className={styles.metricValue}>{analysis.totalDurationFormatted}</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Avg Pop</span>
              <span className={styles.metricValue}>{analysis.avgPopularity}</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Explicit %</span>
              <span className={styles.metricValue}>{analysis.explicitPct}%</span>
            </div>
             <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Year Span</span>
              <span className={styles.metricValue}>{analysis.minYear}-{analysis.maxYear}</span>
            </div>
          </div>
        )}
        
        {/* Navigation / Actions */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #000' }}>
            <Link href="/" style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: '#000', fontWeight: 'bold', textTransform: 'uppercase' }}>
                ← Return Home
            </Link>
        </div>
      </div>

      {/* --- MAIN PANEL --- */}
      <div className={styles.mainPanel}>
        {isLoading ? (
          <div className={styles.loading}>Processing Data...</div>
        ) : analysis ? (
          <>
            {/* ROW 1: Timeline & Scatter */}
            <div className={`${styles.row} ${styles.bordered}`}>
                <div className={`${styles.vizSection} ${styles.bordered}`}>
                    <div className={styles.vizTitle}>
                        Timeline
                        <div style={{ fontSize: '0.75rem' }}>
                            <span 
                                style={{ cursor: 'pointer', textDecoration: timeMode === "DECADE" ? "underline" : "none", marginRight: '10px' }}
                                onClick={() => setTimeMode("DECADE")}
                            >DECADES</span>
                            <span 
                                style={{ cursor: 'pointer', textDecoration: timeMode === "YEAR" ? "underline" : "none" }}
                                onClick={() => setTimeMode("YEAR")}
                            >YEARS</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={timeChartData}>
                            <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: 'Courier New' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<BrutalistTooltip />} cursor={{ fill: '#eee' }} />
                            <Bar dataKey="value" fill="#000" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.vizSection}>
                    <div className={styles.vizTitle}>Popularity vs Length</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <XAxis type="number" dataKey="x" name="Duration" unit="m" tick={{ fontSize: 10, fontFamily: 'Courier New' }} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="y" name="Popularity" tick={{ fontSize: 10, fontFamily: 'Courier New' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<BrutalistTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter data={scatterData} fill="#000">
                                {scatterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#000" />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ROW 2: Tables (Artists & Tracks) */}
             <div className={styles.row}> 
                {/* Artists Table */}
                <div className={styles.artistSection}>
                     <div className={styles.headerBlock} style={{ position: 'sticky', top: 0, background: '#EEEEEE', zIndex: 1, borderBottom: '1px solid #000' }}>
                        Top Artists
                     </div>
                     <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table className={styles.table}>
                            <tbody>
                                {artistsStats.map((a, i) => (
                                    <tr key={i}>
                                        <td style={{ width: '20px' }}>{i + 1}</td>
                                        <td>{a.name}</td>
                                        <td style={{ textAlign: 'right' }}>{a.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>

                 {/* Genres & Tracklist */}
                 <div className={styles.tableSection}>
                    <div style={{ borderBottom: '1px solid #000' }}>
                        <div className={styles.headerBlock}>Top Genres</div>
                        <div className={styles.genreCloud}>
                            {genresStats.slice(0, 15).map((g, i) => (
                                <span key={g.name} className={styles.genreTag} style={{ opacity: i < 5 ? 1 : 0.6 }}>
                                    {i < 5 ? <strong>{g.name}</strong> : g.name}
                                    <sup style={{ marginLeft: '2px' }}>{g.count}</sup>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div className={styles.headerBlock} style={{ position: 'sticky', top: 0, background: '#EEEEEE', zIndex: 1, borderBottom: '1px solid #000' }}>
                            Full Tracklist
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th style={{ textAlign: 'right' }}>Year</th>
                                    <th style={{ textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.map((item, i) => (
                                    <tr key={item.track?.id || i}>
                                        <td style={{ width: '30px' }}>{i + 1}</td>
                                        <td>{item.track?.name}</td>
                                        <td>{item.track?.artists?.map((a) => a.name).join(", ")}</td>
                                        <td style={{ textAlign: 'right' }}>{item.track?.album?.release_date?.substring(0, 4)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {item.track
                                            ? `${Math.floor(item.track.duration_ms / 60000)}:${String(Math.floor((item.track.duration_ms % 60000) / 1000)).padStart(2, "0")}`
                                            : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </div>
          </>
        ) : (
          <div className={styles.loading}>
             Select a playlist from the sidebar to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignV2;
