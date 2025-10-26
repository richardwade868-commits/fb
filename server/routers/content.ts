import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createBlogPost,
  getBlogPostsByUser,
  updateBlogPost,
  createActivityLog,
  addToContentQueue,
  getContentQueue,
} from "../db";
import { generateBlogPost, generatePinterestDescription } from "../services/geminiService";
import { searchRecipeInfo } from "../services/googleSearchService";

export const contentRouter = router({
  /**
   * Generate a new blog post using Gemini AI
   */
  generateBlogPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5, "Title must be at least 5 characters"),
        searchForIngredients: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Search for recipe information if requested
        let searchResults = null;
        if (input.searchForIngredients) {
          const search = await searchRecipeInfo(input.title, 3);
          if (search.success) {
            searchResults = search.results;
          }
        }

        // Generate content using Gemini
        const generated = await generateBlogPost(input.title);

        // Create blog post in database
        await createBlogPost({
          userId: ctx.user.id,
          title: input.title,
          content: generated.content,
          excerpt: generated.excerpt,
          ingredients: JSON.stringify(generated.ingredients),
          instructions: JSON.stringify(generated.instructions),
          status: "generated",
          generatedAt: new Date(),
          metadata: JSON.stringify({ searchResults }),
        });

        // Log activity
        await createActivityLog({
          userId: ctx.user.id,
          action: "Generated blog post",
          resourceType: "post",
          status: "success",
          message: `Generated blog post: ${input.title}`,
        });

        return {
          success: true,
          post: generated,
          message: "Blog post generated successfully",
        };
      } catch (error) {
        // Log error activity
        await createActivityLog({
          userId: ctx.user.id,
          action: "Failed to generate blog post",
          resourceType: "post",
          status: "failure",
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          errorDetails: error instanceof Error ? error.stack : undefined,
        });

        throw error;
      }
    }),

  /**
   * Get all blog posts for the current user
   */
  getBlogPosts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const posts = await getBlogPostsByUser(ctx.user.id);
      return {
        success: true,
        posts,
      };
    } catch (error) {
      throw error;
    }
  }),

  /**
   * Update blog post status
   */
  updateBlogPost: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "generating", "generated", "publishing", "published", "failed"]),
        wordpressPostId: z.string().optional(),
        publishedAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await updateBlogPost(input.id, {
          status: input.status,
          wordpressPostId: input.wordpressPostId,
          publishedAt: input.publishedAt,
        });

        await createActivityLog({
          userId: ctx.user.id,
          action: `Updated blog post status to ${input.status}`,
          resourceType: "post",
          resourceId: input.id,
          status: "success",
          message: `Blog post status updated`,
        });

        return { success: true };
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Add multiple titles to content queue
   */
  addTitlesToQueue: protectedProcedure
    .input(
      z.object({
        titles: z.array(z.string()).min(1),
        wordpressSiteId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let addedCount = 0;

        for (const title of input.titles) {
          // Create blog post first
          await createBlogPost({
            userId: ctx.user.id,
            title,
            status: "pending",
            wordpressSiteId: input.wordpressSiteId,
          });

          addedCount++;
        }

        await createActivityLog({
          userId: ctx.user.id,
          action: `Added ${input.titles.length} titles to queue`,
          resourceType: "post",
          status: "success",
          message: `${input.titles.length} blog post titles added to publishing queue`,
        });

        return {
          success: true,
          count: addedCount,
          message: `${addedCount} titles added to queue`,
        };
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Get content queue
   */
  getContentQueue: protectedProcedure.query(async ({ ctx }) => {
    try {
      const queue = await getContentQueue(ctx.user.id);
      return {
        success: true,
        queue,
      };
    } catch (error) {
      throw error;
    }
  }),

  /**
   * Search for recipe information
   */
  searchRecipes: protectedProcedure
    .input(
      z.object({
        query: z.string().min(3),
      })
    )
    .query(async ({ input }) => {
      try {
        const results = await searchRecipeInfo(input.query, 5);
        return results;
      } catch (error) {
        throw error;
      }
    }),
});

