// src/components/FilterGroup.tsx
"use client";
import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface FilterGroupProps {
  location: string | null;
  setLocation: (loc: string | null) => void;
  type: string | null;
  setType: (t: string | null) => void;
  source: string | null;
  setSource: (s: string | null) => void;
}

const locations = [
  "Bengaluru",
  "Delhi",
  "Maharashtra",
  "Hyderabad",
  "Uttar Pradesh",
];

const types = [
  { label: "In Office", value: "in-office" },
  { label: "Remote", value: "remote" },
];

const sources = [
  { label: "Indeed", value: "Indeed", disabled: false },
  { label: "LinkedIn", value: "LinkedIn", disabled: true },
];

export default function FilterGroup({
  location,
  setLocation,
  type,
  setType,
  source,
  setSource,
}: FilterGroupProps) {
  return (
    <div className="relative bg-white shadow-lg rounded-md p-4 w-72 space-y-4">
      {/* Location */}
      <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
          Location
        </label>
        <Select
          value={location ?? ""}
          onValueChange={(val) => setLocation(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
          Type
        </label>
        <Select
          value={type ?? ""}
          onValueChange={(val) => setType(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {types.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Source */}
      <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
          Source
        </label>
        <Select
          value={source ?? ""}
          onValueChange={(val) => setSource(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map(({ label, value, disabled }) => (
              <SelectItem key={value} value={value} disabled={disabled}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}