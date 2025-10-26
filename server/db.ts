import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  blogPosts,
  pinterestPins,
  wordPressSites,
  publishingSchedules,
  apiKeyRotation,
  activityLogs,
  contentQueue,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= BLOG POST QUERIES =============

export async function createBlogPost(post: typeof blogPosts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(blogPosts).values(post);
}

export async function getBlogPostsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(blogPosts).where(eq(blogPosts.userId, userId)).orderBy(desc(blogPosts.createdAt));
}

export async function updateBlogPost(id: number, updates: Partial<typeof blogPosts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
}

// ============= PINTEREST PIN QUERIES =============

export async function createPinterestPin(pin: typeof pinterestPins.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(pinterestPins).values(pin);
}

export async function getPinterestPinsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(pinterestPins).where(eq(pinterestPins.userId, userId)).orderBy(desc(pinterestPins.createdAt));
}

export async function updatePinterestPin(id: number, updates: Partial<typeof pinterestPins.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(pinterestPins).set(updates).where(eq(pinterestPins.id, id));
}

// ============= WORDPRESS SITE QUERIES =============

export async function createWordPressSite(site: typeof wordPressSites.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(wordPressSites).values(site);
}

export async function getWordPressSitesByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(wordPressSites).where(eq(wordPressSites.userId, userId));
}

export async function getWordPressSiteById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(wordPressSites).where(eq(wordPressSites.id, id)).limit(1);
  return result[0];
}

export async function updateWordPressSite(id: number, updates: Partial<typeof wordPressSites.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(wordPressSites).set(updates).where(eq(wordPressSites.id, id));
}

// ============= PUBLISHING SCHEDULE QUERIES =============

export async function getOrCreatePublishingSchedule(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(publishingSchedules).where(eq(publishingSchedules.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  const newSchedule = { userId, postsPerDay: 30, pinsPerDay: 30, publishTime: "09:00", timezone: "UTC", isActive: true };
  await db.insert(publishingSchedules).values(newSchedule);
  return newSchedule;
}

export async function updatePublishingSchedule(userId: number, updates: Partial<typeof publishingSchedules.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(publishingSchedules).set(updates).where(eq(publishingSchedules.userId, userId));
}

// ============= ACTIVITY LOG QUERIES =============

export async function createActivityLog(log: typeof activityLogs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(activityLogs).values(log);
}

export async function getActivityLogsByUser(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

// ============= CONTENT QUEUE QUERIES =============

export async function addToContentQueue(item: typeof contentQueue.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contentQueue).values(item);
}

export async function getContentQueue(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(contentQueue).where(and(eq(contentQueue.userId, userId), eq(contentQueue.status, "queued"))).orderBy(contentQueue.priority).limit(30);
}

export async function updateContentQueueItem(id: number, updates: Partial<typeof contentQueue.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(contentQueue).set(updates).where(eq(contentQueue.id, id));
}
