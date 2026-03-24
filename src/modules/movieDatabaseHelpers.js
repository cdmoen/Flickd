/*
==============================
   NOTE ABOUT TMDB POSTERS
==============================

The poster_path for a film can be retrieved from the TMDB API using a fetcher
like fetchMovieInfo(). A usable image URL must then be constructed by appending
this path to the following base URL:

  https://image.tmdb.org/t/p/w200/

Example:

  https://image.tmdb.org/t/p/w200/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg

The w200 segment controls the image size and can be replaced with other
values (e.g. w45, w92, w300, etc). The full list of available sizes can
be found at:

  https://developer.themoviedb.org/reference/configuration-details

*/

/*
==============================
        TOP THREE STARS
==============================

Given a movie object, returns a comma-separated string of the three most
popular cast members by TMDB popularity score.

Popularity is only compared within the top 10 billed cast members to avoid
surfacing uncredited or minor appearances over lead roles.

PARAMS:
  movie (object) - a full TMDB movie object containing a credits.cast array

RETURNS:
  names (string) - the top 3 stars formatted as "Name, Name, Name"

*/
export function topThreeStars(movie) {
  const cast = movie.credits.cast;

  // Limit to the top 10 billed cast members before sorting by popularity —
  // this keeps the results focused on notable roles rather than cameos
  const topTenCast = cast.slice(0, 10);

  const topThreeStars = [...topTenCast]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  const names = topThreeStars.map((e) => e.name).join(", ");

  return names;
}

/*
==============================
           DIRECTOR
==============================

Given a movie object, returns the name of the film's director.

PARAMS:
  movie (object) - a full TMDB movie object containing a credits.crew array

RETURNS:
  name (string) - the director's name, or null if no director is found

*/
export function director(movie) {
  const crew = movie.credits.crew;

  // Find the first crew member with the job title "Director"
  const director = crew.find((member) => member.job === "Director");

  if (!director) {
    return null;
  }

  return director.name;
}

/*
==============================
        YOUTUBE TRAILER
==============================

Given a movie object, returns the YouTube embed key for the best available
trailer. Prefers official trailers over unofficial, and higher resolution
over lower.

If no trailers are found at all, or none are hosted on YouTube, returns
the key for a well-known fallback video as a last resort.

PARAMS:
  movie (object) - a full TMDB movie object containing a videos.results array,
                   where each video has properties: key, size, site, type, official

RETURNS:
  youtubeCode (string) - the YouTube video key for the best available trailer

*/
export function youtubeTrailer(movie) {
  // Filter the full video list down to trailers only
  const trailers = movie.videos.results.filter((v) => v.type === "Trailer");
  if (trailers.length === 0) return "dQw4w9WgXcQ";

  // Prefer official trailers, but fall back to any trailer if none are official
  const officialTrailers = trailers.filter((v) => v.official === true);
  const pool = officialTrailers.length > 0 ? officialTrailers : trailers;

  // Only YouTube keys are usable for embedding — bail if none are available
  const youtubeResults = pool.filter((v) => v.site === "YouTube");
  if (youtubeResults.length === 0) return "dQw4w9WgXcQ";

  // Sort by resolution descending and take the highest quality result
  const youtubeResultsSorted = [...youtubeResults].sort(
    (a, b) => b.size - a.size,
  );

  const youtubeCode = youtubeResultsSorted[0].key;

  return youtubeCode;
}
