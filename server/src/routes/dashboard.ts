import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", requireAdmin, async (_req, res) => {
  const [candidates, bookingsByStatus, applicationsByStatus, recentBookings] = await Promise.all([
    query("SELECT count(*)::int AS total, count(*) FILTER (WHERE is_published) ::int AS published FROM candidates"),
    query("SELECT status, count(*)::int AS count FROM interview_bookings GROUP BY status"),
    query("SELECT status, count(*)::int AS count FROM talent_applications GROUP BY status"),
    query("SELECT id, company_name, contact_name, status, created_at FROM interview_bookings ORDER BY created_at DESC LIMIT 5"),
  ]);

  res.json({
    candidates: candidates.rows[0],
    bookingsByStatus: bookingsByStatus.rows,
    applicationsByStatus: applicationsByStatus.rows,
    recentBookings: recentBookings.rows,
  });
});
