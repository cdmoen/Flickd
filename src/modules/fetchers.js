const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Takes in a movie string param and returns list of movie IDs
export async function fetchMovieSearch(searchParams) {
  const paramsString = searchParams.split(" ").join("%20");

  const response = await fetch(
    // Fetch using TMDB 'search' function to get list of movie ID's
    `https://api.themoviedb.org/3/search/movie?query=${searchParams}&include_adult=false&language=en-US&page=1`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("fetchMovieSearch failed");
  }
  console.log("fetchMovieSearch successful");
  return await response.json();
}

// Takes in movieID and returns director and returns info, credits, trailer links
export async function fetchMovieInfo(movieID) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieID}?append_to_response=credits%2Cvideos&language=en-US`,

    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("fetchCredits failed");
  }
  console.log("fetchMovieInfo successful");
  const movieInfo = await response.json();
  return movieInfo;
}
