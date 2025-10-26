/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Blog Post types
export interface BlogPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  excerpt: string;
  status: "pending" | "generating" | "generated" | "publishing" | "published" | "failed";
  wordpressPostId?: string;
  wordpressSiteId: number;
  generatedAt?: Date;
  publishedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pinterest Pin types
export interface PinterestPin {
  id: number;
  userId: number;
  blogPostId: number;
  imageUrl?: string;
  title: string;
  description: string;
  status: "pending" | "generating" | "generated" | "uploading" | "uploaded" | "failed";
  pinterestPinId?: string;
  generatedAt?: Date;
  uploadedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// WordPress Site types
export interface WordPressSite {
  id: number;
  userId: number;
  name: string;
  url: string;
  username: string;
  appPassword: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pinterest Account types
export interface PinterestAccount {
  id: number;
  userId: number;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  isConnected: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Publishing Schedule types
export interface PublishingSchedule {
  id: number;
  userId: number;
  postsPerDay: number;
  pinsPerDay: number;
  publishTime: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Log types
export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  resourceType: "post" | "pin" | "website" | "schedule";
  resourceId: number;
  status: "success" | "failure";
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// API Request/Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface AddTitlesFormData {
  titles: string[];
  wordpressSiteId: number;
  scheduledDate?: Date;
}

export interface WordPressSiteFormData {
  name: string;
  url: string;
  username: string;
  appPassword: string;
}

export interface ScheduleFormData {
  postsPerDay: number;
  pinsPerDay: number;
  publishTime: string;
  timezone: string;
}

export interface PinterestConnectionFormData {
  accountName: string;
  accessToken: string;
}
