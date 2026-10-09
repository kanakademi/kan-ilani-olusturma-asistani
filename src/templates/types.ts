import type { RefObject } from "react";
import type { DonationInfo } from "../entities/DonationInfo";

export interface TemplateConfig {
    id: string;
    name: string;
    selectorColor: string;
    selectorInk: string;
}

export interface TemplateProps {
    donationInfo: DonationInfo;
    imageRef: RefObject<HTMLDivElement | null>;
}

export interface TemplateModule {
    Component: React.FC<TemplateProps>;
    config: TemplateConfig;
}

export type TemplateListItem = TemplateConfig;
