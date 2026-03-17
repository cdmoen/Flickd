/*

====================================
    NOTE ABOUT TMDB MOVIE POSTERS
====================================

The 'poster_path' for a film can be retrieved from the TMDB API using a fetcher
like fetchMovieInfo().  A usable image URL must then be constructed by appending
this path (a string) to the following URL:

https://image.tmdb.org/t/p/w200/

example usage:

https://image.tmdb.org/t/p/w200/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg

===========================
    NOTE ON IMAGE SIZES
============================

The base URL as seen here:

https://image.tmdb.org/t/p/w200/

can be modified to retrieve a variety of image sizes by replacing 'w200' with another value (e.g. w92, w45, w300, etc)

The full list of available sizes can be found here:
https://developer.themoviedb.org/reference/configuration-details

*/

// Takes in movieInfo object and returns top 3 most famous cast members
export function topThreeStars(movieInfo) {
  const cast = movieInfo.credits.cast;
  const topTenCast = cast.slice(0, 10);

  const topThreeStars = [...topTenCast]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
  const names = topThreeStars.map((e) => e.name).join(", ");

  return names;
}

// Takes in movieInfo object and returns director
export function director(movieInfo) {
  const crew = movieInfo.credits.crew;
  const directors = crew.map((member) =>
    member.job === "Director" ? member.name : null,
  );
  const director = crew.find((member) => member.job === "Director");
  if (!director) {
    return null;
  }
  return director.name;
}

// Takes in movieInfo object and returns youtube embed code for best quality
// official trailer, (or unofficial trailer of no official trailers available)
export function youtubeTrailer(movieInfo) {
  const trailers = movieInfo.videos.results.filter((v) => v.type === "Trailer");
  if (trailers.length === 0) return null;

  const officialTrailers = trailers.filter((v) => v.official === true);
  const pool = officialTrailers.length > 0 ? officialTrailers : trailers;
  const youtubeResults = pool.filter((v) => v.site === "YouTube");
  if (youtubeResults.length === 0) return null;

  const youtubeResultsSorted = [...youtubeResults].sort(
    (a, b) => b.size - a.size,
  );
  const youtubeCode = youtubeResultsSorted[0].key;

  return youtubeCode;
}
