// Slug-to-API-Football-ID mappings for detail pages
// These map the URL slugs used in /players/[id] and /teams/[id] to numeric API IDs

export const PLAYER_SLUG_TO_ID: Record<string, number> = {
  'hakimi': 2461,       // Achraf Hakimi
  'bellingham': 132598, // Jude Bellingham
}

export const TEAM_SLUG_TO_ID: Record<string, number> = {
  'raja-ca': 976,       // Raja Casablanca
  'wydad-ac': 968,      // Wydad AC
  'far-rabat': 969,     // FAR Rabat
  'rs-berkane': 962,    // Renaissance Berkane
  'morocco': 31,        // Morocco National Team
}
