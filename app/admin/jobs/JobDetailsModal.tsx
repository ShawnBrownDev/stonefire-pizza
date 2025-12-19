"use client";

import { Id } from "../../../convex/_generated/dataModel";

type JobApplication = {
  _id: Id<"jobApplications">;
  locationId?: Id<"locations"> | undefined;
  location: { name: string; slug: string } | null;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  emailAddress: string;
  currentAddress: string;
  desiredPosition: string;
  formerEmployer1: string;
  formerEmployer2?: string;
  references: string;
  availability: {
    monday: { am: boolean; pm: boolean };
    tuesday: { am: boolean; pm: boolean };
    wednesday: { am: boolean; pm: boolean };
    thursday: { am: boolean; pm: boolean };
    friday: { am: boolean; pm: boolean };
    saturday: { am: boolean; pm: boolean };
    sunday: { am: boolean; pm: boolean };
  };
  scheduleConflicts: string;
  favoriteColor?: string;
  nicknames?: string;
  favoriteBands?: string;
  hobbies?: string;
  workChallengeQuestion: string;
  createdAt: number;
};

interface JobDetailsModalProps {
  job: JobApplication;
  onClose: () => void;
}

const DAYS = [
  { key: "monday" as const, label: "Monday" },
  { key: "tuesday" as const, label: "Tuesday" },
  { key: "wednesday" as const, label: "Wednesday" },
  { key: "thursday" as const, label: "Thursday" },
  { key: "friday" as const, label: "Friday" },
  { key: "saturday" as const, label: "Saturday" },
  { key: "sunday" as const, label: "Sunday" },
];

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

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-8 py-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {job.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{job.fullName}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{job.emailAddress}</p>
              </div>
            </div>
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job.location.name}</span>
                {job.desiredPosition && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.desiredPosition}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                  <p className="mt-2 text-sm font-medium text-gray-900">{job.fullName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  <p className="mt-2 text-sm font-medium text-gray-900">{formatDateOfBirth(job.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <p className="mt-2 text-sm">
                    <a href={`mailto:${job.emailAddress}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      {job.emailAddress}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <p className="mt-2 text-sm">
                    <a href={`tel:${job.phoneNumber}`} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      {job.phoneNumber}
                    </a>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Address</label>
                  <p className="mt-2 text-sm text-gray-900">{job.currentAddress}</p>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Position
              </h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Desired Position</label>
                <p className="mt-2 text-sm font-medium text-gray-900">{job.desiredPosition}</p>
              </div>
            </div>

            {/* Employment History */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Employment History
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Former Employer 1</label>
                  <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.formerEmployer1}</p>
                </div>
                {job.formerEmployer2 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Former Employer 2</label>
                    <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.formerEmployer2}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">References</label>
                  <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.references}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Availability
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Day
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Morning
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Evening
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {DAYS.map((day) => (
                      <tr key={day.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-200">
                          {day.label}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {job.availability[day.key].am ? (
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {job.availability[day.key].pm ? (
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Schedule Conflicts */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Schedule Conflicts
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.scheduleConflicts || "None specified"}</p>
            </div>

            {/* Personality Questions */}
            {(job.favoriteColor || job.nicknames || job.favoriteBands || job.hobbies) && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {job.favoriteColor && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Favorite Color</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{job.favoriteColor}</p>
                    </div>
                  )}
                  {job.nicknames && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nicknames</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{job.nicknames}</p>
                    </div>
                  )}
                  {job.favoriteBands && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Favorite Bands</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{job.favoriteBands}</p>
                    </div>
                  )}
                  {job.hobbies && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hobbies</label>
                      <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.hobbies}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Challenge Question */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Work Challenge Question
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{job.workChallengeQuestion}</p>
            </div>

            {/* Submission Info */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Application Submitted</label>
                  <p className="mt-2 text-sm font-semibold text-blue-900">{formatDate(job.createdAt)}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Application ID</div>
                  <p className="mt-2 text-xs font-mono text-blue-700">{job._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}