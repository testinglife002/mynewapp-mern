import cloudinary from '../config/cloudinary.js';

export const getSignature = async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = { timestamp, folder: 'canva-clone' };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder: 'canva-clone',
    signature,
  });
};
