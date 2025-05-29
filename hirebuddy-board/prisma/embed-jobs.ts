// prisma/embed-jobs.ts
import { PrismaClient } from "@prisma/client";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const jobs = await prisma.job.findMany({
    where: {
      embedding: {
        equals: null, // Find jobs with no embedding at all
      },
    },
  });

  console.log(`Embedding ${jobs.length} job(s)...`);

  for (const job of jobs) {
    try {
      const result = await extractor(job.job_description, { pooling: "mean", normalize: true });
      const vector = Array.from(result.data);

      console.log(`🧠 Saving embedding of length ${vector.length} for job ID ${job.id}`);

      await prisma.job.update({
        where: { id: job.id },
        data: { embedding: vector },
      });

      console.log(`✅ Embedded job: ${job.jobTitle}`);
    } catch (error) {
      console.error(`❌ Failed to embed job ${job.id}:`, error);
    }
  }

  console.log("✨ Done embedding all jobs!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());