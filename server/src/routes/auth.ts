import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "../db.js";
import { signAdminToken, requireAdmin, AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email or password format" });
  }
  const { email, password } = parsed.data;

  const result = await query(
    "SELECT id, name, email, password_hash, role FROM admins WHERE email = $1",
    [email.toLowerCase()]
  );
  const admin = result.rows[0];
  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAdminToken({ id: admin.id, email: admin.email, role: admin.role });
  res.json({
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

authRouter.get("/me", requireAdmin, async (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});
