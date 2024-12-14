import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Profile Image
export const uploadProfileImageToCloudinary = async (file, folder) => {
  try {
    return await cloudinary.uploader.upload(file, {
      folder: `${folder}`,
      transformation: [{ width: 500, crop: 'scale' }, { quality: 'auto' }]
    });
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw error;
  }
};

// Delete Profile Image
export const deleteProfileImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
  }
};

// Upload Post Image
export const uploadPostImageToCloudinary = async (file, folder) => {
  try {
    return await cloudinary.uploader.upload(file, {
      folder: `${folder}`,
      transformation: [{ width: 500, crop: 'scale' }, { quality: 'auto' }]
    });
  } catch (err) {
    logger.error(`Cloudinary upload error: ${err.message}`);
    throw err;
  }
};

// Delete Post Image
export const deletePostImageFromCloudinary = async (imageUrl, folder) => {
  try {
    const fileName = imageUrl.split('/').pop().split('.')[0];
    const publicId = `${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Successfully deleted image: ${publicId}`);
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
  }
};
