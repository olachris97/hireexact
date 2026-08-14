import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

export const bookingsRouter = Router();

const STATUSES = ["new", "contacted", "interview_scheduled", "offer_sent", "hired", "closed_lost"] as const;

const bookingSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  roleTitle: z.string().optional(),
  candidateId: z.string().uuid().optional().nullable(),
  candidateName: z.string().optional(),
  teamSize: z.number().int().positive().optional(),
  budgetRange: z.string().optional(),
  preferredTimezone: z.string().optional(),
  message: z.string().optional(),
});

function mapRow(row: any) {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    roleTitle: row.role_title,
    candidateId: row.candidate_id,
    candidateName: row.candidate_name_snapshot,
    teamSize: row.team_size,
    budgetRange: row.budget_range,
    preferredTimezone: row.preferred_timezone,
    message: row.message,
    status: row.status,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Public: submit a "book interview / start a hire" request
bookingsRouter.post("/", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const b = parsed.data;

  const result = await query(
    `INSERT INTO interview_bookings
      (company_name, contact_name, email, phone, role_title, candidate_id, candidate_name_snapshot,
       team_size, budget_range, preferred_timezone, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [
      b.companyName, b.contactName, b.email, b.phone || null, b.roleTitle || null,
      b.candidateId || null, b.candidateName || null, b.teamSize || null,
      b.budgetRange || null, b.preferredTimezone || null, b.message || null,
    ]
  );
  res.status(201).json({ booking: mapRow(result.rows[0]) });
});

// Admin: list all bookings, optional status filter
bookingsRouter.get("/", requireAdmin, async (req, res) => {
  const { status } = req.query;
  if (status && status !== "all") {
    const result = await query(
      "SELECT * FROM interview_bookings WHERE status = $1 ORDER BY created_at DESC",
      [status]
    );
    return res.json({ bookings: result.rows.map(mapRow) });
  }
  const result = await query("SELECT * FROM interview_bookings ORDER BY created_at DESC");
  res.json({ bookings: result.rows.map(mapRow) });
});

bookingsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const schema = z.object({
    status: z.enum(STATUSES).optional(),
    adminNotes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await query(
    `UPDATE interview_bookings SET
      status = COALESCE($1, status),
      admin_notes = COALESCE($2, admin_notes),
      updated_at = now()
     WHERE id = $3 RETURNING *`,
    [parsed.data.status || null, parsed.data.adminNotes ?? null, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "Booking not found" });
  res.json({ booking: mapRow(result.rows[0]) });
});

bookingsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM interview_bookings WHERE id = $1", [req.params.id]);
  res.status(204).send();
});
