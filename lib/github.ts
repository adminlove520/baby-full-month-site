export interface Photo {
  name: string;
  path: string;
  url: string;
  download_url: string;
}

export async function getPhotos(): Promise<Photo[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = "adminlove520";
  const repo = "HaoPic";
  const path = "Photos/张景皓";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch photos:", await response.text());
      return [];
    }

    const data = await response.json();
    
    // Filter for images only
    return data
      .filter((item: any) => 
        item.type === "file" && 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
      )
      .map((item: any) => ({
        name: item.name,
        path: item.path,
        url: item.html_url,
        download_url: item.download_url,
      }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}
