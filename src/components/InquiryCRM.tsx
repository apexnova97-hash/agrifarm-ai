/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ClipboardList,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  Copy,
  Check,
  Building,
  CheckCircle2,
  Send,
  PlusCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { LeadInfo, SupportedLanguage, COMPANY_INFO } from '../utils/aminaLogic.ts';

interface InquiryCRMProps {
  currentLead: Partial<LeadInfo>;
  onUpdateLead: (lead: Partial<LeadInfo>) => void;
  language: SupportedLanguage;
}

export const InquiryCRM: React.FC<InquiryCRMProps> = ({
  currentLead,
  onUpdateLead,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [callerName, setCallerName] = useState(currentLead.callerName || '');
  const [phone, setPhone] = useState(currentLead.phone || '');
  const [email, setEmail] = useState(currentLead.email || '');
  const [itemsOrVolume, setItemsOrVolume] = useState(currentLead.itemsOrVolume || '');
  const [destination, setDestination] = useState(currentLead.destinationOrLocation || '');
  const [notes, setNotes] = useState(currentLead.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if currentLead prop changes externally
  React.useEffect(() => {
    if (currentLead.callerName) setCallerName(currentLead.callerName);
    if (currentLead.phone) setPhone(currentLead.phone);
    if (currentLead.email) setEmail(currentLead.email);
    if (currentLead.itemsOrVolume) setItemsOrVolume(currentLead.itemsOrVolume);
    if (currentLead.destinationOrLocation) setDestination(currentLead.destinationOrLocation);
    if (currentLead.notes) setNotes(currentLead.notes);
  }, [currentLead]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLead({
      callerName,
      phone,
      email,
      itemsOrVolume,
      destinationOrLocation: destination,
      notes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const generateInquiryText = () => {
    return `===================================================
AGRIFARM AGRICULTURAL INPUTS & EQUIPMENT IMPORT PLC
INQUIRY & QUOTE REQUEST SLIP
===================================================
Date / Time: ${new Date().toLocaleString()}
Business Category: ${currentLead.pillar ? currentLead.pillar.toUpperCase() : 'GENERAL / FARM'}
Follow-Up SLA: Within 1 Business Day (Guaranteed)

CALLER DETAILS:
- Name: ${callerName || 'Prospective Client'}
- Phone: ${phone || 'Not provided'}
- Email: ${email || 'Not provided'}
- Location / Target Destination: ${destination || 'Ethiopia / Global'}

REQUEST DETAILS:
- Items / Volume Requested: ${itemsOrVolume || 'Standard Quote Inquiry'}
- Detailed Notes: ${notes || 'Captured via Amina Voice Desk'}

OFFICE & SALES ROUTING:
- Agrifarm PLC, Gofa Mebrat Hail Condominium, Addis Ababa, Ethiopia
- Sales Desk Phone: +251 911 54 24 68 / +251 963 65 65 65
- Official Email: agrifarm2009@gmail.com
===================================================`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateInquiryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSlip = () => {
    const element = document.createElement('a');
    const file = new Blob([generateInquiryText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Agrifarm_Inquiry_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const mailtoLink = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
    `Inquiry Quote Request - ${callerName || 'Client'} [${currentLead.pillar || 'General'}]`
  )}&body=${encodeURIComponent(generateInquiryText())}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-900/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-Time Lead & Quote Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'am' ? 'የጥያቄ እና የዋጋ መዝገብ' : 'Inquiry CRM & Sales Dispatch Desk'}
          </h2>
          <p className="text-sm text-emerald-300/80 max-w-2xl mt-1">
            {language === 'am'
              ? 'በአሚና የድምፅ ጥሪ ወቅት የተመዘገቡ የደንበኛ መረጃዎች፣ የዕቃ ጥያቄዎች እና የቡና ኤክስፖርት ትዕዛዞች።'
              : 'Auto-captured caller information, quote requests, and export specifications for follow-up by the Addis Ababa team.'}
          </p>
        </div>

        {/* SLA Card */}
        <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {COMPANY_INFO.sla}
            </p>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Contact: +251 911 54 24 68 / agrifarm2009@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lead Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-3xl border border-emerald-800/40 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'am' ? 'የደንበኛ መረጃ ቅጽ' : 'Caller & Inquiry Details'}</span>
            </span>
            {isSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in font-normal">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  {language === 'am' ? 'የደንበኛ ስም' : 'Caller / Company Name'}
                </label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="e.g. Ato Dawit / Green Horizon Farm"
                  className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number (Ethiopia / Int.)'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +251 911 54 24 68"
                  className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  {language === 'am' ? 'ኢሜይል' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  {language === 'am' ? 'አካባቢ / መዳረሻ ሀገር' : 'Location / Destination Port'}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Addis Ababa / Hawassa / Hamburg Port"
                  className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">
                {language === 'am' ? 'የተጠየቀው እቃ / መጠን' : 'Requested Items or Volume'}
              </label>
              <input
                type="text"
                value={itemsOrVolume}
                onChange={(e) => setItemsOrVolume(e.target.value)}
                placeholder="e.g. 50 Knapsack Sprayers 20L / 1 Container Sidama Washed Gr 2"
                className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">
                {language === 'am' ? 'ተጨማሪ ማስታወሻ' : 'Notes / Special Requirements'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needs sample delivery before signing export contract..."
                className="w-full bg-emerald-950/80 border border-emerald-800/50 rounded-xl p-3 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/50"
              >
                {language === 'am' ? 'መረጃውን መዝግብ' : 'Save / Update Record'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Dispatch Slip & Export Actions (5 cols) */}
        <div className="lg:col-span-5 bg-emerald-950/60 rounded-3xl border border-emerald-800/40 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Formal Inquiry Slip</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1 Business Day SLA
              </span>
            </div>

            {/* Formatted Receipt Box */}
            <div className="bg-slate-950/90 rounded-2xl p-4 border border-emerald-900/60 text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar">
              {generateInquiryText()}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 mt-4 pt-3 border-t border-emerald-900/60">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyToClipboard}
                className="py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={downloadSlip}
                className="py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>

            <a
              href={mailtoLink}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Email Slip to agrifarm2009@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
