## Project Background
A Spotify playlists stats visualization and exploration tool.

## 1. Analytics & Data Features
- **Years Distribution**
  - *Implementation*: Parse `track.album.release_date` (YYYY-MM-DD). Extract Year. Bucket into Decades (2010s, 2020s).
  - *Display*: Vertical Bar Chart. Can alternatively be switched to years distribution. On each bar display average popularity for that group.
- **Year Span**
  - *Display*: How many years the playlist spans.
- **Top Genres**
  - *Implementation*: Fetch Artists for all tracks -> Get Genres -> Count frequency.
  - *Display*: "Genre Cloud" (Text list with visual weight and counts) or Table.
- **Top Artists**
  - *Implementation*: Count `track.artists[0].name` frequency.
  - *Display*: Simple Table (Rank, Name, Count).
- **Explicitness**
  - *Implementation*: `track.explicit` (boolean). Calculate percentage.
- **Duration**
  - *Implementation*: Sum `track.duration_ms`. Convert to Hours:Minutes.
  - *Display*: Total duration and average duration.
- **Popularity**
  - *Implementation*: Average of `track.popularity` (0-100).
- **Album & Artists**
  - *Display*: Pie charts of album percentages and artist percentages.
- **Duration vs. Popularity**
  - *Display*: Map of tracks with duration on x-axis and popularity on y-axis.

## 2. Export as Image
*Future Scope (Phase 2)*
- **"Sharable Image"**: Post a summary of analytics data to your social media accounts.

## 3. Playlist Comparison
*Future Scope (Phase 2)*
- **Radar Chart**: Comparison of calculated normalized scores (Diversity, Hipster, Pop).
- **Venn Diagram**: Intersection of Track IDs.

## 4. Personal History
*Future Scope (Phase 3)*
- **Listening History**: Upload personal listening data exported from Spotify, display as timeline and daily activity, with analytics.
- **Today in History**: Know what you were listening to years ago on this day

