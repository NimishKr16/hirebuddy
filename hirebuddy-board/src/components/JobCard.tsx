"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    jobTitle: string;
    companyName: string;
    location: string;
    applyLink: string;
    createdAt: Date;
    job_description: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Card className="w-full max-w-3xl shadow-lg transition hover:shadow-xl border border-gray-200">
      <CardHeader className="text-sm text-muted-foreground">
        {dayjs(job.createdAt).format("MMM D, YYYY")}
      </CardHeader>

      <CardContent className="space-y-0.5">
        <h2 className="text-2xl font-bold text-neutral-900">
          {job.jobTitle.startsWith("1. ") ? job.jobTitle.slice(3) : job.jobTitle}
        </h2>
        <p className="text-lg font-semibold text-neutral-700">
          {job.companyName}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {job.location}
        </p>

        <div className="flex justify-between items-center mt-3">
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-neutral-900"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? "Hide" : "More"}
            <ChevronDown
              className={`transition-transform duration-300 ${
                showDescription ? "rotate-180" : "rotate-0"
              }`}
              size={16}
            />
          </Button>

          <Button
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-200"
            asChild
          >
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
              Apply
            </a>
          </Button>
        </div>

        {showDescription && (
          <div className="text-sm text-gray-600 mt-2 whitespace-pre-line">
            <p>{job.job_description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
