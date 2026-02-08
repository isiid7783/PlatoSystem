import Fastify from "fastify";
import cors from "@fastify/cors";

import { executeRoute } from "./routes/execute";
import { dashboardRoute } from "./routes/dashboard";
import { authRoute } from "./routes/auth";
import { apiKeysRoute } from "./routes/apiKeys";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await authRoute(app);
  await apiKeysRoute(app);
  await executeRoute(app);
  await dashboardRoute(app);

  return app;
}
