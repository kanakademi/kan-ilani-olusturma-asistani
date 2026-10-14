import type { TemplateModule, TemplateListItem } from "./types";
import { AcikStory, KoyuStory, LacivertStory } from "./stories";

/**
 * Template Registry — sade şablonlar (stories.tsx / stories.css).
 * Yeni şablon: stories.css'e .il--<ad>, stories.tsx'e IKON rengi ve dışa aktarım, buraya satır.
 */
export const templates: TemplateModule[] = [
    { Component: AcikStory, config: { id: "acik", name: "Açık", selectorColor: "#ffffff", selectorInk: "#c8102e" } },
    { Component: KoyuStory, config: { id: "koyu", name: "Koyu", selectorColor: "#1c1b1f", selectorInk: "#ff4d55" } },
    { Component: LacivertStory, config: { id: "lacivert", name: "Lacivert", selectorColor: "#0e0a2e", selectorInk: "#ff4d55" } },
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
