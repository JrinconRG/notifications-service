export interface Notification {
  idUsuario: string;
  titulo: string;
  cuerpo: string;
  data?: Record<string, string>;
}
 
export interface PushResult {
  successCount: number;
  /** Tokens que FCM reporta como muertos y deben eliminarse. */
  invalidTokens: string[];
}
 
/** de donde salen y se limpian los tokens de dispositivo. */
export interface DeviceTokenRepository {
  findTokensByUserId(idUsuario: string): Promise<string[]>;
  deleteTokens(tokens: string[]): Promise<void>;
}
 
/** quien envia el push. Firebase */
export interface PushSender {
  send(tokens: string[], notification: Notification): Promise<PushResult>;
}
