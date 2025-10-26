import { ENV } from "../_core/env";

/**
 * Gemini API Service with automatic key rotation
 * Rotates through 10 free-tier API keys when rate limits are reached
 */

interface GeminiKeyState {
  keyIndex: number;
  requestCount: number;
  errorCount: number;
  lastUsedAt: Date;
  rateLimitReached: boolean;
}

class GeminiKeyRotationManager {
  private keyStates: Map<number, GeminiKeyState> = new Map();
  private currentKeyIndex: number = 1;
  private readonly RATE_LIMIT_THRESHOLD = 60; // Requests per minute
  private readonly ERROR_THRESHOLD = 5; // Errors before rotation

  constructor() {
    // Initialize all 10 keys
    for (let i = 1; i <= 10; i++) {
      this.keyStates.set(i, {
        keyIndex: i,
        requestCount: 0,
        errorCount: 0,
        lastUsedAt: new Date(),
        rateLimitReached: false,
      });
    }
  }

  /**
   * Get the current active API key
   */
  private getCurrentKey(): string {
    const keyEnvVar = `GEMINI_API_KEY_${this.currentKeyIndex}`;
    const key = process.env[keyEnvVar];
    if (!key) {
      throw new Error(`Gemini API key ${keyEnvVar} not found`);
    }
    return key;
  }

  /**
   * Rotate to the next available key
   */
  private rotateKey(): void {
    const currentState = this.keyStates.get(this.currentKeyIndex);
    if (currentState) {
      currentState.rateLimitReached = true;
    }

    // Find next available key
    let nextIndex = this.currentKeyIndex + 1;
    let attempts = 0;

    while (attempts < 10) {
      if (nextIndex > 10) nextIndex = 1;

      const state = this.keyStates.get(nextIndex);
      if (state && !state.rateLimitReached) {
        this.currentKeyIndex = nextIndex;
        console.log(`[Gemini] Rotated to key ${nextIndex}`);
        return;
      }

      nextIndex++;
      attempts++;
    }

    // If all keys are rate limited, reset and start from key 1
    console.warn("[Gemini] All keys rate limited, resetting rotation");
    this.keyStates.forEach((state) => {
      state.rateLimitReached = false;
      state.requestCount = 0;
      state.errorCount = 0;
    });
    this.currentKeyIndex = 1;
  }

  /**
   * Record a successful request
   */
  recordSuccess(): void {
    const state = this.keyStates.get(this.currentKeyIndex);
    if (state) {
      state.requestCount++;
      state.lastUsedAt = new Date();
    }
  }

  /**
   * Record a failed request and handle rotation
   */
  recordError(error: any): void {
    const state = this.keyStates.get(this.currentKeyIndex);
    if (state) {
      state.errorCount++;
      state.lastUsedAt = new Date();

      // Check if it's a rate limit error
      if (
        error?.message?.includes("429") ||
        error?.message?.includes("rate limit") ||
        error?.message?.includes("RESOURCE_EXHAUSTED")
      ) {
        console.warn(`[Gemini] Rate limit reached on key ${this.currentKeyIndex}`);
        this.rotateKey();
      } else if (state.errorCount >= this.ERROR_THRESHOLD) {
        console.warn(`[Gemini] Error threshold reached on key ${this.currentKeyIndex}`);
        this.rotateKey();
      }
    }
  }

  /**
   * Get current rotation status
   */
  getStatus() {
    return {
      currentKeyIndex: this.currentKeyIndex,
      keyStates: Array.from(this.keyStates.values()),
    };
  }
}

// Global instance
const rotationManager = new GeminiKeyRotationManager();

/**
 * Generate blog post content using Gemini API
 */
export async function generateBlogPost(title: string): Promise<{
  content: string;
  excerpt: string;
  ingredients: string[];
  instructions: string[];
}> {
  const apiKey = rotationManager["getCurrentKey"]();

  const prompt = `You are a professional recipe blogger. Create a detailed blog post for a recipe titled: "${title}"

Please provide the response in this exact JSON format:
{
  "content": "Full blog post content with introduction and story",
  "excerpt": "Brief 2-3 sentence excerpt",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...]
}

Make it engaging, SEO-friendly, and include cooking tips.`;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      rotationManager.recordError(error);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    rotationManager.recordSuccess();

    // Extract text from response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error("No content generated from Gemini");
    }

    // Parse JSON response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      content: result.content || "",
      excerpt: result.excerpt || "",
      ingredients: Array.isArray(result.ingredients) ? result.ingredients : [],
      instructions: Array.isArray(result.instructions) ? result.instructions : [],
    };
  } catch (error) {
    rotationManager.recordError(error);
    throw error;
  }
}

/**
 * Generate Pinterest pin description using Gemini
 */
export async function generatePinterestDescription(title: string, excerpt: string): Promise<string> {
  const apiKey = rotationManager["getCurrentKey"]();

  const prompt = `Create a compelling Pinterest pin description (max 500 characters) for this recipe:
Title: ${title}
Excerpt: ${excerpt}

Make it engaging and include relevant hashtags. Just provide the description, no JSON.`;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      rotationManager.recordError(error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    rotationManager.recordSuccess();

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    rotationManager.recordError(error);
    throw error;
  }
}

/**
 * Get rotation manager status
 */
export function getRotationStatus() {
  return rotationManager.getStatus();
}

export default rotationManager;

