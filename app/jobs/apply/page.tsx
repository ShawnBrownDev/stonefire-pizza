"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import DynamicFormField from "../components/DynamicFormField";

type Availability = {
  monday: { am: boolean; pm: boolean };
  tuesday: { am: boolean; pm: boolean };
  wednesday: { am: boolean; pm: boolean };
  thursday: { am: boolean; pm: boolean };
  friday: { am: boolean; pm: boolean };
  saturday: { am: boolean; pm: boolean };
  sunday: { am: boolean; pm: boolean };
};

const defaultAvailability: Availability = {
  monday: { am: false, pm: false },
  tuesday: { am: false, pm: false },
  wednesday: { am: false, pm: false },
  thursday: { am: false, pm: false },
  friday: { am: false, pm: false },
  saturday: { am: false, pm: false },
  sunday: { am: false, pm: false },
};

/**
 * Job application form page with full feature parity
 * Includes all required fields, availability grid, and validation
 */
export default function JobApplication() {
  const submitApplication = useMutation(api.jobApplications.submitApplication);
  const hiringLocations = useQuery(api.locations.getHiringLocations) || [];
  const formSchema = useQuery(api.jobFormSchema.get);
  
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

  // Initialize form data based on schema
  const initialFormData = useMemo(() => {
    const data: Record<string, string | Availability | Id<"locations"> | ""> = {
      locationId: "" as Id<"locations"> | "",
      availability: defaultAvailability,
    };
    
    if (formSchema) {
      (formSchema.fields as FormField[]).forEach((field) => {
        if (field.type === "availability") {
          data[field.key] = defaultAvailability;
        } else {
          data[field.key] = "";
        }
      });
    }
    
    return data;
  }, [formSchema]);
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedLocationId, setSelectedLocationId] = useState<Id<"locations"> | "">("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update form data when schema changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleFieldChange = (key: string, value: string | Availability | Id<"locations">) => {
    if (key === "locationId") {
      setSelectedLocationId(value as Id<"locations"> | "");
    }
    setFormData({
      ...formData,
      [key]: value,
    });
    // Clear error for this field
    if (fieldErrors[key]) {
      setFieldErrors({ ...fieldErrors, [key]: "" });
    }
  };

  const validateForm = (): boolean => {
    if (!formSchema) return false;
    
    const errors: Record<string, string> = {};
    const enabledFields = (formSchema.fields as FormField[]).filter((f) => f.enabled);
    
    // Filter fields based on selected location
    const visibleFields = enabledFields.filter((field) => {
      if (!field.locations || field.locations.length === 0) return true;
      return selectedLocationId && field.locations.includes(selectedLocationId);
    });
    
    const requiredFields = visibleFields.filter((f) => f.required);
    
    for (const field of requiredFields) {
      const value = formData[field.key];
      
      if (field.type === "availability") {
        if (!value || typeof value !== "object") {
          errors[field.key] = `${field.label} is required`;
        } else {
          const availability = value as Availability;
          const hasAvailability = Object.values(availability).some(
            (day) => day?.am || day?.pm
          );
          if (!hasAvailability) {
            errors[field.key] = `${field.label} is required`;
          }
        }
      } else if (!value || (typeof value === "string" && !value.trim())) {
        errors[field.key] = `${field.label} is required`;
      }
    }
    
    // Validate email format
    const emailValue = formData.emailAddress;
    if (emailValue && typeof emailValue === "string" && !emailValue.includes("@")) {
      errors.emailAddress = "Valid email address is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // Build submission data from schema
      const submissionData: Record<string, string | Availability | Id<"locations"> | undefined> = {};
      
      if (formSchema) {
        const enabledFields = (formSchema.fields as FormField[]).filter((f) => f.enabled);
        for (const field of enabledFields) {
          // Check location restriction
          if (field.locations && field.locations.length > 0) {
            if (!selectedLocationId || !field.locations.includes(selectedLocationId)) {
              continue; // Skip fields not applicable to this location
            }
          }
          
          const value = formData[field.key];
          if (field.type === "availability") {
            submissionData[field.key] = value as Availability;
          } else if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed || field.required) {
              submissionData[field.key] = trimmed || undefined;
            }
          } else {
            submissionData[field.key] = value;
          }
        }
      }
      
      // Ensure locationId is included
      submissionData.locationId = formData.locationId as Id<"locations">;
      submissionData.availability = formData.availability;

      await submitApplication(submissionData as Parameters<typeof submitApplication>[0]);

      setStatus("success");
      // Reset form
      setFormData(initialFormData);
      setSelectedLocationId("");
    } catch (error) {
      console.error("Error submitting job application:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "Failed to submit application. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Join Our Team</h1>
              <p className="text-gray-600 mt-1">Stonefire Pizza - Career Opportunities</p>
            </div>
            <div className="hidden md:block">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">We&apos;re Hiring!</h2>
              <p className="text-red-50 text-lg leading-relaxed">
                Join the Stonefire Pizza family and be part of a team that&apos;s passionate about creating amazing food experiences. 
                We&apos;re looking for dedicated individuals who share our commitment to quality and customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {status === "success" ? (
            <div className="text-center py-16 px-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for your interest in joining Stonefire Pizza. We&apos;ve received your application and will review it carefully. 
                Our team will be in touch soon!
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Another Application
              </button>
            </div>
          ) : !formSchema ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading application form...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
              {/* Render fields dynamically based on schema */}
              {(formSchema.fields as FormField[])
                .filter((field) => field.enabled)
                .sort((a, b) => a.order - b.order)
                .map((field, index) => {
                  // Check location restriction
                  if (field.locations && field.locations.length > 0) {
                    if (!selectedLocationId || !field.locations.includes(selectedLocationId)) {
                      return null;
                    }
                  }

                  // Group fields into sections
                  const sectionMap: Record<string, string> = {
                    locationId: "",
                    fullName: "Personal Information",
                    dateOfBirth: "",
                    phoneNumber: "",
                    emailAddress: "",
                    currentAddress: "",
                    desiredPosition: "Position",
                    formerEmployer1: "Employment History",
                    formerEmployer2: "",
                    references: "",
                    availability: "Availability",
                    scheduleConflicts: "Schedule Conflicts",
                    favoriteColor: "Tell Us About Yourself",
                    nicknames: "",
                    favoriteBands: "",
                    hobbies: "",
                    workChallengeQuestion: "Work Challenge Question",
                  };

                  const sectionTitle = sectionMap[field.key];
                  const prevField = index > 0 ? (formSchema.fields[index - 1] as FormField) : null;
                  const showSectionHeader = sectionTitle && (
                    index === 0 || 
                    (prevField && sectionMap[prevField.key] !== sectionTitle)
                  );

                  return (
                    <div key={field.key} className="group">
                      {showSectionHeader && (
                        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {sectionTitle === "Personal Information" && (
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Position" && (
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Employment History" && (
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Availability" && (
                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Tell Us About Yourself" && (
                                <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Schedule Conflicts" && (
                                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                              {sectionTitle === "Work Challenge Question" && (
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">
                                {sectionTitle}
                              </h2>
                              {sectionTitle === "Personal Information" && (
                                <p className="text-sm text-gray-500 mt-0.5">Tell us who you are</p>
                              )}
                              {sectionTitle === "Position" && (
                                <p className="text-sm text-gray-500 mt-0.5">What role interests you?</p>
                              )}
                              {sectionTitle === "Employment History" && (
                                <p className="text-sm text-gray-500 mt-0.5">Your work experience</p>
                              )}
                              {sectionTitle === "Availability" && (
                                <p className="text-sm text-gray-500 mt-0.5">When can you work?</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="px-8 py-6 hover:bg-gray-50/50 transition-colors">
                        <DynamicFormField
                          field={field}
                          value={formData[field.key]}
                          onChange={(value) => handleFieldChange(field.key, value)}
                          error={fieldErrors[field.key]}
                          locations={hiringLocations}
                          selectedLocationId={selectedLocationId}
                        />
                      </div>
                    </div>
                  );
                })}

              {/* Error Message */}
              {status === "error" && errorMessage && (
                <div className="px-8 py-6">
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800 mb-1">Submission Error</h3>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button Section */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">Ready to submit?</p>
                    <p>Please review all information before submitting your application.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading" || hiringLocations.length === 0}
                    className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

