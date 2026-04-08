import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  email: string;
  name?: string;
  image?: string;
  password?: string;
}

export interface Image {
  _id?: ObjectId | string;
  title: string;
  description: string;
  story: string;
  colors: string[]; // array of color names or hex codes
  url: string; // image URL
  publicId?: string; // for cloud storage like Cloudinary
  likes: string[]; // array of user IDs who liked
  downloads: number;
  views: number; // number of times viewed
  locked: boolean; // if true, cannot download
  uploadedBy: string; // user ID
  createdAt: Date;
}

export interface Like {
  _id?: ObjectId | string;
  imageId: string;
  userId: string;
}

export interface Download {
  _id?: ObjectId | string;
  imageId: string;
  userId?: string; // optional, for anonymous downloads
  timestamp: Date;
}

export interface Event {
  _id?: ObjectId | string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  eventType: string; // e.g., "Wedding", "Portrait Session", "Exhibition", "Workshop"
  imageUrl?: string;
  registrationLink?: string;
  isPublic: boolean;
  createdBy: string; // user ID
  createdAt: Date;
}
