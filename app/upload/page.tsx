'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Dropdown from '@/app/components/dropdown';

export default function Upload() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    colors: '',
    locked: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Please log in to upload images');
      return;
    }

    if (!file) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('story', formData.story);
      formDataObj.append('colors', formData.colors);
      formDataObj.append('locked', formData.locked.toString());
      formDataObj.append('file', file);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        const { id } = await response.json();
        router.push(`/image/${id}`);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Please log in to upload images</h1>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
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

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl font-light text-center mb-12 text-white">Upload New Image</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="order-2 lg:order-1">
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-600 shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Image Preview</h2>
              {file ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Select an image to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Story</label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Colors (comma separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="e.g. Red, Blue, Green"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="locked"
              checked={formData.locked}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Lock image (prevent downloads)</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
