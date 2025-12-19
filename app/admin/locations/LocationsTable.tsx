"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import LocationModal from "./LocationModal";

export default function LocationsTable() {
  const locations = useQuery(api.locations.getAll) || [];
  const createLocation = useMutation(api.locations.create);
  const updateLocation = useMutation(api.locations.update);
  const deleteLocation = useMutation(api.locations.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<{
    id?: Id<"locations">;
    name: string;
    slug: string;
    isHiring: boolean;
  } | null>(null);

  const handleCreate = () => {
    setEditingLocation({ name: "", slug: "", isHiring: false });
    setIsModalOpen(true);
  };

  const handleEdit = (location: {
    _id: Id<"locations">;
    name: string;
    slug: string;
    isHiring: boolean;
  }) => {
    setEditingLocation({
      id: location._id,
      name: location.name,
      slug: location.slug,
      isHiring: location.isHiring,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: Id<"locations">) => {
    if (!confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteLocation({ id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to delete location");
      } else {
        alert("Failed to delete location");
      }
    }
  };

  const handleSave = async (data: { name: string; slug: string; isHiring: boolean }) => {
    try {
      if (editingLocation?.id) {
        await updateLocation({
          id: editingLocation.id,
          ...data,
        });
      } else {
        await createLocation(data);
      }
      setIsModalOpen(false);
      setEditingLocation(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to save location");
      } else {
        alert("Failed to save location");
      }
    } 
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Location
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hiring Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No locations found. Add your first location to get started.
                </td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        location.isHiring
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {location.isHiring ? "Hiring" : "Not Hiring"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(location)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingLocation && (
        <LocationModal
          key={editingLocation.id ? editingLocation.id.toString() : "new"}
          location={editingLocation}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLocation(null);
          }}
        />
      )}
    </>
  );
}

