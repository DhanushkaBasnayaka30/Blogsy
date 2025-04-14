'use client'
import BlogEditor from "@/app/componets/BlogEdier";
import TiptapEditor from "@/app/componets/Editor";
import RichTextEditor from "@/app/componets/rich-text-editor/page";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import FroalaEditor, {FrolaEditor} from 'react-froala-wysiwyg'

export default function CreatePostPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState(""); // Make sure to get the userId from your authentication logic
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user.id) {
      console.log("User ID: ", session.user.id);
      setUserId(session.user.id);
    }
  }, [session]);

console.log("===================>",userId);
  // Handling form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "category") {
      setCategory(value);
    }
  };



  // Handle submitting the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("../../api/blog/blog-create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          category,
          userId,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        console.log("Post created successfully", post);
        // You may want to redirect or clear the form after successful submission
      } else {
        const error = await response.json();
        setError(error.message || "Error creating post");
      }
    } catch (error) {
      console.log(error);
      setError("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-2xl mb-4">Create a New Post</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <p>{userId}==={session?.user.id}</p>

        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-semibold">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4 w-full border-2 border-black">
          <label htmlFor="content" className="block text-lg font-semibold">Content</label>
          {/* Replace this with your rich text editor */}
         <RichTextEditor content={content} onChange={setContent}/>
         {/* <TiptapEditor/> */}
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-lg font-semibold">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={tags.join(", ")}
            onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
