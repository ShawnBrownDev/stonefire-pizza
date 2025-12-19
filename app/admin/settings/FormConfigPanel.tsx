"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

export default function FormConfigPanel() {
  const formConfig = useQuery(api.formConfig.get);
  const updateConfig = useMutation(api.formConfig.update);

  const [formData, setFormData] = useState({
    positionOptions: [] as string[],
    showFavoriteColor: true,
    showNicknames: true,
    showFavoriteBands: true,
    showHobbies: true,
  });

  const [newPosition, setNewPosition] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formConfig) {
      setFormData({
        positionOptions: formConfig.positionOptions || [],
        showFavoriteColor: formConfig.showFavoriteColor ?? true,
        showNicknames: formConfig.showNicknames ?? true,
        showFavoriteBands: formConfig.showFavoriteBands ?? true,
        showHobbies: formConfig.showHobbies ?? true,
      });
    }
  }, [formConfig]);

  const handleAddPosition = () => {
    if (newPosition.trim() && !formData.positionOptions.includes(newPosition.trim())) {
      setFormData({
        ...formData,
        positionOptions: [...formData.positionOptions, newPosition.trim()],
      });
      setNewPosition("");
    }
  };

  const handleRemovePosition = (position: string) => {
    setFormData({
      ...formData,
      positionOptions: formData.positionOptions.filter((p) => p !== position),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig({
        positionOptions: formData.positionOptions,
        showFavoriteColor: formData.showFavoriteColor,
        showNicknames: formData.showNicknames,
        showFavoriteBands: formData.showFavoriteBands,
        showHobbies: formData.showHobbies,
      });
      alert("Settings saved successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to save settings");
      } else {
        alert("Failed to save settings");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!formConfig) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Position Options */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Position Options</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPosition())}
              placeholder="Add new position"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddPosition}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.positionOptions.map((position) => (
              <span
                key={position}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {position}
                <button
                  type="button"
                  onClick={() => handleRemovePosition(position)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Fields */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Optional Fields</h2>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showFavoriteColor}
              onChange={(e) =>
                setFormData({ ...formData, showFavoriteColor: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show Favorite Color</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showNicknames}
              onChange={(e) =>
                setFormData({ ...formData, showNicknames: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show Nicknames</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showFavoriteBands}
              onChange={(e) =>
                setFormData({ ...formData, showFavoriteBands: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show Favorite Bands</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showHobbies}
              onChange={(e) =>
                setFormData({ ...formData, showHobbies: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show Hobbies</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

