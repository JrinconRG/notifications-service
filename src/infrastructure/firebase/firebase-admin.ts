import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getMessaging, Messaging } from "firebase-admin/messaging";
import { env } from "../../config/env";
import { Notification, PushResult, PushSender } from "../../domain/models/notification";

const CODIGOS_TOKEN_INVALIDO = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
]);

export class FirebasePushSender implements PushSender {
  private readonly messaging: Messaging;

  constructor() {
    const contenido = env.FIREBASE_CREDENTIALS_BASE64
      ? Buffer.from(env.FIREBASE_CREDENTIALS_BASE64, "base64").toString("utf8")
      : readFileSync(env.FIREBASE_CREDENTIALS_PATH, "utf8");
    const credenciales = JSON.parse(contenido);

    initializeApp({ credential: cert(credenciales) });
    this.messaging = getMessaging();
  }

  async send(tokens: string[], notification: Notification): Promise<PushResult> {
    const resp = await this.messaging.sendEach(
      tokens.map((token) => ({
        token,
        notification: { title: notification.titulo, body: notification.cuerpo },
        data: notification.data,
        android: { priority: "high" },
      })),
    );

    const invalidTokens: string[] = [];
    resp.responses.forEach((r, i) => {
      if (r.success) return;
      if (r.error && CODIGOS_TOKEN_INVALIDO.has(r.error.code)) {
        invalidTokens.push(tokens[i]);
      } else {
        console.warn("Fallo FCM no recuperable:", r.error?.code);
      }
    });

    return { successCount: resp.successCount, invalidTokens };
  }
}