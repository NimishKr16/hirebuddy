// src/app/page.tsx
"use client";
import { toast } from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import JobCard from "@/components/JobCard";
import FilterGroup from "@/components/FilterGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Filter, FunnelPlus, SlidersHorizontal} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filters visibility state and ref
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  async function handleSearch() {
    if (!searchQuery.trim()) {
      // If query is empty, fetch all jobs again
      setLoading(true);
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
      return;
    }

    // Add query to search history if not duplicate and not empty
    setSearchHistory((prev) => {
      const normalized = searchQuery.trim();
      if (!normalized || prev.includes(normalized)) return prev;
      return [normalized, ...prev];
    });

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!res.ok) throw new Error("Failed to search jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHistoryClick(query: string) {
    setSearchQuery(query);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFileName(file.name);

      const formData = new FormData();
      formData.append("resume", file);

      setLoading(true);
      try {
        const res = await fetch("/api/match-resume", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to match jobs");

        const matchedJobs = await res.json();
        setJobs(matchedJobs);

        toast.success("Found relevant jobs using AI 🤖");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }

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

      {/* Search Bar with Filter Button */}
      <div className="mb-4 flex justify-center relative">
        <div className="relative flex w-full max-w-2xl">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="pl-10 py-2.5 rounded-l-lg shadow-sm border-gray-300 focus:ring-neutral-500 focus:border-neutral-500 flex-grow"
          />
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
          <Button
            variant="outline"
            className="rounded-r-lg px-4 flex items-center justify-center border-l-0"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* FilterGroup dropdown */}
        {filterOpen && (
          <div ref={filterRef} className="absolute top-full right-0 mt-2 z-50">
            <FilterGroup
              location={locationFilter}
              setLocation={setLocationFilter}
              type={typeFilter}
              setType={setTypeFilter}
              source={sourceFilter}
              setSource={setSourceFilter}
            />
          </div>
        )}
      </div>

      {/* Search History Bubbles */}
      {searchHistory.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          {searchHistory.map((query, index) => (
            <div
              key={index}
              className="flex items-center cursor-pointer select-none rounded-full bg-neutral-200 px-4 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-300 transition"
              aria-label={`Search for ${query}`}
            >
              <button
                onClick={() => handleHistoryClick(query)}
                type="button"
                className="outline-none"
              >
                {query}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchHistory((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
                type="button"
                aria-label={`Remove search query ${query}`}
                className="ml-2 text-neutral-500 hover:text-neutral-700 font-bold text-lg leading-none focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rest of your content (upload button, job list, etc.) unchanged */}
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <div className="flex justify-center w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full max-w-md text-center">
                <>
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FileText className="w-5 h-5" />
                    Upload Resume
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-center">
              <p>Find jobs tailored to your resume</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {selectedFileName && (
          <div className="mt-2 text-center text-neutral-700 text-sm">
            {selectedFileName}
          </div>
        )}
      </div>

      {/* Job List */}
      <div className="flex flex-col items-center space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full gap-2 py-10">
            <Progress
              value={progress}
              className="w-1/2 animate-pulse h-3 bg-neutral-200"
            />
            <span className="text-neutral-600 font-medium text-sm">
              Loading jobs...
            </span>
          </div>
        ) : (
          jobs.map((job: any) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </main>
  );
}
