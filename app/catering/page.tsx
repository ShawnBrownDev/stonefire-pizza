"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CateringFormField from "./components/CateringFormField";

type FormField = {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
  order: number;
  type: "text" | "textarea" | "select" | "radio" | "multiselect" | "date" | "time";
  options?: string[];
  showWhen?: {
    field: string;
    equals: string;
  };
};

export default function Catering() {
  const submitRequest = useMutation(api.cateringRequests.submitRequest);
  const allLocations = useQuery(api.locations.getAll) || [];
  const formSchema = useQuery(api.cateringFormSchema.get);

  // Initialize form data based on schema
  const initialFormData = useMemo(() => {
    const data: Record<string, string | string[]> = {};
    
    if (formSchema) {
      (formSchema as FormField[]).forEach((field) => {
        if (field.type === "multiselect") {
          data[field.key] = [];
        } else {
          data[field.key] = "";
        }
      });
    }
    
    return data;
  }, [formSchema]);

  const [formData, setFormData] = useState<Record<string, string | string[]>>(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update form data when schema changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleFieldChange = (key: string, value: string | string[]) => {
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
    const enabledFields = (formSchema as FormField[]).filter((f) => f.enabled);
    
    // Filter fields based on conditional logic
    const visibleFields = enabledFields.filter((field) => {
      if (field.showWhen) {
        const dependentValue = formData[field.showWhen.field];
        return dependentValue === field.showWhen.equals;
      }
      return true;
    });
    
    const requiredFields = visibleFields.filter((f) => f.required);
    
    for (const field of requiredFields) {
      const value = formData[field.key];
      
      if (field.type === "multiselect") {
        if (!value || !Array.isArray(value) || value.length === 0) {
          errors[field.key] = `${field.label} is required`;
        }
      } else if (!value || (typeof value === "string" && !value.trim())) {
        errors[field.key] = `${field.label} is required`;
      }
    }
    
    // Validate email format
    const emailValue = formData.email;
    if (emailValue && typeof emailValue === "string" && !emailValue.includes("@")) {
      errors.email = "Valid email address is required";
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
      const submissionData: Record<string, string | string[] | undefined> = {};
      
      if (formSchema) {
        const enabledFields = (formSchema as FormField[]).filter((f) => f.enabled);
        for (const field of enabledFields) {
          // Check conditional visibility
          if (field.showWhen) {
            const dependentValue = formData[field.showWhen.field];
            if (dependentValue !== field.showWhen.equals) {
              continue; // Skip fields not applicable
            }
          }
          
          const value = formData[field.key];
          if (field.type === "multiselect") {
            if (Array.isArray(value) && value.length > 0) {
              submissionData[field.key] = value;
            }
          } else if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed || field.required) {
              submissionData[field.key] = trimmed || undefined;
            }
          } else if (value) {
            submissionData[field.key] = value;
          }
        }
      }

      await submitRequest(submissionData as Parameters<typeof submitRequest>[0]);

      setStatus("success");
      // Reset form
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting catering request:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "Failed to submit request. Please try again."
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
              <h1 className="text-3xl font-bold text-gray-900">Catering & Large Orders</h1>
              <p className="text-gray-600 mt-1">Stonefire Pizza - Let us cater your next event</p>
            </div>
            <div className="hidden md:block">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Perfect for Your Event</h2>
              <p className="text-red-50 text-lg leading-relaxed">
                Whether it&apos;s a corporate lunch, family gathering, or special celebration, 
                we&apos;ll make your event memorable with our delicious wood-fired pizzas and fresh ingredients.
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
                Request Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for your catering request. We&apos;ve received your information and will contact you soon to confirm the details.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Another Request
              </button>
            </div>
          ) : !formSchema ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading form...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
              {/* Render fields dynamically based on schema */}
              {(formSchema as FormField[])
                .filter((field) => field.enabled)
                .sort((a, b) => a.order - b.order)
                .map((field) => {
                  // Check conditional visibility
                  if (field.showWhen) {
                    const dependentValue = formData[field.showWhen.field];
                    if (dependentValue !== field.showWhen.equals) {
                      return null;
                    }
                  }

                  return (
                    <div key={field.key} className="px-8 py-6 hover:bg-gray-50/50 transition-colors">
                      <CateringFormField
                        field={field}
                        value={formData[field.key] || (field.type === "multiselect" ? [] : "")}
                        onChange={(value) => handleFieldChange(field.key, value)}
                        error={fieldErrors[field.key]}
                        locations={allLocations}
                        formData={formData}
                      />
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
                    <p>Please review all information before submitting your request.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
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
                        <span>Submit Request</span>
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
