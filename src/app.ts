import express from "express";
import { env } from "./config/env";
import { NotificationService } from "./application/services/notification.service";
import { pool } from "./infrastructure/database/database";
import { PgDeviceTokenRepository } from "./infrastructure/database/repositories/device-token.repository";
import { FirebasePushSender } from "./infrastructure/firebase/firebase-admin";
import { NotificationController } from "./presentation/controllers/notification.controller";
import { internalKeyMiddleware } from "./presentation/middlewares/internal-key.middleware";
import { createNotificationRouter } from "./presentation/routes/notification.routes";

export function createApp() {
  const tokens = new PgDeviceTokenRepository(pool);
  const sender = new FirebasePushSender();
  const service = new NotificationService(tokens, sender);
  const controller = new NotificationController(service);
  const auth = internalKeyMiddleware(env.NOTIFICACIONES_API_KEY);

  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/notifications", createNotificationRouter(controller, auth));
  return app;
}