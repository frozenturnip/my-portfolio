import { NextResponse } from "next/server";

const RSS_FEED_URL = "https://feeds.simplecast.com/BqbsxVfO";

interface PodcastEpisode {
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishDate: string;
  episodeNumber?: number;
  imageUrl: string;
}

export async function GET() {
  try {
    const response = await fetch(RSS_FEED_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed");
    }

    const xml = await response.text();

    // Parse the XML to extract episode data
    const episodes: PodcastEpisode[] = [];

    // Get show image
    const showImageMatch = xml.match(
      /<itunes:image href="([^"]+)"[^>]*\/>/
    );
    const showImage = showImageMatch?.[1] || "";

    // Parse items (episodes)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;
    let count = 0;

    while ((itemMatch = itemRegex.exec(xml)) !== null && count < 5) {
      const item = itemMatch[1];

      const titleMatch = item.match(/<itunes:title>([^<]+)<\/itunes:title>/);
      const descMatch = item.match(/<itunes:summary>([^<]+)<\/itunes:summary>/);
      const audioMatch = item.match(/<enclosure[^>]+url="([^"]+)"/);
      const durationMatch = item.match(
        /<itunes:duration>([^<]+)<\/itunes:duration>/
      );
      const pubDateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/);
      const episodeMatch = item.match(
        /<itunes:episode>([^<]+)<\/itunes:episode>/
      );
      const episodeImageMatch = item.match(
        /<itunes:image href="([^"]+)"[^>]*\/>/
      );

      if (titleMatch && audioMatch) {
        episodes.push({
          title: titleMatch[1],
          description: descMatch?.[1] || "",
          audioUrl: audioMatch[1].replace(/&amp;/g, "&"),
          duration: durationMatch?.[1] || "",
          publishDate: pubDateMatch?.[1] || "",
          episodeNumber: episodeMatch ? parseInt(episodeMatch[1]) : undefined,
          imageUrl: episodeImageMatch?.[1] || showImage,
        });
        count++;
      }
    }

    return NextResponse.json({
      showName: "99% Invisible",
      host: "Roman Mars",
      showImage,
      episodes,
    });
  } catch (error) {
    console.error("Error fetching podcast:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcast data" },
      { status: 500 }
    );
  }
}
