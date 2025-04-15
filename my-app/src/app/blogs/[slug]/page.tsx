import LikeSection from "@/app/componets/LikeButton";
import SaveBlogButton from "@/app/componets/save-button";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BiSolidDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
interface Props {
	params: {
		slug: string;
	};
}

export default async function SingleBlogPage({ params }: Props) {
	
	const blog = await prisma.blog.findFirst({
		where: { slug: params.slug },
		include: {
			comments: true,
			likes: true,
		},
	});

	return (
		<div className="p-4 mt-20 min-h-screen h-auto md:w-[90%] w-full  lg:w-[80%] mx-auto border border-gray-200">
		
			<h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
			{/* Render the blog content */}
			<div
				className="
				"
				dangerouslySetInnerHTML={{ __html: blog.content }}
			/>
			{/* Likes Section */}
			<div className="mt-6">
				<p className="font-medium text-gray-700">Likes: {blog.likes.length}</p>
			</div>
			{/* Comments Section */}
			<div className="mt-6">
				<h2 className="text-2xl font-semibold mb-2">Comments</h2>
				{blog.comments.length > 0 ? (
					<ul className="space-y-4">
						{blog.comments.map((comment) => (
							<li key={comment.id} className="border-b pb-4">
								<p className="text-sm text-gray-600">{comment.content}</p>
								<p className="text-xs text-gray-400">- {comment.author.name}</p>
							</li>
						))}
					</ul>
				) : (
					<p>No comments yet.</p>
				)}
			</div>
			{/* like section */}
			<div className=" md:flex-row flex-col w-full h-auto py-4   flex items-center md:justify-start justify-start gap-x-6 borer ">
				<p className="text-2xl">What you Think</p>
				<div className="flex  justify-center items-center gap-x-4 border-black">
					<div className="hover:bg-gray-300 bg-gray-200 p-4 rounded-full cursor-pointer">
						<LikeSection blogId={blog.id} initialLikes={blog.likes.length} />
					</div>
					<div className="hover:bg-gray-300 p-4   bg-gray-200 rounded-full cursor-pointer">
						<BiSolidDislike size={24} />
					</div>
				</div>
				<div className=" w-full md:w-auto justify-center  h-12 flex md:justify-end items-center">
					<div className="md:mr-12 bg-gray-600 rounded-xl md:mt-0 mt-8  px-6 py-2 cursor-pointer">
						<SaveBlogButton blogId={blog.id} />
					</div>
				</div>
			</div>
			{/* comment section */}
			<div className="w-full h-20 md:h-40 mt-12 md:mt-0">
				<form action="">
					<div className="flex justify-around items-center gap-x-4">
						<input
							type="text"
							placeholder="Write Your comment"
							className="w-full h-20 border rounded-lg border-black text-xl pl-2"
						/>
						<div className="bg-blue-200 rounded-full p-4">
							<IoSend size={20} />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
