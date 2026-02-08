import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export async function dashboardRoute(app: FastifyInstance) {
  app.get(
    "/dashboard",
    { preHandler: authenticate },
    async (request: any, reply) => {
      const userId = request.user.userId;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyTotal = await prisma.usageLog.aggregate({
        _sum: {
          costUsd: true,
        },
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      const modelBreakdown = await prisma.usageLog.groupBy({
        by: ["model"],
        _sum: {
          costUsd: true,
        },
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      const usageCount = await prisma.usageLog.count({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      const avgLatency = await prisma.usageLog.aggregate({
        _avg: {
          latencyMs: true,
        },
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      return reply.send({
        monthlyTotalUsd: monthlyTotal._sum.costUsd || 0,
        modelBreakdown,
        usageCount,
        avgLatencyMs: avgLatency._avg.latencyMs || 0,
      });
    }
  );
}
