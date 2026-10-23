/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Tractor,
  Factory,
  Coffee,
  MapPin,
  Clock,
  Copy,
  Check,
  Trash2,
  Building2,
  FileText,
  User,
  Bot
} from 'lucide-react';
import { Message, LeadInfo, SupportedLanguage, BusinessPillar } from '../types/index.ts';
import { COMPANY_INFO } from '../utils/aminaLogic.ts';

interface ChatConsoleProps {
  messages: Message[];
  currentLead: Partial<LeadInfo>;
  language: SupportedLanguage;
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
  currentLead,
  language,
  onSendMessage,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const text = inputText.trim();
    setInputText('');
    setIsSubmitting(true);
    try {
      await onSendMessage(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = language === 'am'
    ? [
        { label: 'የ 20L ርጭት ማሽን ዋጋ መጠየቂያ', text: 'ለ 50 ፍሬ የ 20 ሊትር ባትሪ ርጭት ማሽን ዋጋ ማወቅ እፈልጋለሁ።', icon: Tractor },
        { label: 'የአገር ውስጥ እንስሳት ህክምና መርፌ', text: 'ስለ አገር ውስጥ የእንስሳት ህክምና መርፌ እና የጆሮ መለያ ዝርዝር መረጃ ስጡኝ።', icon: Factory },
        { label: 'የይርጋጨፌ ቡና ወጪ ንግድ', text: 'ወደ ጀርመን ወይም አውሮፓ የሚላክ የይርጋጨፌ ቡና ናሙና ማግኘት እንፈልጋለን።', icon: Coffee },
        { label: 'የአዲስ አበባ ጎፋ ቢሮ አድራሻ', text: 'የአዲስ አበባ ጎፋ መብራት ኃይል ቢሮአችሁ የት ነው የሚገኘው?', icon: MapPin },
      ]
    : [
        { label: 'Knapsack Sprayers 20L Quote', text: 'I need a formal quotation for 50 units of 20L rechargeable knapsack sprayers.', icon: Tractor },
        { label: 'Veterinary Syringes & Tags', text: 'Tell me about your locally manufactured veterinary syringes and livestock ear tags.', icon: Factory },
        { label: 'Sidama Coffee Export Lot', text: 'We are a green coffee importer looking for 1 container of Sidama Washed Grade 2.', icon: Coffee },
        { label: 'Addis Ababa Office Location', text: 'Where is your Gofa Mebrat Hail office located and how do I contact sales directly?', icon: MapPin },
      ];

  const getPillarBadge = (pillar?: BusinessPillar) => {
    switch (pillar) {
      case 'imports':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Tractor className="w-3 h-3" /> Agricultural Imports
          </span>
        );
      case 'manufacturing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Factory className="w-3 h-3" /> Local Manufacturing
          </span>
        );
      case 'coffee':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Coffee className="w-3 h-3" /> Ethiopian Coffee Export
          </span>
        );
      case 'logistics':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <MapPin className="w-3 h-3" /> Addis Ababa Desk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
        {/* Main Chat Panel (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[560px] bg-slate-950/80 rounded-3xl border border-emerald-800/40 shadow-2xl relative overflow-hidden backdrop-blur-xs font-sans">
          {/* Chat Header */}
          <div className="p-4 bg-emerald-950/80 border-b border-emerald-800/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-400 to-emerald-500 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold bg-gradient-to-br from-amber-300 to-emerald-300 bg-clip-text text-transparent">
                      A
                    </span>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Amina — Agrifarm Customer Support Chat
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80">
                  {language === 'am'
                    ? 'አግሪፋርም ኃ/የተ/የግ/ማህበር • አዲስ አበባ፣ ኢትዮጵያ'
                    : 'Agrifarm PLC • Addis Ababa, Ethiopia • 1-Day Response SLA'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearChat}
                className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 hover:text-white border border-emerald-800/40 transition-colors"
                title="Clear Chat"
                aria-label="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isAmina = msg.sender === 'amina';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAmina ? 'justify-start' : 'justify-end'}`}
                >
                  {isAmina && (
                    <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isAmina ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-emerald-400/70">
                      <span className="font-semibold text-emerald-300">
                        {isAmina ? 'Amina' : 'You'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.pillar && getPillarBadge(msg.pillar)}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg relative group ${
                        isAmina
                          ? 'bg-gradient-to-br from-emerald-950 to-emerald-900/90 text-emerald-50 border border-emerald-700/50 rounded-tl-xs'
                          : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-tr-xs shadow-amber-900/30'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {isAmina && (
                        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-emerald-800/40 text-xs text-emerald-300">
                          <button
                            onClick={() => copyText(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-amber-300 transition-colors p-1 rounded hover:bg-emerald-800/40"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">
                              {copiedId === msg.id ? 'Copied' : 'Copy'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isAmina && (
                    <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-200 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSubmitting && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-emerald-950/80 border border-emerald-800/50 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'am' ? 'አሚና መልስ እያዘጋጀች ነው...' : 'Amina is typing...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Bar above input */}
          <div className="px-4 py-2 bg-emerald-950/40 border-t border-emerald-900/60 overflow-x-auto flex items-center gap-2 custom-scrollbar">
            <span className="text-[11px] text-emerald-400/70 font-semibold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(qp.text)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-800/40 text-[11px] text-emerald-200 hover:text-white transition-all"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Text Input Bar */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-emerald-950/90 border-t border-emerald-800/50 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'am'
                  ? 'ስለ ግብርና እቃዎች፣ የአገር ውስጥ መርፌዎች ወይም ቡና ይጠይቁ...'
                  : 'Ask Amina about farm equipment, veterinary tools, or coffee export...'
              }
              className="flex-1 bg-slate-950/90 border border-emerald-800/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400/70 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'am' ? 'ላክ' : 'Send'}</span>
            </button>
          </form>
        </div>

        {/* Right Sidebar: Lead Summary & Direct Contacts (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-950/80 rounded-3xl border border-emerald-800/40 p-5 shadow-xl font-sans">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Customer Inquiry Log</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                1-Day SLA
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/30">
                <p className="text-emerald-400/70 font-semibold uppercase text-[10px]">
                  Business Line:
                </p>
                <p className="font-bold text-white mt-0.5 capitalize">
                  {currentLead.pillar ? currentLead.pillar : 'General Inquiry'}
                </p>
              </div>

              <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/30">
                <p className="text-emerald-400/70 font-semibold uppercase text-[10px]">
                  Items / Volume Requested:
                </p>
                <p className="font-bold text-white mt-0.5">
                  {currentLead.itemsOrVolume || 'Waiting for customer inquiry...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-950/50 rounded-xl p-2.5 border border-emerald-800/30">
                  <p className="text-emerald-400/70 font-semibold uppercase text-[10px]">
                    Phone:
                  </p>
                  <p className="font-mono text-emerald-200 mt-0.5 truncate">
                    {currentLead.phone || 'Not provided'}
                  </p>
                </div>
                <div className="bg-emerald-950/50 rounded-xl p-2.5 border border-emerald-800/30">
                  <p className="text-emerald-400/70 font-semibold uppercase text-[10px]">
                    Location:
                  </p>
                  <p className="text-emerald-200 mt-0.5 truncate">
                    {currentLead.destinationOrLocation || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-700/30 text-[11px] text-amber-200/90 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Our Addis Ababa sales & export desk prepares pro-forma invoices within 1 business day.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Office Contacts */}
          <div className="bg-emerald-950/60 rounded-3xl border border-emerald-800/40 p-5 shadow-xl space-y-3 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Direct Sales Desk</span>
            </h4>

            <div className="space-y-2 text-xs text-emerald-200/90">
              <a
                href={`tel:${COMPANY_INFO.phones[0]}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-800/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-800/50 flex items-center justify-center text-amber-300 shrink-0">
                  📞
                </div>
                <div>
                  <p className="font-semibold text-white font-mono">+251 911 54 24 68</p>
                  <p className="text-[10px] text-emerald-300/70">Main Office Line</p>
                </div>
              </a>

              <a
                href={`tel:${COMPANY_INFO.phones[1]}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-800/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-800/50 flex items-center justify-center text-amber-300 shrink-0">
                  📞
                </div>
                <div>
                  <p className="font-semibold text-white font-mono">+251 963 65 65 65</p>
                  <p className="text-[10px] text-emerald-300/70">Secondary Sales Line</p>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-800/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-800/50 flex items-center justify-center text-amber-300 shrink-0">
                  ✉️
                </div>
                <div>
                  <p className="font-semibold text-white">{COMPANY_INFO.email}</p>
                  <p className="text-[10px] text-emerald-300/70">Official Quote Email</p>
                </div>
              </a>
            </div>

            <div className="pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-300/70 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Gofa Mebrat Hail Condominium, Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
