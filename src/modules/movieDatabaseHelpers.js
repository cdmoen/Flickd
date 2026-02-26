// Takes in movieInfo object and returns top 3 most famous cast members
export function topThreeStars(movieInfo) {
  const cast = movieInfo.credits.cast;
  const topTenCast = cast.slice(0, 10);

  const topThreeStars = [...topTenCast]
    .sort((a, b) => a.popularity - b.popularity)
    .slice(0, 3);
  const names = topThreeStars.map((e) => e.name).join(", ");

  return names;
}

// Takes in movieInfo object and returns director
export function director(movieInfo) {
  const crew = movieInfo.credits.crew;
  const director = crew.map((member) => {
    if (member.job === "Director") {
      return member.name;
    }
  });
  return director;
}

// Takes in movieInfo object and returns youtube embed code
export function youtubeTrailer(movieInfo) {
  const firstYoutubeLink = movieInfo.videos.results.find(
    (trailer) => trailer.site === "YouTube",
  );
  if (!firstYoutubeLink) {
    return null;
  }
  const youtubeCode = firstYoutubeLink.key;
  return youtubeCode;
}
