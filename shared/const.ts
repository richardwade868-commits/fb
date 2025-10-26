export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Application metadata
export const APP_NAME = "RecipeAutoPub";
export const APP_DESCRIPTION = "Automated content publishing SaaS for recipe blogs";

// Feature constants
export const POSTS_PER_DAY = 30;
export const WORDPRESS_SITES_MAX = 2;
export const MAX_BULK_TITLES = 100;

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  ADD_TITLES: "/add-titles",
  WEBSITES: "/websites",
  PINTEREST: "/pinterest",
  SETTINGS: "/settings",
  LOGS: "/logs",
  NOT_FOUND: "/404",
} as const;

// UI constants
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 64;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Status types
export const POST_STATUS = {
  PENDING: "pending",
  GENERATING: "generating",
  GENERATED: "generated",
  PUBLISHING: "publishing",
  PUBLISHED: "published",
  FAILED: "failed",
} as const;

export const PIN_STATUS = {
  PENDING: "pending",
  GENERATING: "generating",
  GENERATED: "generated",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  FAILED: "failed",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Resource not found",
  INVALID_INPUT: "Invalid input provided",
  SERVER_ERROR: "An error occurred on the server",
  NETWORK_ERROR: "Network error occurred",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully",
  DELETED: "Item deleted successfully",
  CREATED: "Item created successfully",
  UPDATED: "Item updated successfully",
} as const;
