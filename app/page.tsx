'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageType } from '@/types';
import { useSession } from 'next-auth/react';
import Dropdown from '@/app/components/dropdown';

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setImages([]);
        } else {
          setImages(data.map((img: any) => ({ ...img, likes: img.likes || [], colors: img.colors || [], views: img.views || 0 })));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        setImages([]);
        setLoading(false);
      });
  }, []);



  const handleLike = async (image: ImageType, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const userId = (session?.user as any)?.id;
    if (!userId || !image) return;

    const liked = image.likes?.includes(userId);

    const response = await fetch(`/api/images/${image._id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: !liked }),
    });

    if (response.ok) {
      // Update the image in the grid
      setImages(prev => prev.map(img =>
        img._id === image._id ? {
          ...img,
          likes: liked
            ? img.likes?.filter(l => l !== userId) || []
            : [...(img.likes || []), userId]
        } : img
      ));

      // Update selectedImage if it's the same
      if (selectedImage && selectedImage._id === image._id) {
        setSelectedImage(prev => prev ? {
          ...prev,
          likes: liked
            ? prev.likes?.filter(l => l !== userId) || []
            : [...(prev.likes || []), userId]
        } : null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-center px-4">
          <h2 className="text-xl mb-4">Connection Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-400">
            Please check your MongoDB Atlas setup and .env.local configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#0C2340]/80 backdrop-blur-sm border-b border-[#0C2340]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-great-vibes text-4xl text-white">AndyLukJr</span>
          </div>
          <div className="flex items-center">
            <Dropdown />
          </div>
        </div>
      </header>

      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-20">
            <h1 className="text-7xl font-light text-white mb-6 animate-slide-lr">Andy Luki Jr Photography Portfolio</h1>
            <p className="text-3xl text-gray-300 mb-12 max-w-6xl mx-auto leading-relaxed">
              Capturing moments that tell stories, preserving memories that last forever.
            </p>
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="bg-linear-to-r from-gray-800 to-black rounded-xl p-6 border border-gray-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">🏛️ Zambia's Sixth President H.E Edgar Chagwa Lungu's Photographer</p>
                </div>
                <div className="bg-linear-to-r from-gray-800 to-black rounded-xl p-6 border border-gray-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">🏆 Best Zikomo African Photographer of the Year 2025</p>
                </div>
                <div className="bg-linear-to-r from-gray-800 to-black rounded-xl p-6 border border-gray-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">🌟 Young Achieves Southern African Photographer of the Year 2025</p>
                </div>
                <div className="bg-linear-to-r from-gray-800 to-black rounded-xl p-6 border border-gray-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">💖 Your Girlfriend's Favourite Photographer</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="#portfolio" className="bg-linear-to-r from-white to-gray-200 text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                ✨ View Portfolio
              </Link>
            </div>
          </section>

          <section id="portfolio" className="py-16">
            <h2 className="text-4xl font-light text-white text-center mb-12">Featured Works</h2>

          {images.length === 0 ? (
            <div className="text-black text-center">No images yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-rl">
              {images.map((image) => (
                <div key={image._id?.toString()} onClick={() => {
                  setSelectedImage(image);
                  // Increment view
                  fetch(`/api/images/${image._id}/view`, { method: 'POST' }).catch(error => console.error('Error incrementing view:', error));
                  // Update local views
                  setImages(prev => prev.map(img =>
                    img._id === image._id ? { ...img, views: img.views + 1 } : img
                  ));
                }}>
                  <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-xl hover:shadow-gray-300 transition-all duration-300 group">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => handleLike(image, e)}
                        disabled={!session}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-3xl hover:scale-110 disabled:opacity-0"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </section>
        </div>
      </main>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex h-full">
              <div className="w-1/2 p-4 flex items-center justify-center relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  width={600}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <div className="w-1/2 p-4 text-white overflow-y-auto">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="float-right text-2xl hover:text-gray-300"
                >
                  &times;
                </button>
                <h2 className="text-3xl font-bold mb-4">{selectedImage.title}</h2>
                <p className="mb-4">{selectedImage.story}</p>
                <button
                  onClick={() => handleLike(selectedImage)}
                  disabled={!session}
                  className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-full text-white font-semibold"
                >
                  ❤️ {selectedImage.likes?.length || 0}
                </button>
                <p className="mb-4">👁️ {selectedImage.views} views</p>
                <p>📥 {selectedImage.downloads} downloads</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
