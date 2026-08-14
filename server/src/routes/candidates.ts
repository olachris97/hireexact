import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

export const candidatesRouter = Router();

function mapRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    category: row.category || 'development-automation',
    country: row.country,
    flag: row.flag,
    region: row.region,
    avatar: row.avatar_url,
    yearsExperience: row.years_experience,
    seniority: row.seniority,
    primaryStack: row.primary_stack,
    secondarySkills: row.secondary_skills,
    hourlyRate: Number(row.hourly_rate),
    annualSalary: Number(row.annual_salary),
    usEquivalentSalary: Number(row.us_equivalent_salary),
    timezone: row.timezone,
    englishLevel: row.english_level,
    matchScore: row.match_score,
    bio: row.bio,
    vettedBadgeDate: row.vetted_badge_date,
    highlights: row.highlights,
    featuredProject: {
      title: row.featured_project_title,
      description: row.featured_project_description,
      tech: row.featured_project_tech,
    },
    availableFrom: row.available_from,
    isPublished: row.is_published,
  };
}

// Public: list published candidates, with optional filters
candidatesRouter.get("/", async (req, res) => {
  const { region, stack, seniority } = req.query;
  const clauses: string[] = ["is_published = true"];
  const params: any[] = [];

  if (region && region !== "all") {
    params.push(region);
    clauses.push(`region = $${params.length}`);
  }
  if (seniority && seniority !== "all") {
    params.push(seniority);
    clauses.push(`seniority = $${params.length}`);
  }
  if (stack) {
    params.push(`%${String(stack).toLowerCase()}%`);
    clauses.push(
      `EXISTS (SELECT 1 FROM unnest(primary_stack || secondary_skills) s WHERE lower(s) LIKE $${params.length})`
    );
  }

  const sql = `SELECT * FROM candidates WHERE ${clauses.join(" AND ")} ORDER BY match_score DESC, created_at DESC LIMIT 60`;
  const result = await query(sql, params);
  res.json({ candidates: result.rows.map(mapRow) });
});

// Admin: list all candidates including unpublished (must be registered before "/:id")
candidatesRouter.get("/admin/all", requireAdmin, async (_req, res) => {
  const result = await query("SELECT * FROM candidates ORDER BY created_at DESC");
  res.json({ candidates: result.rows.map(mapRow) });
});

candidatesRouter.get("/:id", async (req, res) => {
  const result = await query("SELECT * FROM candidates WHERE id = $1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "Candidate not found" });
  res.json({ candidate: mapRow(result.rows[0]) });
});

// --- Admin-only management below ---

const candidateSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['development-automation', 'accounting-bookkeeping', 'sales-outreach', 'admin-support', 'design-creative', 'marketing-content', 'data-analytics', 'finance-operations']),
  country: z.string().min(1),
  flag: z.string().optional(),
  region: z.enum(["LATAM", "Eastern Europe", "South Asia", "Southeast Asia", "Africa"]),
  avatar: z.string().url().optional().or(z.literal("")),
  yearsExperience: z.number().int().min(0),
  seniority: z.enum(["Mid-Level", "Senior", "Lead / Architect"]),
  primaryStack: z.array(z.string()).default([]),
  secondarySkills: z.array(z.string()).default([]),
  hourlyRate: z.number().positive(),
  annualSalary: z.number().positive(),
  usEquivalentSalary: z.number().positive(),
  timezone: z.string().min(1),
  englishLevel: z.string().min(1),
  matchScore: z.number().int().min(0).max(100).default(90),
  bio: z.string().optional(),
  vettedBadgeDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  featuredProject: z
    .object({ title: z.string().optional(), description: z.string().optional(), tech: z.array(z.string()).default([]) })
    .optional(),
  availableFrom: z.enum(["Immediate", "In 1 Week", "In 2 Weeks"]).default("Immediate"),
  isPublished: z.boolean().default(true),
});

candidatesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = candidateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const c = parsed.data;
  const result = await query(
    `INSERT INTO candidates (
      name, title, category, country, flag, region, avatar_url, years_experience, seniority,
      primary_stack, secondary_skills, hourly_rate, annual_salary, us_equivalent_salary,
      timezone, english_level, match_score, bio, vetted_badge_date, highlights,
      featured_project_title, featured_project_description, featured_project_tech,
      available_from, is_published
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
    RETURNING *`,
    [
      c.name, c.title, c.category, c.country, c.flag || null, c.region, c.avatar || null, c.yearsExperience, c.seniority,
      c.primaryStack, c.secondarySkills, c.hourlyRate, c.annualSalary, c.usEquivalentSalary,
      c.timezone, c.englishLevel, c.matchScore, c.bio || null, c.vettedBadgeDate || null, c.highlights,
      c.featuredProject?.title || null, c.featuredProject?.description || null, c.featuredProject?.tech || [],
      c.availableFrom, c.isPublished,
    ]
  );
  res.status(201).json({ candidate: mapRow(result.rows[0]) });
});

candidatesRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = candidateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await query("SELECT * FROM candidates WHERE id = $1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Candidate not found" });
  const merged = { ...mapRow(existing.rows[0]), ...parsed.data };

  const result = await query(
    `UPDATE candidates SET
      name=$1, title=$2, category=$3, country=$4, flag=$5, region=$6, avatar_url=$7, years_experience=$8,
      seniority=$9, primary_stack=$10, secondary_skills=$11, hourly_rate=$12, annual_salary=$13,
      us_equivalent_salary=$14, timezone=$15, english_level=$16, match_score=$17, bio=$18,
      vetted_badge_date=$19, highlights=$20, featured_project_title=$21, featured_project_description=$22,
      featured_project_tech=$23, available_from=$24, is_published=$25, updated_at=now()
     WHERE id=$26 RETURNING *`,
    [
      merged.name, merged.title, merged.category, merged.country, merged.flag, merged.region, merged.avatar,
      merged.yearsExperience, merged.seniority, merged.primaryStack, merged.secondarySkills,
      merged.hourlyRate, merged.annualSalary, merged.usEquivalentSalary, merged.timezone,
      merged.englishLevel, merged.matchScore, merged.bio, merged.vettedBadgeDate, merged.highlights,
      merged.featuredProject?.title, merged.featuredProject?.description, merged.featuredProject?.tech,
      merged.availableFrom, merged.isPublished, req.params.id,
    ]
  );
  res.json({ candidate: mapRow(result.rows[0]) });
});

candidatesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM candidates WHERE id = $1", [req.params.id]);
  res.status(204).send();
});
