export type ImageUrlResult = { url: string | null; error?: string };

export function normalizeImageUrl(value: unknown): ImageUrlResult {
  if (typeof value !== 'string' || value.trim() === '') return { url: null };

  const imageUrl = value.trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return { url: null, error: 'Masukkan URL gambar yang valid.' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { url: null, error: 'URL gambar harus menggunakan HTTP atau HTTPS.' };
  }

  if (parsedUrl.hostname === 'drive.google.com') {
    const fileId =
      parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
      parsedUrl.searchParams.get('id');

    if (!fileId) {
      return { url: null, error: 'Link Google Drive tidak memiliki ID file yang valid.' };
    }

    return { url: `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w1600` };
  }

  return { url: imageUrl };
}
