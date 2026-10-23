/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  Clock,
  Globe,
  Bot,
  User,
  MapPin,
  Tractor,
  Factory,
  Coffee,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Message, LeadInfo, SupportedLanguage, BusinessPillar } from '../types/index.ts';
import { COMPANY_INFO } from '../utils/aminaLogic.ts';

interface CustomerServiceWidgetProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  messages: Message[];
  currentLead: Partial<LeadInfo>;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onSendMessage: (text: string) => Promise<void>;
  onResetSession: () => void;
}

export const CustomerServiceWidget: React.FC<CustomerServiceWidgetProps> = ({
  isOpen,
  onToggleOpen,
  messages,
  currentLead,
  language,
  onLanguageChange,
  onSendMessage,
  onResetSession,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSubmitting, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
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
        { label: 'የ 20L ርጭት ማሽን ዋጋ', text: 'የ 20 ሊትር ባትሪ ርጭት ማሽን ዋጋ እና ክምችት ስንት ነው?' },
        { label: 'የእንስሳት መርፌ እና ጆሮ መለያ', text: 'ስለ አገር ውስጥ የእንስሳት ህክምና መርፌ እና የጆሮ መለያ ማወቅ ፈልጌ ነበር።' },
        { label: 'የቡና ኤክስፖርት (ይርጋጨፌ)', text: 'የይርጋጨፌ ቡና ወደ ውጭ አገር መላክ እንፈልጋለን፤ ናሙና ማግኘት ይቻላል?' },
        { label: 'የአዲስ አበባ ጎፋ ቢሮ አድራሻ', text: 'የአዲስ አበባ ጎፋ መብራት ኃይል ቢሮአችሁ የት ነው?' },
      ]
    : [
        { label: 'Knapsack Sprayer 20L Quote', text: 'Can I get a formal quotation for 20L rechargeable knapsack sprayers?' },
        { label: 'Veterinary Syringes & Tags', text: 'Tell me about your locally manufactured veterinary treatment syringes and ear tags.' },
        { label: 'Coffee Export Partnership', text: 'We want to inquire about importing Ethiopian specialty coffee (Yirgacheffe/Sidama).' },
        { label: 'Addis Ababa Office Location', text: 'Where is your Gofa Mebrat Hail office located and what are your direct phones?' },
      ];

  const getPillarBadge = (pillar?: BusinessPillar) => {
    switch (pillar) {
      case 'imports':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Imports</span>;
      case 'manufacturing':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Mfg</span>;
      case 'coffee':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Coffee</span>;
      case 'logistics':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Desk</span>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          aria-label="Open Amina Customer Support Chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-amber-700 hover:from-emerald-600 hover:to-amber-600 text-white shadow-2xl shadow-black/60 border border-emerald-400/30 transition-all transform hover:scale-105 active:scale-95 group font-sans"
        >
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-400/50 flex items-center justify-center font-bold text-amber-300 text-base shadow-inner">
              A
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">Amina</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                Support
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              {language === 'am' ? 'በቀጥታ ያናግሩን' : 'Chat with Agrifarm'}
            </p>
          </div>
        </button>
      )}

      {/* Expanded Chatbot Widget Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Amina Customer Support Chat"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[385px] h-[550px] max-h-[82vh] bg-slate-950/95 border border-emerald-800/60 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-md animate-fade-in font-sans"
        >
          {/* Widget Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 border-b border-emerald-800/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-500/50 flex items-center justify-center font-bold text-amber-300">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">Amina</h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Agrifarm PLC
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300/80 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>1-Day Quote SLA • Addis Ababa</span>
                </p>
              </div>
            </div>

            {/* Header controls: Language, Reset, Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'am' : 'en')}
                className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-300 text-[10px] font-bold border border-emerald-800/50 transition-colors"
                title="Switch Language (English / አማርኛ)"
              >
                {language === 'en' ? 'አማርኛ' : 'EN'}
              </button>

              <button
                onClick={onResetSession}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-300 hover:text-white border border-emerald-800/50 transition-colors"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onToggleOpen}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-red-900/40 text-emerald-300 hover:text-red-300 border border-emerald-800/50 transition-colors"
                title="Close Support Widget"
                aria-label="Close Support Widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
            {messages.map((msg) => {
              const isAmina = msg.sender === 'amina';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAmina ? 'justify-start' : 'justify-end'}`}
                >
                  {isAmina && (
                    <div className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-700 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0 mt-0.5">
                      A
                    </div>
                  )}

                  <div className={`max-w-[85%] flex flex-col ${isAmina ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-1.5 mb-0.5 text-[9px] text-emerald-400/60 px-1">
                      <span>{isAmina ? 'Amina' : 'You'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.pillar && getPillarBadge(msg.pillar)}
                    </div>

                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                        isAmina
                          ? 'bg-emerald-950/90 text-emerald-50 border border-emerald-800/50 rounded-tl-xs'
                          : 'bg-amber-600 text-white rounded-tr-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {isAmina && (
                        <div className="flex items-center justify-end gap-2 mt-1.5 pt-1.5 border-t border-emerald-800/40 text-[10px] text-emerald-300/80">
                          <button
                            onClick={() => copyText(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-amber-300 p-0.5 rounded"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isAmina && (
                    <div className="w-6 h-6 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-200 shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px]">
                  {language === 'am' ? 'አሚና መልስ እያዘጋጀች ነው...' : 'Amina is typing...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiry Chips */}
          <div className="px-3 py-1.5 bg-emerald-950/40 border-t border-emerald-900/60 overflow-x-auto flex items-center gap-1.5 custom-scrollbar shrink-0">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(qp.text)}
                className="shrink-0 px-2 py-1 rounded-md bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-800/40 text-[10px] text-emerald-200 hover:text-white transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Live Lead Status Notice when caller gives phone or items */}
          {currentLead.phone && (
            <div className="px-3 py-1 bg-emerald-900/30 border-t border-emerald-800/30 flex items-center justify-between text-[10px] text-emerald-300 shrink-0">
              <span className="flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Logged: {currentLead.phone}</span>
              </span>
              <span className="text-amber-300">1-Day Follow-Up</span>
            </div>
          )}

          {/* Chat Text Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-emerald-950/90 border-t border-emerald-800/60 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'am'
                  ? 'ስለ ግብርና እቃዎች፣ መርፌዎች ወይም ቡና ይጠይቁ...'
                  : 'Ask about equipment quotes, veterinary supplies, coffee...'
              }
              className="flex-1 bg-slate-950/90 border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400/70"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              aria-label="Send message"
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Micro Footer with Addis Ababa office details */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-emerald-950 text-[10px] text-emerald-400/70 flex items-center justify-between shrink-0">
            <span>Agrifarm PLC • Addis Ababa</span>
            <a
              href={`tel:${COMPANY_INFO.phones[0]}`}
              className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>+251 911 54 24 68</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
