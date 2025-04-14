import { load } from "cheerio";
import cloudinary from "../../../../lib/cloudinary";

// Utility to create a slug-safe image name
function generateImageName(base: string, index: number) {
  return `${base
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/\s+/g, "-")}-${Date.now()}-${index}`;
}

export async function processImagesInContent(content: string, blogTitle: string) {
  const $ = load(content);

  const imagePromises = $("img")
    .map(async (i, img) => {
      const src = $(img).attr("src");

      if (src && src.startsWith("data:image")) {
        const imageName = generateImageName(blogTitle, i);

        const uploadResponse = await cloudinary.uploader.upload(src, {
          folder: "blog_images",
          public_id: imageName,
          resource_type: "image",
        });

        $(img).attr("src", uploadResponse.secure_url);

        console.log(`✅ Image ${i + 1} uploaded successfully: ${uploadResponse.secure_url}`);
      }
    })
    .get();

  await Promise.all(imagePromises);

  return $.html();
}
