import { ENV } from "../_core/env";

/**
 * Google Custom Search API Service
 * Used for researching recipe content and ingredients
 */

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SearchResponse {
  items?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Search for recipe information using Google Custom Search
 */
export async function searchRecipeInfo(query: string, limit: number = 5): Promise<{
  success: boolean;
  results?: SearchResult[];
  error?: string;
}> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      return {
        success: false,
        error: "Google Search API credentials not configured",
      };
    }

    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.append("q", query);
    searchUrl.searchParams.append("cx", searchEngineId);
    searchUrl.searchParams.append("key", apiKey);
    searchUrl.searchParams.append("num", limit.toString());

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      const error = await response.json();
      console.error("[Google Search] Error:", error);
      return {
        success: false,
        error: error.error?.message || `HTTP ${response.status}`,
      };
    }

    const data: SearchResponse = await response.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message,
      };
    }

    const results: SearchResult[] = (data.items || []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error("[Google Search] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Search for specific recipe ingredients
 */
export async function searchIngredients(recipeName: string): Promise<{
  success: boolean;
  results?: SearchResult[];
  error?: string;
}> {
  const query = `${recipeName} recipe ingredients instructions`;
  return searchRecipeInfo(query, 3);
}

/**
 * Search for cooking techniques
 */
export async function searchCookingTechniques(technique: string): Promise<{
  success: boolean;
  results?: SearchResult[];
  error?: string;
}> {
  const query = `how to ${technique} cooking technique tips`;
  return searchRecipeInfo(query, 3);
}

/**
 * Search for recipe variations
 */
export async function searchRecipeVariations(recipeName: string): Promise<{
  success: boolean;
  results?: SearchResult[];
  error?: string;
}> {
  const query = `${recipeName} variations alternatives twists`;
  return searchRecipeInfo(query, 5);
}

