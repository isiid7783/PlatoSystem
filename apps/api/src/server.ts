import { buildApp } from "./app";
import { ENV } from "./config/env";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      port: parseInt(ENV.PORT),
      host: "0.0.0.0",
    });

    console.log(`Plato API running on port ${ENV.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
