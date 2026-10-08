import { Request, Response } from "express";
import { z } from "zod";
import { NotificationService } from "../../application/services/notification.service";

const sendSchema = z.object({
  idUsuario: z.uuid(),
  titulo: z.string().min(1),
  cuerpo: z.string().min(1),
  data: z.record(z.string(), z.string()).optional(),
});

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  send = async (req: Request, res: Response): Promise<void> => {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.flattenError(parsed.error) });
      return;
    }

    try {
      const enviados = await this.service.notifyUser(parsed.data);
      res.json({ enviados });
    } catch (err) {
      console.error("Error enviando push:", err);
      res.status(502).json({ error: "Error enviando push" });
    }
  };
}