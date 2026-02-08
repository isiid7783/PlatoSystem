import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { routeExecution, RoutingMode } from "../services/routing.engine";
import { checkMonthlyBudget } from "../services/budget.service";
import { authenticate } from "../middleware/auth.middleware";
import { decrypt } from "../services/encryption.service";

const prisma = new PrismaClient();

export async function executeRoute(app: FastifyInstance) {
  app.post(
    "/execute",
    { preHandler: authenticate },
    async (request: any, reply) => {
      const userId = request.user.userId;
      const { prompt, models, mode } = request.body;

      const userKeys = await prisma.apiKey.findMany({
        where: { userId },
      });

      const apiKeys: Record<string, string> = {};

      for (const k of userKeys) {
        apiKeys[k.provider] = decrypt(k.encryptedKey);
      }

      const routingMode: RoutingMode = mode || "compare";

      const results = await routeExecution(
        prompt,
        models,
        routingMode,
        apiKeys
      );

      const totalNewCost = results.reduce(
        (sum, r) => sum + r.estimatedCostUsd,
        0
      );

      const budgetCheck = await checkMonthlyBudget(userId, totalNewCost);

      if (!budgetCheck.allowed) {
        return reply.status(403).send({
          error: "Monthly budget exceeded",
          currentUsage: budgetCheck.currentTotal,
          limit: budgetCheck.limit,
        });
      }

      for (const r of results) {
        await prisma.usageLog.create({
          data: {
            userId,
            provider: r.provider,
            model: r.model,
            inputTokens: r.inputTokens,
            outputTokens: r.outputTokens,
            totalTokens: r.totalTokens,
            costUsd: r.estimatedCostUsd,
            latencyMs: r.latencyMs,
          },
        });
      }

      return reply.send({
        mode: routingMode,
        results,
      });
    }
  );
}
