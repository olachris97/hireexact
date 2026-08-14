import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

export const applicationsRouter = Router();

const STATUSES = ["submitted", "screening", "vetting", "approved", "rejected"] as const;

const applicationSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  country: z.string().optional(),
  roleTitle: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  primaryStack: z.array(z.string()).default([]),
  desiredHourlyRate: z.number().positive().optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

function mapRow(row: any) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    country: row.country,
    roleTitle: row.role_title,
    yearsExperience: row.years_experience,
    primaryStack: row.primary_stack,
    desiredHourlyRate: row.desired_hourly_rate ? Number(row.desired_hourly_rate) : null,
    portfolioUrl: row.portfolio_url,
    resumeUrl: row.resume_url,
    linkedinUrl: row.linkedin_url,
    notes: row.notes,
    status: row.status,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Public: developer applies to join the vetted pool
applicationsRouter.post("/", async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const a = parsed.data;

  const result = await query(
    `INSERT INTO talent_applications
      (full_name, email, country, role_title, years_experience, primary_stack,
       desired_hourly_rate, portfolio_url, resume_url, linkedin_url, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [
      a.fullName, a.email, a.country || null, a.roleTitle || null, a.yearsExperience ?? null,
      a.primaryStack, a.desiredHourlyRate ?? null, a.portfolioUrl || null,
      a.resumeUrl || null, a.linkedinUrl || null, a.notes || null,
    ]
  );
  res.status(201).json({ application: mapRow(result.rows[0]) });
});

// Admin: list all applications, optional status filter
applicationsRouter.get("/", requireAdmin, async (req, res) => {
  const { status } = req.query;
  if (status && status !== "all") {
    const result = await query(
      "SELECT * FROM talent_applications WHERE status = $1 ORDER BY created_at DESC",
      [status]
    );
    return res.json({ applications: result.rows.map(mapRow) });
  }
  const result = await query("SELECT * FROM talent_applications ORDER BY created_at DESC");
  res.json({ applications: result.rows.map(mapRow) });
});

applicationsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const schema = z.object({
    status: z.enum(STATUSES).optional(),
    adminNotes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await query(
    `UPDATE talent_applications SET
      status = COALESCE($1, status),
      admin_notes = COALESCE($2, admin_notes),
      updated_at = now()
     WHERE id = $3 RETURNING *`,
    [parsed.data.status || null, parsed.data.adminNotes ?? null, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "Application not found" });
  res.json({ application: mapRow(result.rows[0]) });
});

applicationsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM talent_applications WHERE id = $1", [req.params.id]);
  res.status(204).send();
});
