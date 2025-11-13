// components/app-viewer/media/useYoutube.ts
export async function fetchYoutubeMostPopular(apiKey: string) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=20&key=${encodeURIComponent(
      apiKey
    )}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("YT fetch error", err);
    return null;
  }
}

export async function searchYoutube(apiKey: string, query: string) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${encodeURIComponent(
      apiKey
    )}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("YT search error", err);
    return null;
  }
}
