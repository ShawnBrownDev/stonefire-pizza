"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import JobDetailsModal from "./JobDetailsModal";
import { Id } from "@/convex/_generated/dataModel";

// Icons
const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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
  status: "new" | "reviewed" | "interviewed" | "denied";
  hiredAt?: number;
  deniedAt?: number;
  createdAt: number;
};

export default function JobsTable() {
  const [activeTab, setActiveTab] = useState<"applications" | "hired" | "denied">("applications");
  const [selectedLocationId, setSelectedLocationId] = useState<Id<"locations"> | "all">("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<"new" | "reviewed" | "interviewed" | "denied" | "all">("all");
  
  const locations = useQuery(api.locations.getAll) || [];
  const updateStatus = useMutation(api.jobApplications.updateStatus);
  const markAsHired = useMutation(api.jobApplications.markJobAsHired);
  const undoHire = useMutation(api.jobApplications.undoHire);
  const markAsDenied = useMutation(api.jobApplications.markJobAsDenied);
  const undoDeny = useMutation(api.jobApplications.undoDeny);
  const jobs = useQuery(
    api.admin.getJobs,
    {
      locationId: selectedLocationId === "all" ? undefined : selectedLocationId,
      startDate: startDate ? new Date(startDate).getTime() : undefined,
      endDate: endDate ? new Date(endDate + "T23:59:59").getTime() : undefined,
      status: selectedStatus === "all" ? undefined : selectedStatus,
      hiredOnly: activeTab === "hired",
      deniedOnly: activeTab === "denied",
    }
  ) || [];
  
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Id<"jobApplications"> | null>(null);
  const [hiringApplication, setHiringApplication] = useState<Id<"jobApplications"> | null>(null);
  const [denyingApplication, setDenyingApplication] = useState<Id<"jobApplications"> | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSelectedLocationId("all");
    setStartDate("");
    setEndDate("");
    setSelectedStatus("all");
  };

  const hasActiveFilters = selectedLocationId !== "all" || startDate || endDate || selectedStatus !== "all";

  const handleStatusChange = async (applicationId: Id<"jobApplications">, newStatus: "new" | "reviewed" | "interviewed" | "denied") => {
    setUpdatingStatus(applicationId);
    try {
      await updateStatus({ applicationId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeny = async (applicationId: Id<"jobApplications">, e: React.MouseEvent) => {
    e.stopPropagation();
    setDenyingApplication(applicationId);
    try {
      await markAsDenied({ applicationId });
    } catch (error) {
      console.error("Failed to deny application:", error);
    } finally {
      setDenyingApplication(null);
    }
  };

  const handleUndoDeny = async (applicationId: Id<"jobApplications">, e: React.MouseEvent) => {
    e.stopPropagation();
    setDenyingApplication(applicationId);
    try {
      await undoDeny({ applicationId });
    } catch (error) {
      console.error("Failed to undo deny:", error);
    } finally {
      setDenyingApplication(null);
    }
  };

  const handleMarkAsHired = async (applicationId: Id<"jobApplications">, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiringApplication(applicationId);
    try {
      await markAsHired({ applicationId });
    } catch (error) {
      console.error("Failed to mark as hired:", error);
    } finally {
      setHiringApplication(null);
    }
  };

  const handleUndoHire = async (applicationId: Id<"jobApplications">, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiringApplication(applicationId);
    try {
      await undoHire({ applicationId });
    } catch (error) {
      console.error("Failed to undo hire:", error);
    } finally {
      setHiringApplication(null);
    }
  };

  const totalApplications = jobs.length;
  const recentApplications = jobs.filter(
    (job) => job.createdAt && job.createdAt > new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and review job applications from candidates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab("applications");
              setSelectedStatus("all");
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "applications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => {
              setActiveTab("hired");
              setSelectedStatus("all");
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "hired"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Hired
          </button>
          <button
            onClick={() => {
              setActiveTab("denied");
              setSelectedStatus("all");
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "denied"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Denied
          </button>
        </nav>
      </div>

      {/* Stats Section */}
      <div className="flex gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 min-w-[140px]">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {activeTab === "applications" ? "Active" : activeTab === "hired" ? "Hired" : "Denied"}
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalApplications}</div>
        </div>
        {activeTab === "applications" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 min-w-[140px]">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Week</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{recentApplications}</div>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className={`grid grid-cols-1 gap-4 ${activeTab === "applications" ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <LocationIcon />
                Location
              </div>
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value as Id<"locations"> | "all")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {activeTab === "applications" && (
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "new" | "reviewed" | "interviewed" | "denied" | "all")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          )}

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon />
              Start Date
              </div>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon />
              End Date
              </div>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <XIcon />
              Clear Filters
            </button>
          )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Results:</span>
              <span>{jobs.length} application{jobs.length !== 1 ? "s" : ""}</span>
            {selectedLocationId !== "all" && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{locations.find((l) => l._id === selectedLocationId)?.name}</span>
                </>
              )}
              {selectedStatus !== "all" && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{selectedStatus}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applicant
              </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Position
              </th>
                {activeTab === "applications" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {activeTab === "hired" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hired Date
                  </th>
                )}
                {activeTab === "denied" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Denied Date
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {activeTab === "applications" ? "No applications found" : activeTab === "hired" ? "No hired candidates" : "No denied applications"}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {hasActiveFilters 
                          ? "Try adjusting your filters to see more results."
                          : activeTab === "applications"
                          ? "Job applications will appear here once candidates start applying."
                          : activeTab === "hired"
                          ? "Hired candidates will appear here after you mark applications as hired."
                          : "Denied applications will appear here after you deny applications."}
                      </p>
                    </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  onClick={() => setSelectedJob(job as unknown as JobApplication)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-100"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {job.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {job.fullName || "Unknown"}
                          </div>
                          {job.emailAddress && (
                            <div className="text-xs text-gray-500 mt-0.5 truncate">{job.emailAddress}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        {job.location?.name ? (
                          <>
                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium truncate">{job.location.name}</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.desiredPosition || "Not specified"}
                      </span>
                    </td>
                    {activeTab === "applications" && (
                      <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {updatingStatus === job._id ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                            <span className="text-xs text-gray-500">Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={job.status || "new"}
                            onChange={(e) => handleStatusChange(job._id, e.target.value as "new" | "reviewed" | "interviewed" | "denied")}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors appearance-none bg-no-repeat pr-8 ${
                              job.status === "new" 
                                ? "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100" 
                                : job.status === "reviewed"
                                ? "bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                                : job.status === "interviewed"
                                ? "bg-green-50 text-green-800 border-green-300 hover:bg-green-100"
                                : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundSize: '1.5em 1.5em',
                            }}
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="denied">Denied</option>
                          </select>
                        )}
                      </td>
                    )}
                    {activeTab === "hired" && job.hiredAt && (
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(job.hiredAt)}
                  </td>
                    )}
                    {activeTab === "denied" && job.deniedAt && (
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(job.deniedAt)}
                  </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(job.createdAt)}
                  </td>
                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {activeTab === "applications" && (
                          <>
                            <button
                              onClick={(e) => handleMarkAsHired(job._id, e)}
                              disabled={hiringApplication === job._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                              title="Mark as Hired"
                            >
                              {hiringApplication === job._id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              <span className="hidden sm:inline">Mark as Hired</span>
                            </button>
                            <button
                              onClick={(e) => handleDeny(job._id, e)}
                              disabled={denyingApplication === job._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                              title="Deny"
                            >
                              {denyingApplication === job._id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              <span className="hidden sm:inline">Deny</span>
                            </button>
                          </>
                        )}
                        {activeTab === "hired" && (
                          <button
                            onClick={(e) => handleUndoHire(job._id, e)}
                            disabled={hiringApplication === job._id}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {hiringApplication === job._id ? "Undoing..." : "Undo Hire"}
                          </button>
                        )}
                        {activeTab === "denied" && (
                          <button
                            onClick={(e) => handleUndoDeny(job._id, e)}
                            disabled={denyingApplication === job._id}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {denyingApplication === job._id ? "Undoing..." : "Undo Deny"}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedJob(job as unknown as JobApplication)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob as unknown as JobApplication} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

