import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getOrCreatePublishingSchedule,
  updatePublishingSchedule,
  getActivityLogsByUser,
  createActivityLog,
} from "../db";

export const settingsRouter = router({
  /**
   * Get publishing schedule for the user
   */
  getPublishingSchedule: protectedProcedure.query(async ({ ctx }) => {
    try {
      const schedule = await getOrCreatePublishingSchedule(ctx.user.id);
      return {
        success: true,
        schedule,
      };
    } catch (error) {
      throw error;
    }
  }),

  /**
   * Update publishing schedule
   */
  updatePublishingSchedule: protectedProcedure
    .input(
      z.object({
        postsPerDay: z.number().min(1).max(100).optional(),
        pinsPerDay: z.number().min(1).max(100).optional(),
        publishTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        timezone: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await updatePublishingSchedule(ctx.user.id, {
          postsPerDay: input.postsPerDay,
          pinsPerDay: input.pinsPerDay,
          publishTime: input.publishTime,
          timezone: input.timezone,
          isActive: input.isActive,
        });

        await createActivityLog({
          userId: ctx.user.id,
          action: "Updated publishing schedule",
          resourceType: "schedule",
          status: "success",
          message: "Publishing schedule updated",
        });

        return {
          success: true,
          message: "Schedule updated successfully",
        };
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Get activity logs
   */
  getActivityLogs: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const logs = await getActivityLogsByUser(ctx.user.id, input.limit);
        return {
          success: true,
          logs,
        };
      } catch (error) {
        throw error;
      }
    }),

  /**
   * Get dashboard statistics
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const logs = await getActivityLogsByUser(ctx.user.id, 100);

      const stats = {
        totalPublished: logs.filter((l) => l.status === "success" && l.action.includes("Published")).length,
        totalGenerated: logs.filter((l) => l.status === "success" && l.action.includes("Generated")).length,
        totalFailed: logs.filter((l) => l.status === "failure").length,
        successRate:
          logs.length > 0
            ? Math.round(
                ((logs.filter((l) => l.status === "success").length / logs.length) * 100)
              )
            : 0,
      };

      return {
        success: true,
        stats,
      };
    } catch (error) {
      throw error;
    }
  }),
});

