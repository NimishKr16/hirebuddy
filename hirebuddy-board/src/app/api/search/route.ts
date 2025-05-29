import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json([], { status: 200 });
  }

  // Raw SQL full-text search query
  const results = await prisma.$queryRaw`
  SELECT
    id,
    "jobTitle",
    "companyName",
    location,
    job_description,
    embedding,
    source,
    "createdAt"
  FROM "Job"
  WHERE "searchVector" @@ plainto_tsquery('english', ${query})
  ORDER BY ts_rank("searchVector", plainto_tsquery('english', ${query})) DESC
  LIMIT 50;
`;

  return NextResponse.json(results);
}