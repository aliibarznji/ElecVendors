import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export interface AuthRequest extends Request {
  vendorId?: string;
}

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.vendorId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function signToken(vendorId: string): string {
  return jwt.sign({ sub: vendorId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}
