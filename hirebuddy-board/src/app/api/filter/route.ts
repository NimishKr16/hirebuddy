import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location"); // e.g. "delhi"
  const type = searchParams.get("type");         // "remote" or "in-office"
  const source = searchParams.get("source");     // "Indeed" or "LinkedIn"

  try {
    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          // Match location if provided (case-insensitive substring match)
          location
            ? {
                location: {
                  contains: location,
                  mode: "insensitive",
                },
              }
            : {},

          // Remote/In-office match based on 'Remote' being present in location
          type === "Remote"
            ? {
                location: {
                  contains: "Remote",
                  mode: "default",
                },
              }
            : type === "in-office"
            ? {
                location: {
                  not: {
                    contains: "Remote",
                    mode: "default",
                  },
                },
              }
            : {},

          // Source match
          source ? { source: { equals: source } } : {},
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Error filtering jobs:", err);
    return NextResponse.json({ error: "Failed to filter jobs" }, { status: 500 });
  }
}