import { RequestHandler, Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

export function createNotificationRouter(
  controller: NotificationController,
  auth: RequestHandler,
): Router {
  const router = Router();
  router.post("/", auth, controller.send);
  return router;
}