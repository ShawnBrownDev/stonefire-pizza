"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Catering request form page
 * Client component that submits to Convex mutation
 * Includes validation and loading/success states
 */
export default function Catering() {
  const submitRequest = useMutation(api.cateringRequests.submitRequest);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    notes: "",
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!formData.eventDate) {
      setErrorMessage("Event date is required");
      return false;
    }
    if (!formData.guestCount.trim()) {
      setErrorMessage("Guest count is required");
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
      await submitRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        eventDate: formData.eventDate,
        guestCount: formData.guestCount.trim(),
        notes: formData.notes.trim() || undefined,
      });

      setStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        guestCount: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting catering request:", error);
      setStatus("error");
      setErrorMessage("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Catering Request
          </h1>
          <p className="text-xl text-neutral-700">
            Let us make your event special with our wood-fired pizzas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Request Submitted!
              </h2>
              <p className="text-neutral-700 mb-6">
                We've received your catering request and will contact you soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Name *
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
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Event Date *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="guestCount"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Expected Guest Count *
                </label>
                <input
                  type="text"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  placeholder="e.g., 25-30"
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
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
                {status === "loading" ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

