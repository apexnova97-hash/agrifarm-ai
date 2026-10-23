/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BusinessPillar = 'imports' | 'manufacturing' | 'coffee' | 'logistics' | 'general';
export type SupportedLanguage = 'en' | 'am';

export interface LeadInfo {
  callerName?: string;
  phone?: string;
  email?: string;
  pillar: BusinessPillar;
  itemsOrVolume?: string;
  destinationOrLocation?: string;
  notes?: string;
  slaStatus: string;
  timestamp: string;
}

export const COMPANY_INFO = {
  name: 'Agrifarm Agricultural Inputs and Equipment Import PLC',
  shortName: 'Agrifarm PLC',
  location: 'Gofa Mebrat Hail Condominium, Addis Ababa, Ethiopia',
  phones: ['+251 911 54 24 68', '+251 963 65 65 65'],
  email: 'agrifarm2009@gmail.com',
  sla: 'Follow-up within 1 business day by our Addis Ababa team',
};

/**
 * Detects whether the input text is primarily in Amharic (Ethiopic script) or English.
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) return 'en';
  // Check for Ethiopic Unicode block: \u1200-\u137F
  const ethiopicRegex = /[\u1200-\u137F]/;
  return ethiopicRegex.test(text) ? 'am' : 'en';
}

/**
 * Classifies a caller's message into one of Agrifarm's core pillars.
 */
export function classifyBusinessPillar(text: string): BusinessPillar {
  const lower = text.toLowerCase();

  // Coffee Export check
  const coffeeKeywords = [
    'coffee', 'export', 'green bean', 'yirgacheffe', 'sidama', 'guji',
    'limu', 'harar', 'sample', 'container', 'fob', 'cif', 'washed',
    'natural', 'ቡና', 'ኤክስፖርት', 'ወጪ'
  ];
  if (coffeeKeywords.some((kw) => lower.includes(kw))) {
    return 'coffee';
  }

  // Local Manufacturing check
  const mfgKeywords = [
    'manufactur', 'syringe', 'veterinary', 'vet', 'ear tag', 'livestock',
    'domestic', 'vaccine', 'tagger', 'መርፌ', 'ጆሮ', 'እንስሳት', 'ማምረት'
  ];
  if (mfgKeywords.some((kw) => lower.includes(kw))) {
    return 'manufacturing';
  }

  // Agricultural Imports check
  const importKeywords = [
    'import', 'knapsack', 'sprayer', 'poultry', 'chicken', 'feeder',
    'drinker', 'farm tool', 'hoe', 'irrigation', 'seeds', 'ርጭት', 'ዶሮ', 'መሳሪያ', 'ማሽን'
  ];
  if (importKeywords.some((kw) => lower.includes(kw))) {
    return 'imports';
  }

  // Logistics / Contact check
  const logisticsKeywords = [
    'location', 'office', 'where are you', 'address', 'contact', 'phone',
    'email', 'gofa', 'mebrat hail', 'addis ababa', 'አድራሻ', 'ስልክ', 'ቢሮ', 'ጎፋ'
  ];
  if (logisticsKeywords.some((kw) => lower.includes(kw))) {
    return 'logistics';
  }

  return 'general';
}

/**
 * Detects if the user is asking for specific pricing, real-time inventory, or freight rates.
 */
export function isPricingOrInventoryQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const pricingKeywords = [
    'price', 'cost', 'how much', 'quote', 'rate', 'inventory', 'stock',
    'how many do you have', 'freight cost', 'ዋጋ', 'ስንት ነው', 'ክምችት'
  ];
  return pricingKeywords.some((kw) => lower.includes(kw));
}

/**
 * Parses and extracts structured lead information from message content.
 */
export function extractLeadInfo(text: string, currentLead?: Partial<LeadInfo>): Partial<LeadInfo> {
  const updated: Partial<LeadInfo> = { ...(currentLead || {}) };

  // Detect pillar
  const pillar = classifyBusinessPillar(text);
  if (pillar !== 'general' && (!updated.pillar || updated.pillar === 'general')) {
    updated.pillar = pillar;
  }

  // Detect phone number (+251... or 09... or 07... with spaces/dashes or international)
  const phoneMatch = text.match(/(?:\+251[\s.-]?[1-9](?:[\s.-]?\d){8}|0[97](?:[\s.-]?\d){8}|\+?\d{10,14})/);
  if (phoneMatch) {
    updated.phone = phoneMatch[0].trim();
  }

  // Detect email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    updated.email = emailMatch[0];
  }

  // Detect volume / quantity mention (e.g. "20 sprayers", "500 ear tags", "1 container")
  const volumeMatch = text.match(/(\d+\s*(?:units?|pcs?|sprayers?|ear tags?|syringes?|bags?|containers?|tons?|kg))/i);
  if (volumeMatch) {
    updated.itemsOrVolume = volumeMatch[0];
  } else if (!updated.itemsOrVolume) {
    if (text.toLowerCase().includes('knapsack')) updated.itemsOrVolume = 'Knapsack Sprayers';
    else if (text.toLowerCase().includes('poultry')) updated.itemsOrVolume = 'Poultry Equipment';
    else if (text.toLowerCase().includes('syringe')) updated.itemsOrVolume = 'Veterinary Syringes';
    else if (text.toLowerCase().includes('ear tag')) updated.itemsOrVolume = 'Livestock Ear Tags';
    else if (text.toLowerCase().includes('coffee')) updated.itemsOrVolume = 'Coffee Export Inquiry';
  }

  // Detect destination or location mention
  const destMatch = text.match(/(?:to|in|from|destination:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (destMatch && !['Agrifarm', 'Amina', 'Ethiopia', 'Addis'].includes(destMatch[1])) {
    updated.destinationOrLocation = destMatch[1];
  }

  updated.slaStatus = COMPANY_INFO.sla;
  if (!updated.timestamp) {
    updated.timestamp = new Date().toISOString();
  }

  return updated;
}

/**
 * Format call seconds into MM:SS.
 */
export function formatCallDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Deterministic voice responses when offline or testing without Gemini API key,
 * strictly abiding by Amina's 2-3 sentence limit and official guidelines.
 */
export function generateFallbackResponse(userMessage: string, lang: SupportedLanguage): { text: string; pillar: BusinessPillar } {
  const pillar = classifyBusinessPillar(userMessage);
  const isPriceQuery = isPricingOrInventoryQuery(userMessage);

  if (lang === 'am') {
    if (isPriceQuery) {
      return {
        text: 'ትክክለኛውን ዋጋ እና የዕቃውን ዝርዝር የሽያጭ ቡድናችን በአንድ የስራ ቀን ውስጥ ያሳውቅዎታል። እባክዎን ስምዎን እና ስልክ ቁጥርዎን ያጋሩኝ?',
        pillar,
      };
    }

    switch (pillar) {
      case 'imports':
        return {
          text: 'አግሪፋርም ከፍተኛ ጥራት ያላቸውን የጀርባ ርጭት ማሽኖች እና የዶሮ እርባታ መሳሪያዎችን ያስመጣል። ምን ያህል መጠን እና የትኛውን ዓይነት ይፈልጋሉ?',
          pillar,
        };
      case 'manufacturing':
        return {
          text: 'የእንስሳት ህክምና መርፌዎችን እና የከብት ጆሮ መለያዎችን (Ear tags) እዚሁ በአገር ውስጥ እናመርታለን። የሚፈልጉትን ብዛት ሊነግሩኝ ይችላሉ?',
          pillar,
        };
      case 'coffee':
        return {
          text: 'የኢትዮጵያን ምርጥ ቡና (ሲዳማ፣ ይርጋጨፌ፣ ጉጂ) ለዓለም ገበያ እናቀርባለን። የሚፈልጉትን የኮንቴነር መጠን ወይም የናሙና ጥያቄ ሊያጋሩኝ ይችላሉ?',
          pillar,
        };
      case 'logistics':
        return {
          text: 'ቢሮአችን አዲስ አበባ ጎፋ መብራት ኃይል ኮንዶሚኒየም ይገኛል። እንዲሁም በ +251 911 54 24 68 ወይም +251 963 65 65 65 በቀጥታ ሊያገኙን ይችላሉ። በምን ልርዳዎት?',
          pillar,
        };
      default:
        return {
          text: 'እንኳን ወደ አግሪፋርም በደህና መጡ። ስለ ግብርና መሳሪያዎች፣ የአገር ውስጥ ህክምና ምርቶች ወይም የቡና ኤክስፖርት እንዴት ልርዳዎት?',
          pillar,
        };
    }
  }

  // English responses (Strictly 2-3 concise sentences)
  if (isPriceQuery) {
    return {
      text: "I'll make sure our sales team follows up with exact pricing and availability within one business day. Could you share your name and preferred phone or email?",
      pillar,
    };
  }

  switch (pillar) {
    case 'imports':
      return {
        text: "Agrifarm imports premium knapsack sprayers, poultry equipment systems, and farm tools to boost your farm's productivity. How many units do you need for a formal quote?",
        pillar,
      };
    case 'manufacturing':
      return {
        text: 'We locally manufacture veterinary treatment syringes and livestock ear tags right here in Ethiopia to reduce import dependency. Would you like a catalog or specific quantity quote?',
        pillar,
      };
    case 'coffee':
      return {
        text: 'Agrifarm exports Grade 1 and 2 specialty Ethiopian coffees including Yirgacheffe, Sidama, and Guji. What volume and target destination country are you planning for?',
        pillar,
      };
    case 'logistics':
      return {
        text: 'Our headquarters is at Gofa Mebrat Hail Condominium in Addis Ababa, Ethiopia. You can also reach our desk directly at +251 911 54 24 68. How else may I assist you today?',
        pillar,
      };
    default:
      return {
        text: 'Welcome to Agrifarm Agricultural Inputs and Equipment Import PLC. Are you looking for imported farm equipment, our locally manufactured veterinary tools, or Ethiopian coffee export?',
        pillar,
      };
  }
}
