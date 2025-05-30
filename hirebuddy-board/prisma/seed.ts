// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
// import readline from 'readline';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const prisma = new PrismaClient();

// async function main() {
//   const filePath = path.join(__dirname, '../all_jobs_2025-05-22.jsonl');
//   const fileStream = fs.createReadStream(filePath);

//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });

//   const jobs = [];

//   for await (const line of rl) {
//     if (!line.trim()) continue;

//     try {
//       const job = JSON.parse(line);
//       jobs.push({
//        jobTitle: job.job_title ?? 'No Title Provided',
//     companyName: job.company_name ?? 'Unknown Company',
//     location: job.job_location ?? 'Remote',
//     applyLink: job.apply_link ?? 'No Link Provided',
//     job_description: job.job_description ?? '',
//     source: job.source ?? 'Unknown',
//       });
//     } catch (e) {
//       console.error('Error parsing line:', line);
//     }
//   }

//   console.log(`Inserting ${jobs.length} jobs...`);
//   for (const job of jobs) {
//     await prisma.job.create({ data: job });
//   }

//   console.log('Done seeding.');
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());