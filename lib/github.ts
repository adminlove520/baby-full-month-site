export interface Photo {
  name: string;
  path: string;
  url: string;
  download_url: string;
}

export interface MusicFile {
  name: string;
  path: string;
  download_url: string;
}

export async function getPhotos(dirPath: string = "Photos/张景皓"): Promise<Photo[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = "adminlove520";
  const repo = "HaoPic";

  async function fetchRecursive(currentPath: string): Promise<Photo[]> {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(currentPath)}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${currentPath}:`, await response.text());
      return [];
    }

    const data = await response.json();
    let photos: Photo[] = [];

    for (const item of data) {
      if (item.type === "dir") {
        const subPhotos = await fetchRecursive(item.path);
        photos = [...photos, ...subPhotos];
      } else if (item.type === "file" && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) {
        photos.push({
          name: item.name,
          path: item.path,
          url: item.html_url,
          download_url: `/api/proxy-image?path=${encodeURIComponent(item.path)}`,
        });
      }
    }
    return photos;
  }

  try {
    return await fetchRecursive(dirPath);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

export async function getMusic(): Promise<MusicFile[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = "adminlove520";
  const repo = "HaoPic";
  const path = "Music";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data
      .filter((item: any) => item.type === "file" && /\.(mp3|wav|ogg|m4a)$/i.test(item.name))
      .map((item: any) => ({
        name: item.name,
        path: item.path,
        download_url: `/api/proxy-image?path=${encodeURIComponent(item.path)}`,
      }));

  } catch (error) {
    return [];
  }
}

export async function uploadToGithub(fileName: string, contentBase64: string, folder: string = "Music") {
  const token = process.env.GITHUB_TOKEN;
  const owner = "adminlove520";
  const repo = "HaoPic";
  const path = `${folder}/${fileName}`;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${fileName} via Baby Site`,
        content: contentBase64,
      }),
    }
  );

  return response.ok;
}
