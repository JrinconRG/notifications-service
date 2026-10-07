import { env } from "./config/env";
import { createApp } from "./app";

createApp().listen(env.PORT, () => {
  console.log(`notificaciones-service escuchando en :${env.PORT}`);
});