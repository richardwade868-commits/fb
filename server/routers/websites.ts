import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createWordPressSite,
  getWordPressSitesByUser,
  updateWordPressSite,
  createActivityLog,
} from "../db";
import { publishToWordPress, getWordPressSiteInfo } from "../services/wordpressService";

export const websitesRouter = router({
  /**
   * Add a new WordPress site
   */
  addWordPressSite: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Site name is required"),
        url: z.string().url("Invalid URL"),
        username: z.string().min(1, "Username is required"),
        appPassword: z.string().min(1, "App password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify credentials
        const siteInfo = await getWordPressSiteInfo(input.url, input.username, input.appPassword);

        if (!siteInfo.success) {
          throw new Error(`Failed to connect to WordPress site: ${siteInfo.error}`);
        }

        // Create site record
        await createWordPressSite({
          userId: ctx.user.id,
          name: input.name,
          url: input.url,
          username: input.username,
          appPassword: input.appPassword,
          isActive: true,
        });

        await createActivityLog({
          userId: ctx.user.id,
          action: "Added WordPress site",
          resourceType: "website",
          status: "success",
          message: `WordPress site added: ${input.name}`,
        });

        return {
          success: true,
          message: `WordPress site "${input.name}" added successfully`,
        };
      } catch (error) {
        await createActivityLog({
          userId: ctx.user.id,
          action: "Failed to add WordPress site",
          resourceType: "website",
          status: "failure",
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });

        throw error;
      }
    }),

  /**
   * Get all WordPress sites for the user
   */
  getWordPressSites: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sites = await getWordPressSitesByUser(ctx.user.id);
      // Don't return passwords
      return sites.map((site) => ({
        ...site,
        appPassword: "***hidden***",
      }));
    } catch (error) {
      throw error;
    }
  }),

  /**
   * Update WordPress site
   */
  updateWordPressSite: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await updateWordPressSite(input.id, {
          name: input.name,
          isActive: input.isActive,
        });

        await createActivityLog({
          userId: ctx.user.id,
          action: "Updated WordPress site",
          resourceType: "website",
          resourceId: input.id,
          status: "success",
          message: "WordPress site updated",
        });

        return { success: true };
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Test WordPress connection
   */
  testWordPressConnection: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        username: z.string(),
        appPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await getWordPressSiteInfo(input.url, input.username, input.appPassword);

        await createActivityLog({
          userId: ctx.user.id,
          action: "Tested WordPress connection",
          resourceType: "website",
          status: result.success ? "success" : "failure",
          message: result.success
            ? `Connected to: ${result.siteName}`
            : `Connection failed: ${result.error}`,
        });

        return result;
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Publish a blog post to WordPress
   */
  publishToWordPress: protectedProcedure
    .input(
      z.object({
        siteId: z.number(),
        title: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Get site credentials
        const site = await (async () => {
          const sites = await getWordPressSitesByUser(ctx.user.id);
          return sites.find((s) => s.id === input.siteId);
        })();

        if (!site) {
          throw new Error("WordPress site not found");
        }

        // Publish post
        const result = await publishToWordPress(site.url, site.username, site.appPassword || "", {
          title: input.title,
          content: input.content,
          excerpt: input.excerpt || "",
          status: "publish",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to publish post");
        }

        await createActivityLog({
          userId: ctx.user.id,
          action: "Published blog post to WordPress",
          resourceType: "post",
          status: "success",
          message: `Post published: ${input.title}`,
          metadata: JSON.stringify({ postId: result.postId, url: result.url }),
        });

        return {
          success: true,
          postId: result.postId,
          url: result.url,
          message: "Post published successfully",
        };
      } catch (error) {
        await createActivityLog({
          userId: ctx.user.id,
          action: "Failed to publish blog post",
          resourceType: "post",
          status: "failure",
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });

        throw error;
      }
    }),
});

