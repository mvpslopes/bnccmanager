import type { ResourceType } from "../data/schedule";

const colorsByType: Record<ResourceType, string> = {
  zoom: "bg-primary-500/20 text-primary-400 border-primary-500/30",
  form: "bg-green-500/20 text-green-400 border-green-500/30",
  recurso: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  outro: "bg-gray-700 text-gray-300 border-gray-600"
};

const labelByType: Record<ResourceType, string> = {
  zoom: "ZOOM",
  form: "FORMULÁRIO",
  recurso: "RECURSO",
  outro: "OUTRO"
};

interface TypeTagProps {
  type: ResourceType;
}

export function TypeTag({ type }: TypeTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${colorsByType[type]}`}
    >
      {labelByType[type]}
    </span>
  );
}


