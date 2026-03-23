/*

How API Requests Work in This Project
All network requests to The Movie Database (TMDB) are routed through Vercel Serverless Functions located in the /api directory. 
These files run on the server, not in the browser, which keeps the TMDB API key private.
When one of the fetcher functions below call something like:

/api/tmdb?path=movie/550&language=en-US

Vercel automatically executes the corresponding file:
api/tmdb.js

That backend function then does the following:

1.  Reads the secret TMDB key from the Vercel project's environment 
variables (those are not stored in the github repository - only on the Vercel website)

2. Forwards the request to the real TMDB API

3. Returns the JSON response back to the frontend

This lets the frontend fetch TMDB data securely without ever exposing the API key to the frontend.



==============================
    FETCH MOVIE SEARCH
==============================

This fetcher takes in a movie string param and returns a list of TMDB movies with the following info for each:

 "results": [
    {
      "adult": false,
      "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      "genre_ids": [array],
      "id": 550,
      "original_language": "en",
      "original_title": "Fight Club",
      "overview": "string",
      "popularity": 73.433,
      "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "release_date": "1999-10-15",
      "title": "Fight Club",
      "video": false,
      "vote_average": 8.433,
      "vote_count": 26279
    },
 */

export async function fetchMovieSearch(searchParams) {
  // Build the URL for your Vercel API route
  const url = `/api/tmdb?path=search/movie&query=${encodeURIComponent(
    searchParams,
  )}&include_adult=false&language=en-US&page=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("fetchMovieSearch failed");
  }

  console.log("fetchMovieSearch successful");
  return await response.json();
}

/*
==============================
    FETCH MOVIE DETAILS
==============================

This fetcher takes in a single TMDB movieID and returns the following movie object:

{
  "adult": false,
  "backdrop_path": "/c6OLXfKAk5BKeR6broC8pYiCquX.jpg",
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "belongs_to_collection": null,
  "budget": 63000000,
  "genres": an [array] of {id: number, name: string} objects
  "homepage": "http://www.foxmovies.com/movies/fight-club",
  "id": 550,
  "imdb_id": "tt0137523",
  "origin_country": [array]
  "original_language": "en",
  "original_title": "Fight Club",
  "overview": string,
  "popularity": 24.1623,
  "production_companies": [array] of {objects}
  "production_countries": [],
  "release_date": "1999-10-15",
  "revenue": 100853753,
  "runtime": 139,
  "spoken_languages": [],
  "status": "Released",
  "tagline": "Mischief. Mayhem. Soap.",
  "title": "Fight Club",
  "video": false,
  "vote_average": 8.438,
  "vote_count": 31539,
  "credits": {"cast": [{actor1}, {actor2},...], "crew": [{crew1},{crew2}...]},
  "videos": { "results": [ {trailer}, {trailer}, {trailer} ] }
}
*/

export async function fetchMovieDetails(movieID) {
  const response = await fetch(
    `/api/tmdb?path=movie/${movieID}&append_to_response=credits,videos,images&language=en-US`,
  );

  if (!response.ok) {
    throw new Error("fetchCredits failed");
  }
  const movieInfo = await response.json();
  return movieInfo;
}
