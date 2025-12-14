import axios from 'axios';

/**
 * Token cache with expiry for reducing redundant API calls.
 */
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetches the current user's Spotify access token from the API.
 * Implements caching with 50-minute expiry to reduce API calls.
 * 
 * @returns {Promise<string>} The access token
 * @throws {Error} If token is invalid or request fails
 */
const getAccessToken = async () => {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  
  // Fetch new token
  const response = await axios.get('/api/token');
  const token = response.data;
  
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token received');
  }
  
  // Cache token for 50 minutes (Spotify tokens typically last 1 hour)
  cachedToken = token;
  tokenExpiry = Date.now() + 50 * 60 * 1000;
  
  return token;
};

/**
 * Generic function to fetch paginated data from Spotify API.
 * Automatically handles pagination by following 'next' links.
 * 
 * @param {string} url - The Spotify API endpoint URL
 * @returns {Promise<Array>} Array of all items from all pages
 */
const fetchByUrl = async (url) => {
  let results = [];
  
  try {
    const token = await getAccessToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Spotify API Error: ${response.statusText}`);
    }

    let { items, next } = await response.json();
    results.push(...items);

    // Fetch remaining pages
    while (next) {
      const nextPage = await fetch(next, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nextPageData = await nextPage.json();
      items = nextPageData.items;
      next = nextPageData.next;
      results.push(...items);
    }
  } catch (error) {
    console.error('Error fetching from Spotify:', error);
  }
  
  return results;
};

/**
 * Splits an array into smaller chunks of specified size.
 * Used for batching API requests that have size limits.
 * 
 * @param {Array} arr - The array to split
 * @param {number} size - Maximum size of each chunk
 * @returns {Array<Array>} Array of chunked arrays
 */
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

/**
 * Fetches the current user's playlists from Spotify.
 * 
 * @returns {Promise<Array>} Array of playlist objects
 */
export const getPlaylists = async () => {
  return await fetchByUrl('https://api.spotify.com/v1/me/playlists');
};

/**
 * Fetches all tracks for a given playlist.
 * Handles pagination automatically.
 * 
 * @param {string} tracksUrl - The tracks endpoint URL from playlist object
 * @returns {Promise<Array>} Array of track objects (wrapped in playlist item format)
 */
export const getTracks = async (tracksUrl) => {
  return await fetchByUrl(tracksUrl);
};

/**
 * Fetches detailed artist information including genres for multiple artists.
 * Batches requests in groups of 50 (Spotify API limit).
 * 
 * @param {Array<string>} artistIds - Array of unique Spotify artist IDs
 * @returns {Promise<Object>} Object with:
 *   - artists: Array of artist objects with full details
 *   - genreStats: Sorted array of genre objects with name and count
 */
export const getArtistDetails = async (artistIds) => {
  if (!artistIds || artistIds.length === 0) {
    return { artists: [], genreStats: [] };
  }

  try {
    const token = await getAccessToken();
    
    // Split into batches of 50 (Spotify API limit)
    const artistIdBatches = chunk(artistIds, 50)
      .map(batch => batch.filter(id => id && id.length).join(','))
      .filter(batch => batch.length > 0);

    // Fetch all batches in parallel
    const responses = await Promise.all(
      artistIdBatches.map(idList =>
        axios.get('https://api.spotify.com/v1/artists', {
          params: { ids: idList },
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    // Combine all artists from all batches
    const allArtists = responses.flatMap(response => response.data.artists);

    // Count genre occurrences
    const genreCounts = {};
    allArtists.forEach(artist => {
      if (artist && artist.genres) {
        artist.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Sort genres by count
    const genreStats = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      artists: allArtists,
      genreStats,
    };
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return { artists: [], genreStats: [] };
  }
};