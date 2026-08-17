import { Router } from "express";
import { GoogleGenAI, Type } from "@google/genai";

export const aiRouter = Router();

function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

aiRouter.post("/match-talent", async (req, res) => {
  try {
    const ai = getAi();
    const { jobTitle, techStack, seniority, budgetRange, projectType, teamSize } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "AI matching key not configured. Showing pre-screened talent directory instead.",
        data: {
          summary: `HireExact matching for ${jobTitle || "Senior Developer"} (${seniority || "Senior"})`,
          roleTitle: jobTitle || "Full Stack Engineer",
          timeToHireDays: 5,
          wageBridge: {
            usMarketAvg: "$165,000/yr",
            hireExactAvg: "$54,000/yr",
            annualSavingsDollar: "$111,000",
            savingsPercentage: "67%",
            topRegions: ["LATAM", "Eastern Europe"],
          },
          candidates: [],
          roiAdvice: "Book a call with our team and we'll hand-pick three vetted candidates for this role within 3-5 business days.",
        },
      });
    }

    const prompt = `You are HireExact's AI Global Talent & Wage Bridge Advisor. Analyze the employer's hiring request and generate a structured talent match report with wage arbitrage and hiring strategy.

    Employer Request:
    - Job Title / Role: ${jobTitle || "Senior Full Stack Engineer"}
    - Required Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack || "React, Node.js, Python, PostgreSQL"}
    - Seniority Level: ${seniority || "Senior (5+ yrs)"}
    - Target Budget: ${budgetRange || "Optimized for high ROI"}
    - Project / Team Context: ${projectType || "Rapid scaling startup"}
    - Team Size to Hire: ${teamSize || 1}

    Provide a JSON response with: role summary, a wage bridge breakdown (US market avg vs HireExact avg, dollar and percentage savings, top regions), 3 realistic fictional candidate profiles (name, location, title, matchScore 90-99, hourly rate, annual salary, timezone, top skills, one-line bio highlight), and ROI advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            roleTitle: { type: Type.STRING },
            timeToHireDays: { type: Type.NUMBER },
            wageBridge: {
              type: Type.OBJECT,
              properties: {
                usMarketAvg: { type: Type.STRING },
                hireExactAvg: { type: Type.STRING },
                annualSavingsDollar: { type: Type.STRING },
                savingsPercentage: { type: Type.STRING },
                topRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["usMarketAvg", "hireExactAvg", "annualSavingsDollar", "savingsPercentage"],
            },
            candidates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  location: { type: Type.STRING },
                  title: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  hourlyRate: { type: Type.STRING },
                  annualSalary: { type: Type.STRING },
                  timezone: { type: Type.STRING },
                  topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  bioHighlight: { type: Type.STRING },
                },
                required: ["name", "location", "title", "matchScore", "hourlyRate", "annualSalary", "topSkills"],
              },
            },
            roiAdvice: { type: Type.STRING },
          },
          required: ["summary", "roleTitle", "wageBridge", "candidates", "roiAdvice"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error matching talent via Gemini:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI talent recommendation" });
  }
});
