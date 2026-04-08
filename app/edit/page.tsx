'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageType } from '@/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function EditImages() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch('/api/images')
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            setImages([]);
          } else {
            // Filter images uploaded by the user
            const userId = (session.user as { id?: string })?.id;
            setImages(data.filter((img: ImageType) => img.uploadedBy === userId));
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          setImages([]);
          setLoading(false);
        });
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const response = await fetch(`/api/images/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setImages(prev => prev.filter(img => img._id !== id));
    } else {
      alert('Failed to delete image');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500 text-center px-4">
          <h2 className="text-xl mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-black backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-great-vibes text-4xl text-white">AndyLukJr</span>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-white hover:text-gray-400 mr-4">Portfolio</Link>
            <Link href="/upload" className="text-white hover:text-gray-400">Upload</Link>
          </div>
        </div>
      </header>

      <main className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Edit Images</h1>

          {images.length === 0 ? (
            <div className="text-center">No images to edit.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image._id?.toString()} className="relative">
                  <Image
                    src={image.url}
                    alt={image.title}
                    width={300}
                    height={300}
                    className="object-cover w-full h-64 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      onClick={() => image._id && handleDelete(image._id.toString())}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm text-gray-400">Likes: {image.likes?.length || 0} | Views: {image.views} | Downloads: {image.downloads}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
