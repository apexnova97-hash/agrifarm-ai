/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectLanguage,
  classifyBusinessPillar,
  isPricingOrInventoryQuery,
  extractLeadInfo,
  formatCallDuration,
  generateFallbackResponse,
} from './aminaLogic.ts';

test('detectLanguage detects English and Amharic script accurately', () => {
  assert.equal(detectLanguage('Hello, I am looking for knapsack sprayers'), 'en');
  assert.equal(detectLanguage('እንኳን ደህና መጡ'), 'am');
  assert.equal(detectLanguage('ቡና ኤክስፖርት ማድረግ እፈልጋለሁ'), 'am');
  assert.equal(detectLanguage(''), 'en');
});

test('classifyBusinessPillar classifies requests across 3 core pillars', () => {
  // Agricultural Imports
  assert.equal(classifyBusinessPillar('I need 50 knapsack sprayers and poultry feeders'), 'imports');
  assert.equal(classifyBusinessPillar('የጀርባ ርጭት ማሽን እፈልጋለሁ'), 'imports');

  // Local Manufacturing
  assert.equal(classifyBusinessPillar('Do you manufacture veterinary treatment syringes and livestock ear tags?'), 'manufacturing');
  assert.equal(classifyBusinessPillar('ስለ እንስሳት ህክምና መርፌ ማወቅ እፈልጋለሁ'), 'manufacturing');

  // Coffee Export
  assert.equal(classifyBusinessPillar('We want to source 2 containers of Sidama coffee for Germany'), 'coffee');
  assert.equal(classifyBusinessPillar('የቡና ኤክስፖርት አገልግሎት አለ?'), 'coffee');

  // Logistics & Office
  assert.equal(classifyBusinessPillar('Where is your office in Addis Ababa located?'), 'logistics');
  assert.equal(classifyBusinessPillar('የቢሮአችሁ አድራሻ የት ነው?'), 'logistics');
});

test('isPricingOrInventoryQuery flags price, stock, and freight inquiries', () => {
  assert.equal(isPricingOrInventoryQuery('What is the price of 20L knapsack sprayer?'), true);
  assert.equal(isPricingOrInventoryQuery('How much for a container of Yirgacheffe?'), true);
  assert.equal(isPricingOrInventoryQuery('ስንት ነው ዋጋው?'), true);
  assert.equal(isPricingOrInventoryQuery('Hello, tell me about your company'), false);
});

test('extractLeadInfo extracts phone, email, volume, and pillar', () => {
  const text = 'I want 50 sprayers sent to Hawassa. Contact me at +251 911 22 33 44 or test@gmail.com';
  const lead = extractLeadInfo(text);

  assert.equal(lead.pillar, 'imports');
  assert.equal(lead.phone, '+251 911 22 33 44');
  assert.equal(lead.email, 'test@gmail.com');
  assert.equal(lead.itemsOrVolume, '50 sprayers');
  assert.equal(lead.destinationOrLocation, 'Hawassa');
});

test('formatCallDuration formats seconds into MM:SS', () => {
  assert.equal(formatCallDuration(0), '00:00');
  assert.equal(formatCallDuration(45), '00:45');
  assert.equal(formatCallDuration(130), '02:10');
});

test('generateFallbackResponse adheres to Amina voice rules', () => {
  const priceRes = generateFallbackResponse('How much is the syringe?', 'en');
  assert.ok(priceRes.text.includes('within one business day'));
  assert.equal(priceRes.pillar, 'manufacturing');

  const amharicRes = generateFallbackResponse('እንኳን ደህና መጣችሁ', 'am');
  assert.ok(amharicRes.text.includes('አግሪፋርም'));
});
