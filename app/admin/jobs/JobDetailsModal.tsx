"use client";

import { Id } from "../../../convex/_generated/dataModel";

type JobApplication = {
  _id: Id<"jobApplications">;
  name: string;
  email: string;
  phone: string;
  position: string;
  availability: string;
  resumeUrl?: string;
  createdAt: number;
};

interface JobDetailsModalProps {
  job: JobApplication;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Job Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-sm text-gray-900">{job.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">
              <a href={`mailto:${job.email}`} className="text-blue-600 hover:underline">
                {job.email}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-sm text-gray-900">
              <a href={`tel:${job.phone}`} className="text-blue-600 hover:underline">
                {job.phone}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Position</label>
            <p className="mt-1 text-sm text-gray-900">{job.position}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Availability</label>
            <p className="mt-1 text-sm text-gray-900">{job.availability}</p>
          </div>

          {job.resumeUrl && (
            <div>
              <label className="text-sm font-medium text-gray-500">Resume</label>
              <p className="mt-1">
                <a
                  href={job.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Resume
                </a>
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Submitted</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(job.createdAt)}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

