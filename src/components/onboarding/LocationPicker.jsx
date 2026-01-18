"use client";
import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  "Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Hyderabad, India",
  "Remote"
];

const LocationPicker = ({ selectedLocation, setLocation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      {CITIES.map((city) => (
        <button
          key={city}
          onClick={() => setLocation(city)}
          className={cn(
            "relative p-6 rounded-2xl border flex items-center gap-4 transition-all duration-300",
            selectedLocation === city
              ? "bg-neon-blue/10 border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.2)]"
              : "bg-surface-highlight border-white/5 hover:border-white/20"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            selectedLocation === city ? "bg-neon-blue text-black" : "bg-white/5 text-white/50"
          )}>
            <MapPin size={20} />
          </div>
          <span className={cn(
            "text-lg font-bold",
            selectedLocation === city ? "text-white" : "text-white/60"
          )}>
            {city}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LocationPicker;
