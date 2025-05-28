// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFileName("");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-neutral-800">
        Hirebuddy
      </h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 py-2.5 rounded-lg shadow-sm border-gray-300 focus:ring-neutral-500 focus:border-neutral-500"
          />
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="mb-10 flex justify-center items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <label htmlFor="resume-upload" className="cursor-pointer">
              <button className="flex items-center gap-3 rounded-full px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
                Upload Resume
              </button>
            </label>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Find jobs tailored to your resume</p>
          </TooltipContent>
        </Tooltip>
        <span className="text-gray-700 font-medium truncate max-w-xs">{selectedFileName}</span>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Job List */}
      <div className="flex flex-col items-center space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full gap-2 py-10">
            <Progress value={progress} className="w-1/2 animate-pulse h-3 bg-neutral-200" />
            <span className="text-neutral-600 font-medium text-sm">Loading jobs...</span>
          </div>
        ) : (
          jobs.map((job: any) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </main>
  );
}