import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool, query } from "./db.js";

dotenv.config();

const SAMPLE_CANDIDATES = [
  {
    name: "Mateo Rossi",
    category: "development-automation",
    title: "Senior Full Stack & Distributed Systems Engineer",
    country: "Argentina",
    flag: "🇦🇷",
    region: "LATAM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 8,
    seniority: "Senior",
    primaryStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    secondarySkills: ["GraphQL", "Redis", "Docker", "Tailwind CSS"],
    hourlyRate: 38,
    annualSalary: 58000,
    usEquivalentSalary: 175000,
    timezone: "EST (UTC-3) - 100% overlap with US East",
    englishLevel: "C2 Native-like",
    matchScore: 98,
    bio: "Former tech lead at a LatAm fintech startup. Specializes in high-throughput microservices and real-time React applications.",
    vettedBadgeDate: "Vetted Jan 2026",
    highlights: ["Top 1% code test score", "Ex-fintech tech lead", "System design expert"],
    featuredProject: {
      title: "High-volume payment gateway integration",
      description: "Engineered a multi-currency checkout system handling 1.2M transactions/day at 99.99% uptime.",
      tech: ["React", "Node.js", "Redis", "PostgreSQL"],
    },
    availableFrom: "Immediate",
  },
  {
    name: "Elena Kowalska",
    category: "development-automation",
    title: "Staff Frontend Engineer & Design Systems Architect",
    country: "Poland",
    flag: "🇵🇱",
    region: "Eastern Europe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 9,
    seniority: "Lead / Architect",
    primaryStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    secondarySkills: ["Storybook", "Jest", "Cypress", "Figma to Code"],
    hourlyRate: 42,
    annualSalary: 64000,
    usEquivalentSalary: 185000,
    timezone: "CET (UTC+1) - 5hr overlap with US East",
    englishLevel: "C2 Native-like",
    matchScore: 99,
    bio: "Focused on web performance, accessibility, and micro-frontend architecture. Built design systems used across 40+ product teams.",
    vettedBadgeDate: "Vetted Feb 2026",
    highlights: ["Lighthouse 100 performance", "Ex-senior frontend lead", "Open source contributor"],
    featuredProject: {
      title: "Enterprise fintech component library",
      description: "Built an accessible React UI library that cut dev time by 40% across 12 product modules.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Storybook"],
    },
    availableFrom: "Immediate",
  },
  {
    name: "Rahul Verma",
    category: "development-automation",
    title: "DevOps & Cloud Infrastructure Engineer",
    country: "India",
    flag: "🇮🇳",
    region: "South Asia",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 7,
    seniority: "Senior",
    primaryStack: ["AWS", "Kubernetes", "Terraform", "Docker"],
    secondarySkills: ["CI/CD", "Prometheus", "Python", "Go"],
    hourlyRate: 32,
    annualSalary: 46000,
    usEquivalentSalary: 155000,
    timezone: "IST (UTC+5:30) - Evening overlap with US East",
    englishLevel: "C1 Fluent",
    matchScore: 96,
    bio: "Runs production infrastructure for high-traffic SaaS platforms. Deep experience with multi-region Kubernetes deployments.",
    vettedBadgeDate: "Vetted Mar 2026",
    highlights: ["AWS certified solutions architect", "Cut infra cost 35% at last role", "On-call reliability specialist"],
    featuredProject: {
      title: "Multi-region Kubernetes migration",
      description: "Migrated a monolith to a multi-region K8s cluster, improving uptime to 99.95%.",
      tech: ["Kubernetes", "Terraform", "AWS", "Prometheus"],
    },
    availableFrom: "In 1 Week",
  },
  {
    name: "Ana Beatriz Souza",
    category: "development-automation",
    title: "Senior Backend Engineer (Python/Django)",
    country: "Brazil",
    flag: "🇧🇷",
    region: "LATAM",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 6,
    seniority: "Senior",
    primaryStack: ["Python", "Django", "PostgreSQL", "Celery"],
    secondarySkills: ["FastAPI", "Docker", "AWS", "Redis"],
    hourlyRate: 34,
    annualSalary: 50000,
    usEquivalentSalary: 150000,
    timezone: "BRT (UTC-3) - Full overlap with US East",
    englishLevel: "C1 Fluent",
    matchScore: 95,
    bio: "Backend specialist for marketplaces and billing systems, with a strong focus on data integrity and API design.",
    vettedBadgeDate: "Vetted Jan 2026",
    highlights: ["Built billing engine for 200k+ users", "Django REST framework expert", "Mentors junior engineers"],
    featuredProject: {
      title: "Subscription billing engine",
      description: "Designed a usage-based billing engine processing $2M+ in monthly recurring revenue.",
      tech: ["Django", "PostgreSQL", "Celery", "Stripe API"],
    },
    availableFrom: "Immediate",
  },
  {
    name: "Nguyen Minh Anh",
    category: "development-automation",
    title: "Mobile Engineer (React Native / iOS)",
    country: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 5,
    seniority: "Mid-Level",
    primaryStack: ["React Native", "TypeScript", "Swift"],
    secondarySkills: ["Firebase", "GraphQL", "Fastlane"],
    hourlyRate: 28,
    annualSalary: 40000,
    usEquivalentSalary: 135000,
    timezone: "ICT (UTC+7) - Evening overlap with US East",
    englishLevel: "C1 Fluent",
    matchScore: 93,
    bio: "Ships polished cross-platform mobile apps end to end, from architecture through App Store release.",
    vettedBadgeDate: "Vetted Apr 2026",
    highlights: ["Shipped 6 apps to production", "App Store featured app", "Strong animation/UX craft"],
    featuredProject: {
      title: "Consumer fintech mobile app",
      description: "Built a React Native app from scratch to 100k+ downloads within 6 months of launch.",
      tech: ["React Native", "TypeScript", "Firebase"],
    },
    availableFrom: "In 2 Weeks",
  },
  {
    name: "Kwame Mensah",
    category: "development-automation",
    title: "Full Stack Engineer (Node.js / React)",
    country: "Ghana",
    flag: "🇬🇭",
    region: "Africa",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    yearsExperience: 6,
    seniority: "Senior",
    primaryStack: ["Node.js", "React", "TypeScript", "PostgreSQL"],
    secondarySkills: ["AWS", "Docker", "GraphQL"],
    hourlyRate: 30,
    annualSalary: 44000,
    usEquivalentSalary: 145000,
    timezone: "GMT (UTC+0) - Strong overlap with US East and EU",
    englishLevel: "C2 Native-like",
    matchScore: 94,
    bio: "Full stack generalist who has led small engineering teams at two Africa-based startups.",
    vettedBadgeDate: "Vetted Feb 2026",
    highlights: ["Led 4-person eng team", "Full product lifecycle experience", "Strong client communication"],
    featuredProject: {
      title: "B2B logistics platform",
      description: "Built and scaled a logistics tracking platform now used by 50+ SMEs.",
      tech: ["Node.js", "React", "PostgreSQL", "AWS"],
    },
    availableFrom: "Immediate",
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@hireexact.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await query(
    `INSERT INTO admins (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'super_admin')
     ON CONFLICT (email) DO NOTHING`,
    ["HireExact Admin", adminEmail.toLowerCase(), passwordHash]
  );
  console.log(`Seeded admin user: ${adminEmail} / ${adminPassword} (change this after first login)`);

  const existing = await query("SELECT count(*)::int AS c FROM candidates");
  if (existing.rows[0].c > 0) {
    console.log("Candidates already seeded, skipping.");
  } else {
    for (const c of SAMPLE_CANDIDATES) {
      await query(
        `INSERT INTO candidates (
          name, title, category, country, flag, region, avatar_url, years_experience, seniority,
          primary_stack, secondary_skills, hourly_rate, annual_salary, us_equivalent_salary,
          timezone, english_level, match_score, bio, vetted_badge_date, highlights,
          featured_project_title, featured_project_description, featured_project_tech, available_from
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
        [
          c.name, c.title, c.category, c.country, c.flag, c.region, c.avatar, c.yearsExperience, c.seniority,
          c.primaryStack, c.secondarySkills, c.hourlyRate, c.annualSalary, c.usEquivalentSalary,
          c.timezone, c.englishLevel, c.matchScore, c.bio, c.vettedBadgeDate, c.highlights,
          c.featuredProject.title, c.featuredProject.description, c.featuredProject.tech, c.availableFrom,
        ]
      );
    }
    console.log(`Seeded ${SAMPLE_CANDIDATES.length} candidates.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
