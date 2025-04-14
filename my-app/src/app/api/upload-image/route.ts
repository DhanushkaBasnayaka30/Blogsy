import cloudinary from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';



const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory temporarily
});

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file upload
  },
};

export default function handler(req, res) {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Image upload failed', error: err });
    }

    try {
      // Create a Cloudinary upload stream
      const streamUpload = (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'blog_images' }, // Specify a folder to store images in Cloudinary
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream); // Upload file from buffer
        });

      // Upload the image
      const result = await streamUpload(req.file);

      // Send back the image URL to the client
      res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).json({ message: 'Error uploading image', error: uploadError });
    }
  });
}
