'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Auto sign in after successful signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/');
        } else {
          alert('Account created but sign in failed. Please sign in manually.');
          router.push('/auth/signin');
        }
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
