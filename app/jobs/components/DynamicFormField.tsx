"use client";

import { Id } from "@/convex/_generated/dataModel";
import AvailabilityGrid from "./AvailabilityGrid";

type FormField = {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
  order: number;
  type: "text" | "textarea" | "select" | "availability" | "date";
  options?: string[];
  locations?: Id<"locations">[];
};

interface DynamicFormFieldProps {
  field: FormField;
  value: string | Availability | Id<"locations"> | "";
  onChange: (value: string | Availability | Id<"locations">) => void;
  error?: string;
  locations?: Array<{ _id: Id<"locations">; name: string }>;
  selectedLocationId?: Id<"locations"> | "";
}

type Availability = {
  monday: { am: boolean; pm: boolean };
  tuesday: { am: boolean; pm: boolean };
  wednesday: { am: boolean; pm: boolean };
  thursday: { am: boolean; pm: boolean };
  friday: { am: boolean; pm: boolean };
  saturday: { am: boolean; pm: boolean };
  sunday: { am: boolean; pm: boolean };
};

export default function DynamicFormField({
  field,
  value,
  onChange,
  error,
  locations = [],
  selectedLocationId,
}: DynamicFormFieldProps) {
  // Check if field should be shown for selected location
  if (field.locations && field.locations.length > 0) {
    if (!selectedLocationId || !field.locations.includes(selectedLocationId)) {
      return null;
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange(e.target.value as string | Id<"locations">);
  };

  const baseInputClasses = `w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all duration-200 ${
    error ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300 focus:border-red-500"
  }`;

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            className={baseInputClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <input
              type="date"
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              max={field.key === "dateOfBirth" ? new Date().toISOString().split("T")[0] : undefined}
              className={baseInputClasses}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            rows={field.key === "workChallengeQuestion" ? 6 : field.key === "currentAddress" ? 3 : 4}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className={`${baseInputClasses} resize-none`}
          />
          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      );

    case "select":
      if (field.key === "locationId") {
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {locations.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  No locations are currently hiring. Please check back later.
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <select
                    value={typeof value === "string" ? value : (value ? String(value) : "")}
                    onChange={handleChange}
                    className={`${baseInputClasses} appearance-none pr-10`}
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 text-sm text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        );
      }

      // For desiredPosition and other select fields
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <select
              value={typeof value === "string" ? value : ""}
              onChange={handleChange}
              className={`${baseInputClasses} appearance-none pr-10`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      );

    case "availability":
      const defaultAvail: Availability = {
        monday: { am: false, pm: false },
        tuesday: { am: false, pm: false },
        wednesday: { am: false, pm: false },
        thursday: { am: false, pm: false },
        friday: { am: false, pm: false },
        saturday: { am: false, pm: false },
        sunday: { am: false, pm: false },
      };
      return (
        <div>
          <AvailabilityGrid
            value={typeof value === "object" && "monday" in value ? value as Availability : defaultAvail}
            onChange={(avail) => onChange(avail)}
            error={error}
          />
        </div>
      );

    default:
      return null;
  }
}

