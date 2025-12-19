"use client";

type Availability = {
  monday: { am: boolean; pm: boolean };
  tuesday: { am: boolean; pm: boolean };
  wednesday: { am: boolean; pm: boolean };
  thursday: { am: boolean; pm: boolean };
  friday: { am: boolean; pm: boolean };
  saturday: { am: boolean; pm: boolean };
  sunday: { am: boolean; pm: boolean };
};

interface AvailabilityGridProps {
  value: Availability;
  onChange: (availability: Availability) => void;
  error?: string;
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

const TIME_PERIODS = [
  { key: "am" as const, label: "AM" },
  { key: "pm" as const, label: "PM" },
];

export default function AvailabilityGrid({
  value,
  onChange,
  error,
}: AvailabilityGridProps) {
  const handleToggle = (day: keyof Availability, period: "am" | "pm") => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [period]: !value[day][period],
      },
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Availability <span className="text-red-500 ml-1">*</span>
        </label>
        <p className="text-sm text-gray-600">
          Select the days and times you are available to work
        </p>
      </div>

      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-gray-200">
                  Day
                </th>
                {TIME_PERIODS.map((period) => (
                  <th
                    key={period.key}
                    className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    {period.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {DAYS.map((day) => (
                <tr key={day.key} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-r-2 border-gray-100">
                    {day.label}
                  </td>
                  {TIME_PERIODS.map((period) => (
                    <td key={period.key} className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(day.key, period.key)}
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-200 font-bold text-base shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 ${
                          value[day.key][period.key]
                            ? "bg-gradient-to-br from-red-600 to-red-700 border-red-700 text-white shadow-md"
                            : "bg-white border-gray-200 text-gray-400 hover:border-red-400 hover:bg-red-50"
                        }`}
                        aria-label={`${day.label} ${period.label}`}
                      >
                        {value[day.key][period.key] ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}

