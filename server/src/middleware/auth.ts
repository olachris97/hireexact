import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  admin?: { id: string; email: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function signAdminToken(admin: { id: string; email: string; role: string }) {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: "12h" });
}
