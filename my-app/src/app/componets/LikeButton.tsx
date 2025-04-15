'use client';
import { useState } from 'react';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';

type LikeSectionProps = {
  slug: string;
  initialLikes: number;
};

export default function LikeSection({ blogId, initialLikes }: LikeSectionProps) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await fetch(`/api/blog/add-like/${blogId}/`, {
      method: 'POST',
    });

    if (res.ok) {
      if (liked) {
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    }
  };

  return (
    <div className="flex items-center">
      <p className="font-medium text-gray-700">{likeCount}</p>
      <button
        onClick={handleLike}
        className="hover:bg-gray-300 bg-gray-200  rounded-full"
      >
        <BiSolidLike size={24} />
      </button>
    </div>
  );
}
