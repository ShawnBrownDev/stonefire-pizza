"use client";

import { Id } from "../../../../convex/_generated/dataModel";

type CateringRequest = {
  _id: Id<"cateringRequests">;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  notes?: string;
  createdAt: number;
};

interface CateringDetailsModalProps {
  request: CateringRequest;
  onClose: () => void;
}

export default function CateringDetailsModal({ request, onClose }: CateringDetailsModalProps) {
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
          <h2 className="text-2xl font-bold text-gray-900">Catering Request Details</h2>
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
            <p className="mt-1 text-sm text-gray-900">{request.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">
              <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                {request.email}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-sm text-gray-900">
              <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                {request.phone}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Event Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(request.eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Guest Count</label>
            <p className="mt-1 text-sm text-gray-900">{request.guestCount}</p>
          </div>

          {request.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{request.notes}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Submitted</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(request.createdAt)}</p>
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

