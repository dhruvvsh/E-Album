const HEIC_CLOUDINARY_URL = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)\.(?:heic|heif)(\?.*)?$/i

// Browsers other than Safari can't render HEIC, so ask Cloudinary to deliver it as JPEG.
export const toWebImageUrl = (url) =>
  typeof url === 'string' ? url.replace(HEIC_CLOUDINARY_URL, '$1q_auto/$2.jpg$3') : url

export const isVideoUrl = (url) => typeof url === 'string' && url.includes('/video/upload/')
