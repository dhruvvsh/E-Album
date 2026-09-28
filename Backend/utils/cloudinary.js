import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     //upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     // file has been uploaded successfull
//     //console.log("file is uploaded on cloudinary ", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// };

export const getPublicId = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  return publicId;
}

// Delete images from Cloudinary. Never throws: missing credentials or a failed
// request is logged and skipped so it cannot block deleting the DB records.
export const destroyImages = async (urls) => {
  await Promise.all(
    urls.filter(Boolean).map(async (url) => {
      try {
        await cloudinary.uploader.destroy(getPublicId(url));
      } catch (error) {
        console.error(`Cloudinary delete failed for ${url}:`, error.message || error);
      }
    })
  );
};

export default cloudinary;
// export { uploadOnCloudinary };
