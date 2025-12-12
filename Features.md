# Features & Implementation Spec

## 1. Analytics & Data Features
*Constraint: Metadata-rich analysis only (No Audio Features).*

### Basic Stats
- **Decade Distribution**
  - *Implementation*: Parse `track.album.release_date` (YYYY-MM-DD). Extract Year. Bucket into Decades (2010s, 2020s).
  - *Display*: Vertical Bar Chart (Swiss Style).
- **Top Genres**
  - *Implementation*: Fetch Artists for all tracks -> Get Genres -> Count frequency.
  - *Display*: "Genre Cloud" (Text list with visual weight) or Table.
- **Top Artists**
  - *Implementation*: Count `track.artists[0].name` frequency.
  - *Display*: Simple Table (Rank, Name, Count).
- **Explicitness**
  - *Implementation*: `track.explicit` (boolean). Calculate percentage.
  - *Display*: Stat Row "EXP%".
- **Duration**
  - *Implementation*: Sum `track.duration_ms`. Convert to Hours:Minutes.
  - *Display*: Stat Row "HOURS".
- **Popularity**
  - *Implementation*: Average of `track.popularity` (0-100).
  - *Display*: Stat Row "AVG_POP".

### Advanced "Data Munging"
- **"The Hipster Index"**
  - *Logic*: `100 - AveragePopularity`.
  - *Display*: Percentage. (>80% = "Underground", <50% = "Mainstream").
- **"Diversity Score"**
  - *Logic*: `(Unique Artist Count / Total Track Count) * 100`.
  - *Display*: High/Medium/Low label.
- **"Time Traveler"**
  - *Logic*: `Newest Track Year - Oldest Track Year`.
  - *Display*: Range in Years.
- **"Attention Span"**
  - *Logic*:
    - "TikTok": % of tracks < 2:30.
    - "Classical": % of tracks > 5:00.
  - *Display*: Dominant label.

## 2. Export as Image
*Future Scope (Phase 2)*
- **"Sharable Image"**: Post a summary of analytics data to your social media accounts.

## 3. Playlist Comparison
*Future Scope (Phase 2)*
- **Radar Chart**: Comparison of calculated normalized scores (Diversity, Hipster, Pop).
- **Venn Diagram**: Intersection of Track IDs.