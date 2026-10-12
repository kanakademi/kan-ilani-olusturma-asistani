import type { TemplateModule, TemplateListItem } from "./types";
import { GeceStory, KlasikStory, SicakStory } from "./stories";

/**
 * Template Registry — tek yerleşim, üç renk (stories.tsx / stories.css). Yeni renk: stories.css'e .il--<ad>, buraya satır.
 */
export const templates: TemplateModule[] = [
    { Component: KlasikStory, config: { id: "klasik", name: "Klasik", selectorColor: "#ffffff", selectorInk: "#c8102e" } },
    { Component: GeceStory, config: { id: "gece", name: "Gece", selectorColor: "#0e0a2e", selectorInk: "#fff" } },
    { Component: SicakStory, config: { id: "sicak", name: "Sıcak", selectorColor: "#fff3f1", selectorInk: "#c8102e" } },
];

const templateMap = new Map<string, TemplateModule>(templates.map((t) => [t.config.id, t]));

export function getTemplateByIndex(index: number): TemplateModule | undefined {
    return templates[index];
}

export function getTemplateById(id: string): TemplateModule | undefined {
    return templateMap.get(id);
}

export function getTemplateList(): TemplateListItem[] {
    return templates.map((t) => t.config);
}

export function getTemplateCount(): number {
    return templates.length;
}
