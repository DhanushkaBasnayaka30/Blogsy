import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { processImagesInContent } from "./processImageContent";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { title, content, tags, category, userId } = body;
		console.log("i am in blog create");
		console.log("Received content:======>", userId);

		// Process images inside content — upload to Cloudinary & replace src
		const updatedContent = await processImagesInContent(content);

		console.log("update contetnt--->", updatedContent);
		// Save post in Prisma with updated content
		const post = await prisma.blog.create({
			data: {
				title,
				content: updatedContent,
				tags: { set: tags },
				category,
				author: { connect: { id: userId } },
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ message: "Error creating post" },
			{ status: 500 }
		);
	}
}
