/**
 * Spotlist Analysis Engine
 * Processes playlist data and calculates comprehensive metrics.
 */

/**
 * Processes raw track data in a single pass to extract all necessary information.
 * This is the primary data processing function that should be called first.
 *
 * @param {Array} tracks - Array of track objects from Spotify API (playlist items format)
 * @returns {Object} Processed data containing:
 *   - trackStats: Basic track statistics (count, duration, popularity, etc.)
 *   - artistStats: Artist frequency counts and unique IDs
 *   - albumStats: Album frequency counts
 *   - chartData: Pre-processed data for visualizations
 *   - uniqueArtistIds: Array of unique artist IDs for genre fetching
 */
export const processPlaylistData = (tracks) => {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  const totalTracks = tracks.length;

  // Track-level aggregations
  let totalDurationMs = 0;
  let totalPopularity = 0;
  let explicitCount = 0;
  const durations = [];

  // Year/Decade tracking with popularity
  const yearData = new Map();
  const decadeData = new Map();

  // Artist tracking (using Map for better performance)
  const artistCounts = new Map();
  const artistIds = new Set();

  // Album tracking
  const albumCounts = new Map();

  // Scatter plot data
  const scatterData = [];

  // Single pass through all tracks
  tracks.forEach((item) => {
    const track = item.track;
    if (!track) return;

    // Track statistics
    totalDurationMs += track.duration_ms;
    totalPopularity += track.popularity;
    if (track.explicit) explicitCount++;
    durations.push(track.duration_ms);

    // Year extraction with popularity tracking
    if (track.album?.release_date) {
      const year = parseInt(track.album.release_date.substring(0, 4));
      if (!isNaN(year)) {
        const decade = Math.floor(year / 10) * 10;

        // Track year data
        const yearInfo = yearData.get(year) || { count: 0, totalPopularity: 0 };
        yearInfo.count++;
        yearInfo.totalPopularity += track.popularity;
        yearData.set(year, yearInfo);

        // Track decade data
        const decadeInfo = decadeData.get(decade) || {
          count: 0,
          totalPopularity: 0,
        };
        decadeInfo.count++;
        decadeInfo.totalPopularity += track.popularity;
        decadeData.set(decade, decadeInfo);
      }
    }

    // Artist counting (all artists, not just primary)
    if (track.artists) {
      track.artists.forEach((artist) => {
        if (artist.id) {
          artistIds.add(artist.id);
          artistCounts.set(
            artist.name,
            (artistCounts.get(artist.name) || 0) + 1
          );
        }
      });
    }

    // Album counting
    if (track.album?.name) {
      albumCounts.set(
        track.album.name,
        (albumCounts.get(track.album.name) || 0) + 1
      );
    }

    // Scatter plot data point
    scatterData.push({
      id: track.id,
      x: track.duration_ms / 60000, // Convert to minutes
      y: track.popularity,
      title: track.name,
    });
  });

  // Convert Maps to sorted arrays
  const sortedArtists = Array.from(artistCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedAlbums = Array.from(albumCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate year range
  const years = Array.from(yearData.keys());
  const minYear = years.length > 0 ? Math.min(...years) : 0;
  const maxYear = years.length > 0 ? Math.max(...years) : 0;

  return {
    trackStats: {
      totalTracks,
      totalDurationMs,
      totalPopularity,
      explicitCount,
      durations,
      minYear,
      maxYear,
    },
    artistStats: sortedArtists,
    albumStats: sortedAlbums,
    yearData,
    decadeData,
    chartData: {
      scatter: scatterData,
    },
    uniqueArtistIds: Array.from(artistIds),
    tracks,
  };
};

/**
 * Calculates comprehensive playlist analysis metrics.
 * Should be called after processPlaylistData() and genre fetching.
 *
 * @param {Object} processedData - Output from processPlaylistData()
 * @returns {Object} Complete analysis with all metrics and formatted values
 */
export const calculateAnalysis = (processedData) => {
  if (!processedData) return null;

  const { trackStats, yearData, decadeData } = processedData;
  const {
    totalTracks,
    totalDurationMs,
    totalPopularity,
    explicitCount,
    durations,
    minYear,
    maxYear,
  } = trackStats;

  // Calculate averages
  const avgPopularity = totalTracks > 0 ? totalPopularity / totalTracks : 0;
  const avgDurationMs = totalTracks > 0 ? totalDurationMs / totalTracks : 0;

  // Year range
  const yearRange = maxYear - minYear;

  // Decade & Year Distribution with average popularity
  const decades = {};
  const yearsDist = {};

  decadeData.forEach((data, decade) => {
    decades[decade] = {
      count: data.count,
      avgPopularity: Math.round(data.totalPopularity / data.count),
    };
  });

  yearData.forEach((data, year) => {
    yearsDist[year] = {
      count: data.count,
      avgPopularity: Math.round(data.totalPopularity / data.count),
    };
  });

  // Format durations
  const totalHours = Math.floor(totalDurationMs / 3600000);
  const totalMinutes = Math.floor((totalDurationMs % 3600000) / 60000);
  const totalDurationFormatted = `${totalHours}h ${totalMinutes}m`;

  const avgMin = Math.floor(avgDurationMs / 60000);
  const avgSec = Math.floor((avgDurationMs % 60000) / 1000);
  const avgDurationFormatted = `${avgMin}:${String(avgSec).padStart(2, "0")}`;

  return {
    trackCount: totalTracks,
    totalDurationFormatted,
    avgDurationFormatted,
    avgPopularity: avgPopularity.toFixed(1),
    explicitPct: ((explicitCount / totalTracks) * 100).toFixed(1),
    yearRange,
    minYear,
    maxYear,
    decades,
    yearsDist,
  };
};

/**
 * Prepares pie chart data from frequency counts.
 * Only includes items that appear more than once, groups the rest into "Others".
 *
 * @param {Array} items - Array of objects with 'name' and 'count' properties
 * @param {number} colorOffset - HSL hue offset for color generation
 * @returns {Array} Array of pie slice objects with path data and colors
 */
export const preparePieChartData = (items, colorOffset = 0) => {
  if (!items || items.length === 0) return [];

  // Filter items that appear more than once
  const multipleOccurrences = items.filter((item) => item.count > 1);
  const singleOccurrences = items.filter((item) => item.count === 1);

  // Calculate "Others" count from single occurrences
  const othersCount = singleOccurrences.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  const data = [...multipleOccurrences];
  if (othersCount > 0) {
    data.push({ name: "Others", count: othersCount });
  }

  if (data.length === 0) return [];

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  let currentAngle = 0;

  return data.map((item, i) => {
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    // Convert polar to cartesian coordinates
    const r = 50;
    const cx = 100;
    const cy = 100;
    const startX = cx + r * Math.cos((Math.PI * startAngle) / 180);
    const startY = cy + r * Math.sin((Math.PI * startAngle) / 180);
    const endX = cx + r * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const endY = cy + r * Math.sin((Math.PI * (startAngle + angle)) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

    const isOthers = i === data.length - 1 && item.name === "Others";
    const color = isOthers ? "#ddd" : `hsl(${i * 60 + colorOffset}, 70%, 50%)`;

    return {
      ...item,
      path: pathData,
      color,
    };
  });
};
