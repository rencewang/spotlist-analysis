/**
 * Spotlist Analysis Engine
 * Calculates metadata-based metrics for playlists.
 */

export const calculateAnalysis = (tracks, artists, genres) => {
    if (!tracks || tracks.length === 0) return null;

    const totalTracks = tracks.length;
    let totalDurationMs = 0;
    let totalPopularity = 0;
    let explicitCount = 0;
    let years = [];
    let durations = [];

    tracks.forEach(t => {
        const track = t.track;
        if (!track) return;

        totalDurationMs += track.duration_ms;
        totalPopularity += track.popularity;
        if (track.explicit) explicitCount++;
        
        if (track.album && track.album.release_date) {
             years.push(parseInt(track.album.release_date.substring(0, 4)));
        }
        durations.push(track.duration_ms);
    });

    const avgPopularity = totalTracks > 0 ? (totalPopularity / totalTracks) : 0;
    const avgDuration = totalTracks > 0 ? (totalDurationMs / totalTracks) : 0;
    
    // 1. Hipster Index (Inverse Popularity)
    const hipsterIndex = Math.round(100 - avgPopularity);

    // 2. Diversity Score (Unique Artists / Total Tracks)
    const uniqueArtists = new Set(tracks.map(t => t.track?.artists[0]?.id).filter(Boolean)).size;
    const diversityScoreRaw = (uniqueArtists / totalTracks) * 100;
    let diversityLabel = 'LOW';
    if (diversityScoreRaw > 80) diversityLabel = 'HIGH';
    else if (diversityScoreRaw > 50) diversityLabel = 'MED';

    // 3. Time Traveler (Year Range)
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = maxYear - minYear;

    // 4. Decade Distribution
    const decades = {};
    years.forEach(y => {
        const decade = Math.floor(y / 10) * 10;
        decades[decade] = (decades[decade] || 0) + 1;
    });

    // 5. Attention Span
    const shortTracks = durations.filter(d => d < 150000).length; // < 2:30
    const longTracks = durations.filter(d => d > 300000).length; // > 5:00
    let attentionLabel = 'NORMAL';
    if (shortTracks / totalTracks > 0.5) attentionLabel = 'TIKTOK';
    if (longTracks / totalTracks > 0.3) attentionLabel = 'CLASSICAL';

    // Formatting Duration
    const hours = Math.floor(totalDurationMs / 3600000);
    const minutes = Math.floor((totalDurationMs % 3600000) / 60000);
    const durationFormatted = `${hours}h ${minutes}m`;

    return {
        trackCount: totalTracks,
        durationFormatted,
        avgPopularity: avgPopularity.toFixed(1),
        explicitPct: ((explicitCount / totalTracks) * 100).toFixed(1),
        hipsterIndex,
        diversityLabel,
        diversityScoreRaw,
        yearRange,
        minYear,
        maxYear,
        decades,
        attentionLabel,
        vibe: hipsterIndex > 80 ? 'UNDERGROUND' : hipsterIndex > 50 ? 'CURATED' : 'MAINSTREAM'
    };
};
