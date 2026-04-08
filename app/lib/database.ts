import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { Image, Event } from '@/types';

const DATABASE_NAME = 'andylukijr';
const IMAGES_COLLECTION = 'images';
const EVENTS_COLLECTION = 'events';

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
  const update: { $addToSet: { likes: string } } | { $pull: { likes: string } } = liked
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

// Event database functions
export async function getEvents(upcomingOnly = true): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const query: { isPublic: boolean; date?: { $gte: Date } } = { isPublic: true };
  
  if (upcomingOnly) {
    query.date = { $gte: new Date() };
  }
  
  const events = await db.collection<Event>(EVENTS_COLLECTION)
    .find(query)
    .sort({ date: 1 })
    .toArray();
  return events;
}

export async function getEvent(id: string): Promise<Event | null> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const event = await db.collection<Event>(EVENTS_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return event;
}

export async function createEvent(event: Omit<Event, '_id'>): Promise<string> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const result = await db.collection<Event>(EVENTS_COLLECTION)
    .insertOne(event);
  return result.insertedId.toString();
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  await db.collection<Event>(EVENTS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

export async function deleteEvent(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  await db.collection<Event>(EVENTS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}
