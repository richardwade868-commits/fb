import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table for storing generated recipes and blog content
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  ingredients: text("ingredients"),
  instructions: text("instructions"),
  status: mysqlEnum("status", ["pending", "generating", "generated", "publishing", "published", "failed"]).default("pending"),
  wordpressPostId: varchar("wordpressPostId", { length: 100 }),
  wordpressSiteId: int("wordpressSiteId"),
  generatedAt: timestamp("generatedAt"),
  publishedAt: timestamp("publishedAt"),
  failureReason: text("failureReason"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Pinterest pins table for storing generated pin designs
 */
export const pinterestPins = mysqlTable("pinterest_pins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  blogPostId: int("blogPostId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  imageKey: varchar("imageKey", { length: 255 }),
  status: mysqlEnum("status", ["pending", "generating", "generated", "uploading", "uploaded", "failed"]).default("pending"),
  pinterestPinId: varchar("pinterestPinId", { length: 100 }),
  generatedAt: timestamp("generatedAt"),
  uploadedAt: timestamp("uploadedAt"),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PinterestPin = typeof pinterestPins.$inferSelect;
export type InsertPinterestPin = typeof pinterestPins.$inferInsert;

/**
 * WordPress sites table for managing multiple WordPress installations
 */
export const wordPressSites = mysqlTable("wordpress_sites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  appPassword: text("appPassword"),
  isActive: boolean("isActive").default(true),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WordPressSite = typeof wordPressSites.$inferSelect;
export type InsertWordPressSite = typeof wordPressSites.$inferInsert;

/**
 * Publishing schedule table for managing daily publishing settings
 */
export const publishingSchedules = mysqlTable("publishing_schedules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postsPerDay: int("postsPerDay").default(30),
  pinsPerDay: int("pinsPerDay").default(30),
  publishTime: varchar("publishTime", { length: 10 }),
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PublishingSchedule = typeof publishingSchedules.$inferSelect;
export type InsertPublishingSchedule = typeof publishingSchedules.$inferInsert;

/**
 * API key rotation tracking table for Gemini keys
 */
export const apiKeyRotation = mysqlTable("api_key_rotation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  keyIndex: int("keyIndex"),
  requestCount: int("requestCount").default(0),
  errorCount: int("errorCount").default(0),
  lastUsedAt: timestamp("lastUsedAt"),
  rateLimitReachedAt: timestamp("rateLimitReachedAt"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiKeyRotation = typeof apiKeyRotation.$inferSelect;
export type InsertApiKeyRotation = typeof apiKeyRotation.$inferInsert;

/**
 * Activity logs table for tracking all publishing activities
 */
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  resourceType: mysqlEnum("resourceType", ["post", "pin", "website", "schedule"]),
  resourceId: int("resourceId"),
  status: mysqlEnum("status", ["success", "failure"]).default("success"),
  message: text("message"),
  errorDetails: text("errorDetails"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Content queue table for managing publishing queue
 */
export const contentQueue = mysqlTable("content_queue", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  blogPostId: int("blogPostId"),
  pinterestPinId: int("pinterestPinId"),
  scheduledFor: timestamp("scheduledFor"),
  priority: int("priority").default(0),
  status: mysqlEnum("status", ["queued", "processing", "completed", "failed"]).default("queued"),
  retryCount: int("retryCount").default(0),
  lastError: text("lastError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentQueue = typeof contentQueue.$inferSelect;
export type InsertContentQueue = typeof contentQueue.$inferInsert;