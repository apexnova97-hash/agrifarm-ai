/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessPillar, SupportedLanguage, LeadInfo } from '../utils/aminaLogic.ts';

export type { BusinessPillar, SupportedLanguage, LeadInfo };

export interface Message {
  id: string;
  sender: 'amina' | 'caller';
  text: string;
  timestamp: string;
  pillar?: BusinessPillar;
  language?: SupportedLanguage;
}

export interface CatalogItem {
  id: string;
  pillar: BusinessPillar;
  name: string;
  nameAmharic: string;
  category: string;
  description: string;
  specs: string[];
  keyBenefit: string;
  samplePromptEn: string;
  samplePromptAm: string;
  badge?: string;
}
