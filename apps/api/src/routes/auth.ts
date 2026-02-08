import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const prisma = new PrismaClient();

export async function authRoute(app: FastifyInstance) {
  app.post("/register", async (request: any, reply) => {
    const { email, password } = request.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    return reply.send({ message: "User created", userId: user.id });
  });

  app.post("/login", async (request: any, reply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return reply.send({ token });
  });
}
