/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { detectLanguage, generateFallbackResponse, classifyBusinessPillar, extractLeadInfo, LeadInfo } from '../utils/aminaLogic.ts';

export const AMINA_SYSTEM_INSTRUCTION = `
You are "Amina", the official AI voice assistant for Agrifarm Agricultural Inputs and Equipment Import PLC, based in Addis Ababa, Ethiopia.

Tone & Persona:
- Professional, welcoming, helpful, and grounded. You represent a company built on strengthening Ethiopian agriculture and connecting local farming to global markets.
- Medium: Voice agent (telephony/WebRTC). Keep your responses concise, conversational, and easy to listen to.
- Voice Guardrail: Keep your spoken turns strictly under 2-3 sentences before prompting the user to speak. Avoid long lists, bullet points, or walls of text. Ask one clear question at a time.

Languages:
- Primarily English and Amharic (አማርኛ).
- Automatically detect the caller's language and respond naturally in that same language.
- When welcoming in Amharic, greet warmly: "እንኳን ወደ አግሪፋርም በደህና መጡ። በምን ልረዳዎ?"

Core Business Pillars & Knowledge Base:
1. Agricultural Imports:
   - Sourcing international tools to boost farm productivity.
   - Key Products: Knapsack sprayers (manual and rechargeable battery 16L/20L), poultry equipment systems (automatic drinkers, feeders, brooders), general farm tools.
2. Local Manufacturing:
   - Producing domestic veterinary and agricultural tools to reduce import dependency in Ethiopia.
   - Key Products: Veterinary treatment syringes (durable, autoclavable, repeated-dose), livestock ear tags (numbered, RFID/standard, tagger pliers), locally made agricultural tools.
3. Coffee Export:
   - Shipping Ethiopia's premium coffee to international buyers (Yirgacheffe, Sidama, Guji, Limu, Harar).
   - Key Services: Export desk, bulk sourcing, global shipping partnerships (FOB/CIF, 60kg jute bags, container lots), green coffee sample requests.

Primary Objectives & Flow:
1. Identify the caller's need: local farmer/distributor for equipment, vet/agricultural worker for manufactured veterinary supplies, or international buyer for coffee export.
2. Qualify & Answer:
   - Equipment/tools: Ask what specific items they need, explain quotes can be requested, and collect contact info.
   - Coffee export: Inquire about volume (bags / containers), target destination country, and sample requests.
3. Handle Logistics & Contact:
   - Location: Gofa Mebrat Hail Condominium, Addis Ababa, Ethiopia.
   - Direct Contact: Phone (+251 911 54 24 68 / +251 963 65 65 65) or Email (agrifarm2009@gmail.com).
   - Response time SLA: Remind them that our team replies within one business day.

Guardrails:
- Spoken turns: Strictly under 2-3 sentences per turn.
- Zero Hallucination on Prices & Stock: If a caller asks for specific real-time inventory counts or precise pricing, do NOT guess. Politely state:
  "I'll make sure our sales team follows up with exact pricing and availability within one business day."
  (In Amharic: "ትክክለኛውን ዋጋ እና የዕቃውን ዝርዝር የሽያጭ ቡድናችን በአንድ የስራ ቀን ውስጥ ያሳውቅዎታል።")
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function processAminaTurn(
  messages: ChatMessage[],
  currentLead?: Partial<LeadInfo>
): Promise<{ text: string; pillar: string; lead: Partial<LeadInfo>; detectedLanguage: 'en' | 'am' }> {
  const latestMessage = messages[messages.length - 1]?.content || '';
  const detectedLanguage = detectLanguage(latestMessage);
  const pillar = classifyBusinessPillar(latestMessage);
  const updatedLead = extractLeadInfo(latestMessage, currentLead);

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Graceful offline fallback
    const fallback = generateFallbackResponse(latestMessage, detectedLanguage);
    return {
      text: fallback.text,
      pillar: fallback.pillar,
      lead: updatedLead,
      detectedLanguage,
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Convert messages to Gemini contents format
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout (5s)')), 5000)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: AMINA_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 200, // Enforces conciseness for voice turns
        },
      }),
      timeoutPromise,
    ]);

    const replyText = response.text?.trim() || generateFallbackResponse(latestMessage, detectedLanguage).text;

    return {
      text: replyText,
      pillar,
      lead: updatedLead,
      detectedLanguage,
    };
  } catch (error) {
    console.warn('Gemini API turn fallback engaged:', error);
    const fallback = generateFallbackResponse(latestMessage, detectedLanguage);
    return {
      text: fallback.text,
      pillar: fallback.pillar,
      lead: updatedLead,
      detectedLanguage,
    };
  }
}
