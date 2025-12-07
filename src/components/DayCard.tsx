import type { DaySchedule } from "../data/schedule";

interface DayCardProps {
  day: DaySchedule;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function DayCard({ day, isSelected, onSelect }: DayCardProps) {
  const totalResources = day.sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  );

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.();
      }}
      className={`w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
        isSelected
          ? "border-primary-500 bg-primary-500 text-white shadow-md"
          : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:shadow-md text-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
            isSelected ? "text-orange-100" : "text-gray-400"
          }`}>
            Dia do curso
          </p>
          <p className={`text-sm font-semibold leading-tight ${
            isSelected ? "text-white" : "text-gray-100"
          }`}>
            {day.label}
          </p>
          {day.date && (
            <p className={`text-xs mt-1 ${
              isSelected ? "text-orange-100" : "text-gray-400"
            }`}>
              {day.date}
            </p>
          )}
        </div>
        <div className={`flex-shrink-0 text-xs font-medium ${
          isSelected ? "text-orange-100" : "text-gray-400"
        }`}>
          <div className="text-right">
            <span className="block font-semibold">{totalResources}</span>
            <span className="text-[10px]">recursos</span>
          </div>
        </div>
      </div>
    </button>
  );
}


