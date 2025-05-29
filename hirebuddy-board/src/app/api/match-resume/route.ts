import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pipeline } from "@xenova/transformers";
import { cosineSimilarity } from "@/lib/cosineSim";
import { extractTextFromBuffer } from "@/lib/resumeParser";

// Required for form-data parsing
import formidable from "formidable";
import { promisify } from "util";
import fs from "fs";

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse form data (Next.js App Router uses native Request)
async function parseFormData(req: Request): Promise<Buffer> {
  const form = formidable({ multiples: false });
  const reqBody = await (req as any).formData();

  const file = reqBody.get("resume");
  if (!file || typeof file === "string") throw new Error("Invalid file");

  // Convert Blob to Buffer
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  try {
    const buffer = await parseFormData(req);

    const resumeText = await extractTextFromBuffer(buffer);
    if (!resumeText) {
      return NextResponse.json({ error: "Resume text extraction failed" }, { status: 400 });
    }

    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const embeddingResult = await embedder(resumeText, {
      pooling: "mean",
      normalize: true,
    });

    const resumeEmbedding = Array.from(embeddingResult.data);

    const jobs = await prisma.job.findMany();
    const filteredJobs = jobs.filter((job: { embedding: string | any[]; }) => job.embedding && job.embedding.length > 0);

    const scoredJobs = filteredJobs
      .map((job: any) => ({
        job,
        score: cosineSimilarity(resumeEmbedding, job.embedding),
      })) as Array<{ job: typeof filteredJobs[0]; score: number }>;

    const topJobs = scoredJobs
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ job }) => job);

    return NextResponse.json(topJobs);
  } catch (err) {
    console.error("Resume matching failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}