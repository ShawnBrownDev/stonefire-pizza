"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Job application form page
 * Client component that submits to Convex mutation
 * Includes validation and loading/success states
 * Note: Resume upload would require file storage integration (e.g., Convex file storage)
 */
export default function JobApplication() {
  const submitApplication = useMutation(api.jobApplications.submitApplication);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    availability: "",
    resumeUrl: "",
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Valid email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required");
      return false;
    }
    if (!formData.position.trim()) {
      setErrorMessage("Please select a position");
      return false;
    }
    if (!formData.availability.trim()) {
      setErrorMessage("Availability information is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await submitApplication({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        availability: formData.availability.trim(),
        resumeUrl: formData.resumeUrl.trim() || undefined,
      });

      setStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        availability: "",
        resumeUrl: "",
      });
    } catch (error) {
      console.error("Error submitting job application:", error);
      setStatus("error");
      setErrorMessage("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Job Application
          </h1>
          <p className="text-xl text-neutral-700">
            Tell us about yourself and why you&apos;d like to join our team
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-neutral-700 mb-6">
                Thank you for your interest. We&apos;ll review your application and get back to you soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Position Applying For *
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select a position</option>
                  <option value="Pizza Chef">Pizza Chef</option>
                  <option value="Server">Server</option>
                  <option value="Delivery Driver">Delivery Driver</option>
                  <option value="Kitchen Assistant">Kitchen Assistant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Availability *
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g., Monday-Friday evenings, weekends available"
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="resumeUrl"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Resume URL (Optional)
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-neutral-600">
                  Link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>

              {status === "error" && errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                {status === "loading" ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

