import { Pool } from "pg";
import { DeviceTokenRepository } from "../../../domain/models/notification";

export class PgDeviceTokenRepository implements DeviceTokenRepository {
  constructor(private readonly pool: Pool) {}

  async findTokensByUserId(idUsuario: string): Promise<string[]> {
    const { rows } = await this.pool.query<{ fcm_token: string }>(
      "SELECT fcm_token FROM public.dispositivos_fcm WHERE id_usuario = $1",
      [idUsuario],
    );
    return rows.map((r) => r.fcm_token);
  }

  async deleteTokens(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    await this.pool.query("DELETE FROM public.dispositivos_fcm WHERE fcm_token = ANY($1)", [tokens]);
  }
}