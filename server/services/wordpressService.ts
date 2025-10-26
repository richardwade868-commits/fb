import { ENV } from "../_core/env";

/**
 * WordPress REST API Service
 * Handles publishing blog posts to WordPress sites
 */

interface WordPressPost {
  title: string;
  content: string;
  excerpt: string;
  status: "publish" | "draft" | "pending";
  categories?: number[];
  tags?: number[];
}

interface WordPressResponse {
  id: number;
  title: {
    rendered: string;
  };
  link: string;
  status: string;
}

/**
 * Publish a blog post to WordPress
 */
export async function publishToWordPress(
  siteUrl: string,
  username: string,
  appPassword: string,
  post: WordPressPost
): Promise<{
  success: boolean;
  postId?: number;
  url?: string;
  error?: string;
}> {
  try {
    // Create Basic Auth header
    const credentials = Buffer.from(`${username}:${appPassword}`).toString("base64");

    // Ensure URL ends without trailing slash
    const cleanUrl = siteUrl.replace(/\/$/, "");
    const apiUrl = `${cleanUrl}/wp-json/wp/v2/posts`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status || "publish",
        categories: post.categories || [],
        tags: post.tags || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[WordPress] Error publishing post:", error);
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    const data: WordPressResponse = await response.json();

    return {
      success: true,
      postId: data.id,
      url: data.link,
    };
  } catch (error) {
    console.error("[WordPress] Publishing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get WordPress site info
 */
export async function getWordPressSiteInfo(
  siteUrl: string,
  username: string,
  appPassword: string
): Promise<{
  success: boolean;
  siteName?: string;
  siteUrl?: string;
  error?: string;
}> {
  try {
    const credentials = Buffer.from(`${username}:${appPassword}`).toString("base64");
    const cleanUrl = siteUrl.replace(/\/$/, "");
    const apiUrl = `${cleanUrl}/wp-json`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      siteName: data.name,
      siteUrl: data.url,
    };
  } catch (error) {
    console.error("[WordPress] Site info error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update a WordPress post
 */
export async function updateWordPressPost(
  siteUrl: string,
  username: string,
  appPassword: string,
  postId: number,
  post: Partial<WordPressPost>
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const credentials = Buffer.from(`${username}:${appPassword}`).toString("base64");
    const cleanUrl = siteUrl.replace(/\/$/, "");
    const apiUrl = `${cleanUrl}/wp-json/wp/v2/posts/${postId}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("[WordPress] Update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a WordPress post
 */
export async function deleteWordPressPost(
  siteUrl: string,
  username: string,
  appPassword: string,
  postId: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const credentials = Buffer.from(`${username}:${appPassword}`).toString("base64");
    const cleanUrl = siteUrl.replace(/\/$/, "");
    const apiUrl = `${cleanUrl}/wp-json/wp/v2/posts/${postId}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("[WordPress] Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

