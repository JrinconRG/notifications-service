import { DeviceTokenRepository, Notification, PushSender } from "../../domain/models/notification";
 
export class NotificationService {
  constructor(
    private readonly tokens: DeviceTokenRepository,
    private readonly sender: PushSender,
  ) {}
 
  /** Envía el push a todos los dispositivos del usuario. Retorna cuántos envíos fueron exitosos. */
  async notifyUser(notification: Notification): Promise<number> {
    const tokens = await this.tokens.findTokensByUserId(notification.idUsuario);
    if (tokens.length === 0) {
      console.log(`Usuario ${notification.idUsuario} sin dispositivos registrados`);
      return 0;
    }
 
    const result = await this.sender.send(tokens, notification);
    await this.tokens.deleteTokens(result.invalidTokens);
    return result.successCount;
  }
}
 