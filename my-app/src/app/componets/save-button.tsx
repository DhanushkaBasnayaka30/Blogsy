"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface SavePostButtonProps {
  blogId: string;
}

export default function SaveBlogButton({ blogId }: SavePostButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  const handleSave = async () => {
    if (!session?.user?.id) {
      setMessage("You must be signed in to save a post.");
      return;
    }

    setLoading(true);
    setMessage("");
    console.log("user id ===>", session.user.id);

    try {
      const res = await fetch(`/api/blog/save-blog/${session?.user?.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Post saved successfully!");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error saving post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 text-white rounded hover:scale-110 cursor-pointer disabled:bg-gray-400"
      >
     
        {!message ? (
          <span>{loading ? "Saving..." : "Save Post"}</span>
        ) : (
          !loading &&
          message && (
            <p className="mt-2 text-sm text-white font-bold">{message}</p>
          )
        )}
      </button>
    </div>
  );
}
