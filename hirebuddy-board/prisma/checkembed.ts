import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Explicitly type the results
  const columnCheck = await prisma.$queryRawUnsafe<Array<{ column_name: string; data_type: string }>>(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'Job' AND column_name = 'embedding';
  `);

  if (columnCheck.length > 0) {
    console.log('✅ Embedding column exists:', columnCheck);
  } else {
    console.log('❌ Embedding column does NOT exist');
  }

  const sampleEmbedding = await prisma.$queryRawUnsafe<Array<{ embedding: number[] }>>(`
    SELECT embedding FROM "Job" WHERE embedding IS NOT NULL LIMIT 1;
  `);

  if (sampleEmbedding.length > 0) {
    console.log('🧠 Sample embedding data:', sampleEmbedding[0].embedding.slice(0, 5), '...');
  } else {
    console.log('⚠️ No embedding data found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());