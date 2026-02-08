import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { encrypt } from "../services/encryption.service";

const prisma = new PrismaClient();

export async function apiKeysRoute(app: FastifyInstance) {
  app.post(
    "/apikeys",
    { preHandler: authenticate },
    async (request: any, reply) => {
      const userId = request.user.userId;
      const { provider, apiKey } = request.body;

      if (!provider || !apiKey) {
        return reply.status(400).send({ error: "Invalid request" });
      }

      const encryptedKey = encrypt(apiKey);

      await prisma.apiKey.upsert({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
        update: {
          encryptedKey,
        },
        create: {
          userId,
          provider,
          encryptedKey,
        },
      });

      return reply.send({ message: "API key saved" });
    }
  );
}
