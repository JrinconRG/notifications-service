import { timingSafeEqual } from "node:crypto";
import { NextFunction, Request, Response } from "express";

/** Protege los endpoints para que solo los llamen otros microservicios  */
export function internalKeyMiddleware(expectedKey: string) {
  const expected = Buffer.from(expectedKey);

  return (req: Request, res: Response, next: NextFunction): void => {
    const received = Buffer.from(req.header("x-internal-key") ?? "");
    const valida = received.length === expected.length && timingSafeEqual(received, expected);
    if (!valida) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }
    next();
  };
}