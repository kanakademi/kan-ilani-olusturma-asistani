import type { TemplateModule, TemplateListItem } from "./types";
import { CerceveStory, GeceStory, LavantaStory, NaneStory, PembeStory, RetroStory, TuruncuStory } from "./stories";

/**
 * Template Registry — Kan Akademi uygulamasının yedi şablonu (kan-akademi/kan-ilani-olusturma-asistani PR #46), aynı sıra ve renklerle (stories.tsx / stories.css).
 * Yeni şablon: stories.css'e .il--<ad>, gerekirse stories.tsx SUSLER'e süs, buraya satır.
 */
// sıra PR #46'daki gibi (ilk açılan Çerçeve)
export const templates: TemplateModule[] = [
    { Component: CerceveStory, config: { id: "cerceve", name: "Çerçeve", selectorColor: "#da2f47", selectorInk: "#fff" } },
    { Component: NaneStory, config: { id: "nane", name: "Nane", selectorColor: "#89e8e0", selectorInk: "#1a1730" } },
    { Component: RetroStory, config: { id: "retro", name: "Retro", selectorColor: "#f74e47", selectorInk: "#fff" } },
    { Component: TuruncuStory, config: { id: "turuncu", name: "Turuncu", selectorColor: "#ff9900", selectorInk: "#1a1730" } },
    { Component: PembeStory, config: { id: "pembe", name: "Pembe", selectorColor: "#ff454f", selectorInk: "#fff" } },
    { Component: GeceStory, config: { id: "gece", name: "Koyu", selectorColor: "#534e58", selectorInk: "#fff" } },
    { Component: LavantaStory, config: { id: "lavanta", name: "Lavanta", selectorColor: "#4847ef", selectorInk: "#fff" } },
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
