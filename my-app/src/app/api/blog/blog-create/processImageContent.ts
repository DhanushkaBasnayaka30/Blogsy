import { load } from "cheerio";
import cloudinary from "../../../../lib/cloudinary";

export async function processImagesInContent(content: string) {
	const $ = load(content);

	const imagePromises = $("img")
		.map(async (i, img) => {
			const src = $(img).attr("src");

			// If it's a base64 image
			if (src && src.startsWith("data:image")) {
				const uploadResponse = await cloudinary.uploader.upload(src, {
					folder: "blog_images",
					public_id: `blog-${Date.now()}-${i}`,
					resource_type: "image",
				});

				// Replace base64 src with Cloudinary URL
				$(img).attr("src", uploadResponse.secure_url);

				// ✅ Console log when upload is successful
				console.log(
					`✅ Image ${i + 1} uploaded successfully: ${
						uploadResponse.secure_url
					}`
				);
			}
		})
		.get(); // Converts cheerio collection into a usable array of promises

	await Promise.all(imagePromises);

	return $.html(); // Return the updated HTML string
}
