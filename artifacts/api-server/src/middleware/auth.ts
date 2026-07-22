import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return;
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server-Konfiguration unvollständig" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { sub?: string };
    if (!decoded.sub) {
      res.status(401).json({ error: "Token ungültig" });
      return;
    }
    req.userId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: "Token ungültig oder abgelaufen" });
  }
}
