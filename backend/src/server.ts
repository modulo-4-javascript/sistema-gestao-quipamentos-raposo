import { app } from "./app";
import { initializeDatabase } from "./shared/database/migrate";

const port = Number(process.env.PORT ?? 3000);

async function startServer(): Promise<void> {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`DenkenHub API running at http://localhost:${port}/api/v1`);
    console.log(`API docs available at http://localhost:${port}/docs`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start DenkenHub API.");
  console.error(error);
  process.exit(1);
});
