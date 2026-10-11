import type { TemplateModule, TemplateListItem } from "./types";
import { BiletStory, DamlaStory, GeceStory, SeftaliStory } from "./stories";

/**
 * Template Registry — yeni şablon: stories.tsx'e bileşen, stories.css'e stil yaz, buraya ekle.
 */
export const templates: TemplateModule[] = [
    { Component: DamlaStory, config: { id: "damla", name: "Damla", selectorColor: "#d3172a", selectorInk: "#fff" } },
    { Component: GeceStory, config: { id: "gece", name: "Gece", selectorColor: "#0e0a2e", selectorInk: "#fff" } },
    { Component: BiletStory, config: { id: "bilet", name: "Bilet", selectorColor: "#fff8ef", selectorInk: "#c8102e" } },
    { Component: SeftaliStory, config: { id: "seftali", name: "Şeftali", selectorColor: "#ffe0d8", selectorInk: "#b10f22" } },
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
