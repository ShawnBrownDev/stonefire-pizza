"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

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

export default function JobFormConfigPage() {
  const schema = useQuery(api.jobFormSchema.get);
  const updateSchema = useMutation(api.jobFormSchema.update);
  const resetSchema = useMutation(api.jobFormSchema.reset);
  const locations = useQuery(api.locations.getAll) || [];

  const [fields, setFields] = useState<FormField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (schema) {
      setFields(schema.fields as FormField[]);
    }
  }, [schema]);

  const handleMove = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newFields.length) return;

    // Swap orders
    const temp = newFields[index].order;
    newFields[index].order = newFields[targetIndex].order;
    newFields[targetIndex].order = temp;

    // Swap positions
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    
    setFields(newFields);
  };

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleAddOption = (index: number, option: string) => {
    if (!option.trim()) return;
    const newFields = [...fields];
    const currentOptions = newFields[index].options || [];
    if (!currentOptions.includes(option.trim())) {
      newFields[index].options = [...currentOptions, option.trim()];
      setFields(newFields);
    }
  };

  const handleRemoveOption = (index: number, optionIndex: number) => {
    const newFields = [...fields];
    const options = newFields[index].options || [];
    newFields[index].options = options.filter((_, i) => i !== optionIndex);
    setFields(newFields);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSchema({ fields });
      alert("Form configuration saved successfully!");
    } catch (error) {
      console.error("Error saving schema:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset to default configuration? This will lose all customizations.")) {
      return;
    }
    setIsResetting(true);
    try {
      await resetSchema({});
      alert("Form reset to defaults successfully!");
    } catch (error) {
      console.error("Error resetting schema:", error);
      alert("Failed to reset configuration.");
    } finally {
      setIsResetting(false);
    }
  };

  const enabledFields = fields.filter(f => f.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Application Form Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">Customize the job application form structure</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {isResetting ? "Resetting..." : "Reset to Defaults"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.key}
              className={`border-2 rounded-lg p-4 transition-all ${
                field.enabled
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) => handleUpdateField(index, { enabled: e.target.checked })}
                      disabled={field.key === "locationId"}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-semibold text-gray-900">
                      {field.key === "locationId" && <span className="text-red-500">*</span>}
                      {field.key}
                    </label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {field.type}
                    </span>
                  </div>

                  {field.enabled && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Field Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                            disabled={field.key === "locationId"}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                      </div>

                      {field.type === "select" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          <div className="space-y-2">
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(field.options || [])];
                                    newOptions[optIndex] = e.target.value;
                                    handleUpdateField(index, { options: newOptions });
                                  }}
                                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <button
                                  onClick={() => handleRemoveOption(index, optIndex)}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const option = prompt("Enter new option:");
                                if (option) handleAddOption(index, option);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Add Option
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Restrict to Locations (leave empty for all locations)
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {locations.map((location) => {
                            const isSelected = field.locations?.includes(location._id);
                            return (
                              <label key={location._id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentLocations = field.locations || [];
                                    const newLocations = e.target.checked
                                      ? [...currentLocations, location._id]
                                      : currentLocations.filter(id => id !== location._id);
                                    handleUpdateField(index, { locations: newLocations });
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{location.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === fields.length - 1}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Preview</h3>
        <p className="text-sm text-blue-700">
          {enabledFields.length} field{enabledFields.length !== 1 ? "s" : ""} enabled
          {enabledFields.filter(f => f.required).length > 0 && (
            <span className="ml-2">
              ({enabledFields.filter(f => f.required).length} required)
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

