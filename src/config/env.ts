import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(8083),
  SUPABASE_DB_URL: z.string().min(1),
  FIREBASE_CREDENTIALS_PATH: z.string().default("./service-account-key.json"),
  NOTIFICACIONES_API_KEY: z.string().min(16, "Usa un secreto de al menos 16 caracteres"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Variables de entorno inválidas:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;