/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Globe,
  Code2,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import { CustomerServiceWidget } from './components/CustomerServiceWidget.tsx';
import { ChatConsole } from './components/ChatConsole.tsx';
import { InquiryCRM } from './components/InquiryCRM.tsx';
import { EmbedHelper } from './components/EmbedHelper.tsx';
import { Message, SupportedLanguage, LeadInfo } from './types/index.ts';
import {
  detectLanguage,
  classifyBusinessPillar,
  extractLeadInfo,
  generateFallbackResponse,
  COMPANY_INFO
} from './utils/aminaLogic.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'assistant' | 'crm' | 'embed'>('preview');
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(true);
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Check if standalone embed query param is set (e.g. ?embed=true or embedded directly in iframe)
  const isEmbedMode = typeof window !== 'undefined' && window.location.search.includes('embed=true');

  const initialGreetingEn =
    "Welcome to Agrifarm Agricultural Inputs and Equipment Import PLC. I'm Amina, your customer support assistant. How can I help you today with farm equipment quotes, local veterinary tools, or Ethiopian coffee export?";
  const initialGreetingAm =
    "እንኳን ወደ አግሪፋርም በደህና መጡ። እኔ አሚና ነኝ፤ በምን ልረዳዎ?";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'amina',
      text: initialGreetingEn,
      timestamp: 'Just now',
      language: 'en',
    },
  ]);

  const [currentLead, setCurrentLead] = useState<Partial<LeadInfo>>({
    slaStatus: COMPANY_INFO.sla,
  });

  const handleResetSession = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'amina',
        text: language === 'am' ? initialGreetingAm : initialGreetingEn,
        timestamp: 'Just now',
        language,
      },
    ]);
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const detectedLang = detectLanguage(userText);
    if (detectedLang !== language) {
      setLanguage(detectedLang);
    }

    const callerMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'caller',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pillar: classifyBusinessPillar(userText),
      language: detectedLang,
    };

    const newMessages = [...messages, callerMsg];
    setMessages(newMessages);

    // Update lead extraction immediately
    const updatedLead = extractLeadInfo(userText, currentLead);
    setCurrentLead(updatedLead);

    try {
      const response = await fetch('/api/amina/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.sender === 'caller' ? 'user' : 'assistant',
            content: m.text,
          })),
          lead: updatedLead,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || generateFallbackResponse(userText, detectedLang).text;

      const aminaMsg: Message = {
        id: `msg-${Date.now()}-amina`,
        sender: 'amina',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pillar: data.pillar || classifyBusinessPillar(userText),
        language: data.detectedLanguage || detectedLang,
      };

      setMessages((prev) => [...prev, aminaMsg]);

      if (data.lead) {
        setCurrentLead((prev) => ({ ...prev, ...data.lead }));
      }
    } catch (err) {
      console.warn('API error, falling back to local Amina engine:', err);
      const fallback = generateFallbackResponse(userText, detectedLang);

      const aminaMsg: Message = {
        id: `msg-${Date.now()}-amina`,
        sender: 'amina',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pillar: fallback.pillar,
        language: detectedLang,
      };

      setMessages((prev) => [...prev, aminaMsg]);
    }
  };

  // If running in strict standalone embed iframe mode, render only the widget
  if (isEmbedMode) {
    return (
      <div className="w-full h-full min-h-screen bg-transparent">
        <CustomerServiceWidget
          isOpen={true}
          onToggleOpen={() => {}}
          messages={messages}
          currentLead={currentLead}
          language={language}
          onLanguageChange={setLanguage}
          onSendMessage={handleSendMessage}
          onResetSession={handleResetSession}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07130f] text-emerald-50 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header Bar */}
      <header className="bg-emerald-950/80 border-b border-emerald-800/40 backdrop-blur-md sticky top-0 z-40">
        {/* Micro-bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs text-emerald-200/80 border-b border-emerald-900/50 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-emerald-100">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Addis Ababa, Ethiopia
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-300/70">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Gofa Mebrat Hail Condominium
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300/70">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              1 Business Day Quote SLA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.phones[0]}`}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors text-emerald-200 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+251 911 54 24 68</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden sm:flex items-center gap-1 hover:text-amber-300 transition-colors text-emerald-200"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-amber-500 to-emerald-700 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-300 text-xl">
                A
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  <span>AMINA</span>
                  <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    WIDGET
                  </span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Agrifarm PLC
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">
                {language === 'am'
                  ? 'የደንበኞች አገልግሎት ቻትቦት (ለኔትሊፋይ ድረ-ገጽ)'
                  : 'Floating Customer Support Chatbot for Netlify'}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <nav className="flex items-center gap-1 bg-emerald-900/50 p-1 rounded-xl border border-emerald-800/50">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Netlify Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'assistant'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Full Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'embed'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Embed Code</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'crm'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inquiry Log</span>
            </button>
          </nav>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-emerald-900/60 p-1 rounded-lg border border-emerald-800/50 shrink-0">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('am')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                language === 'am'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              አማ
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Tab 1: Netlify Site Live Simulation Backdrop with Floating Widget */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Top preview toolbar */}
            <div className="bg-emerald-950/70 border border-emerald-800/50 rounded-2xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">Target Website:</span>
                <a
                  href="https://agrifarm-plc.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>https://agrifarm-plc.netlify.app/</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3 text-emerald-300/80">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Floating Widget Active (Bottom-Right)</span>
                </span>
                <button
                  onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                  className="px-2.5 py-1 rounded-md bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 font-semibold"
                >
                  {isWidgetOpen ? 'Hide Widget' : 'Show Widget'}
                </button>
              </div>
            </div>

            {/* Simulated Website Viewport Frame */}
            <div className="flex-1 min-h-[580px] bg-slate-950 rounded-3xl border border-emerald-800/50 shadow-2xl relative overflow-hidden flex flex-col">
              {/* Browser chrome bar */}
              <div className="bg-slate-900 border-b border-emerald-900/60 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300/80 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="bg-slate-950 px-4 py-1 rounded-lg border border-emerald-900/80 font-mono text-[11px] text-emerald-200 min-w-[260px] truncate ml-2">
                    https://agrifarm-plc.netlify.app/
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-400">● Live Preview</span>
                </div>
              </div>

              {/* Website Content Mockup with Real Agrifarm Branding */}
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-gradient-to-b from-[#0b1a14] to-[#07130f]">
                {/* Hero on mock site */}
                <div className="max-w-2xl space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    Addis Ababa • Ethiopia
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Agrifarm Agricultural Inputs and Equipment Import PLC
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    Welcome to our official corporate portal. Explore our 3 business divisions below or click the Amina chatbot in the bottom right corner for instant quote requests and sample inquiries.
                  </p>
                </div>

                {/* 3 Pillars Mock Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-blue-900/30 space-y-2">
                    <p className="text-xs font-bold text-blue-300">1. Agricultural Imports</p>
                    <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                      Rechargeable & manual knapsack sprayers (16L/20L), commercial poultry feeders/drinkers, and drip systems.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 space-y-2">
                    <p className="text-xs font-bold text-emerald-300">2. Local Manufacturing</p>
                    <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                      Autoclavable veterinary treatment syringes, laser-numbered ear tags, and steel implements (Made in Ethiopia).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-amber-900/30 space-y-2">
                    <p className="text-xs font-bold text-amber-300">3. Coffee Export</p>
                    <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                      Specialty Yirgacheffe, Sidama, Guji green coffee lots (Grade 1 & 2 Washed/Natural) with worldwide container shipping.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-900/40 text-xs text-emerald-300/80 flex items-center justify-between">
                  <span>Headquarters: Gofa Mebrat Hail Condominium, Addis Ababa</span>
                  <span className="font-mono text-amber-400">+251 911 54 24 68</span>
                </div>
              </div>

              {/* The Floating Customer Service Chatbot Widget positioned directly inside the preview */}
              <CustomerServiceWidget
                isOpen={isWidgetOpen}
                onToggleOpen={() => setIsWidgetOpen(!isWidgetOpen)}
                messages={messages}
                currentLead={currentLead}
                language={language}
                onLanguageChange={setLanguage}
                onSendMessage={handleSendMessage}
                onResetSession={handleResetSession}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Full-screen Chat Console */}
        {activeTab === 'assistant' && (
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
            <ChatConsole
              messages={messages}
              currentLead={currentLead}
              language={language}
              onSendMessage={handleSendMessage}
              onClearChat={handleResetSession}
            />
          </div>
        )}

        {/* Tab 3: Embed Code Snippets */}
        {activeTab === 'embed' && (
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
            <EmbedHelper appUrl={typeof window !== 'undefined' ? window.location.origin : ''} />
          </div>
        )}

        {/* Tab 4: Inquiry CRM Log */}
        {activeTab === 'crm' && (
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
            <InquiryCRM
              currentLead={currentLead}
              onUpdateLead={(lead) => setCurrentLead((prev) => ({ ...prev, ...lead }))}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/60 bg-emerald-950/90 py-3 px-4 sm:px-8 text-xs text-emerald-300/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Agrifarm PLC</span>
            <span>•</span>
            <span>Gofa Mebrat Hail Condominium, Addis Ababa, Ethiopia</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-300">
            <span>Direct: +251 911 54 24 68 / +251 963 65 65 65</span>
            <span>•</span>
            <span>Email: agrifarm2009@gmail.com</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">1 Business Day SLA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
