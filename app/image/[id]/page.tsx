'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Image as ImageType } from '@/types';
import { useSession } from 'next-auth/react';
import Dropdown from '@/app/components/dropdown';

export default function ImageDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [image, setImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/images/${id}`)
        .then(res => {
          if (res.ok) {
            return res.json().then(data => {
              setImage({ ...data, likes: data.likes || [], colors: data.colors || [] });
              setLoading(false);
            });
          } else {
            setImage(null);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setImage(null);
          setLoading(false);
        });
    }
  }, [id]);

  const handleLike = async () => {
    const userId = (session?.user as any)?.id;
    if (!userId || !image) return;

    const liked = image.likes.includes(userId);

    const response = await fetch(`/api/images/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: !liked }),
    });

    if (response.ok) {
      setImage(prev => prev ? {
        ...prev,
        likes: liked
          ? prev.likes.filter(l => l !== userId)
          : [...prev.likes, userId]
      } : null);
    }
  };

  const handleDownload = async () => {
    if (!image || image.locked) return;

    // Increment download count
    await fetch(`/api/images/${id}/download`, { method: 'POST' });

    // Trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update local count
    setImage(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Image not found.</div>
      </div>
    );
  }

  const isLiked = session?.user ? image.likes.includes((session.user as any).id) : false;

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 right-0 z-10 p-4">
        <Dropdown />
      </header>

      <div className="pt-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Details on left */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{image.title}</h1>
            <p className="text-lg">{image.description}</p>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Story</h2>
              <p className="text-gray-300">{image.story}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Colors</h2>
              <div className="flex flex-wrap gap-2">
                {image.colors.map((color, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                disabled={!session}
                className={`px-6 py-3 rounded-full font-semibold ${
                  isLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                ❤️ {image.likes.length}
              </button>
              <button
                onClick={handleDownload}
                disabled={image.locked}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold disabled:opacity-50"
              >
                📥 {image.downloads}
            H  </button>
              {image.locked && <span className="text-red-500">Locked</span>}
            </div>
          </div>

          {/* Image on right */}
          <div className="relative aspect-square lg:aspect-auto lg:h-screen">
            {image.url ? (
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Image not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
