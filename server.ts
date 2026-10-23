/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { processAminaTurn } from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for Amina conversational turns
app.post('/api/amina/chat', async (req, res) => {
  try {
    const { messages, lead } = req.body;
    const result = await processAminaTurn(messages || [], lead || {});
    res.json(result);
  } catch (error: any) {
    console.error('Server error in /api/amina/chat:', error);
    res.status(500).json({ error: error.message || 'Internal error' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', assistant: 'Amina', company: 'Agrifarm PLC' });
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Amina Agrifarm Server running on port ${PORT}`);
});
