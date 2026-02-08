import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    (request as any).user = decoded;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
