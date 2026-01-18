import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { Image } from '@/types';

const DATABASE_NAME = 'andylukijr';
const IMAGES_COLLECTION = 'images';

export async function getImages(): Promise<Image[]> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const images = await db.collection<Image>(IMAGES_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return images;
}

export async function getImage(id: string): Promise<Image | null> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const image = await db.collection<Image>(IMAGES_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return image;
}

export async function createImage(image: Omit<Image, '_id'>): Promise<string> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const result = await db.collection<Image>(IMAGES_COLLECTION)
    .insertOne(image);
  return result.insertedId.toString();
}

export async function updateImageLikes(id: string, userId: string, liked: boolean): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const update: any = liked
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };
  await db.collection<Image>(IMAGES_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, update);
}

export async function incrementDownload(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  await db.collection<Image>(IMAGES_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $inc: { downloads: 1 } });
}

export async function incrementView(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  await db.collection<Image>(IMAGES_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
}

export async function deleteImage(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  await db.collection<Image>(IMAGES_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}
