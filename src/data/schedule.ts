export type ResourceType = "zoom" | "form" | "recurso" | "outro";

export interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  notes?: string;
}

export interface DaySchedule {
  id: string;
  label: string;
  order: number;
  date?: string;
  sections: {
    id: string;
    label: string;
    items: ResourceItem[];
  }[];
}

import rawSchedule from "./schedule.json";

export const schedule = rawSchedule as DaySchedule[];

