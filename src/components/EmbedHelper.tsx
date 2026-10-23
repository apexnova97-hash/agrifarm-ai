/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
  Download,
  Layers,
  ArrowRight
} from 'lucide-react';

interface EmbedHelperProps {
  appUrl: string;
}

export const EmbedHelper: React.FC<EmbedHelperProps> = ({ appUrl }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const cleanAppUrl = appUrl || window.location.origin;

  // Iframe snippet for Netlify site
  const iframeSnippet = `<!-- Amina AI Customer Support Widget for Agrifarm PLC -->
<div id="amina-chat-widget-container" style="position:fixed;bottom:20px;right:20px;z-index:999999;">
  <iframe
    id="amina-widget-frame"
    src="${cleanAppUrl}/"
    title="Amina - Agrifarm Customer Support"
    style="width:400px;height:600px;border:none;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.5);background:transparent;"
    allow="clipboard-write"
  ></iframe>
</div>`;

  // Script snippet for Netlify index.html
  const scriptSnippet = `<!-- Add this snippet right before </body> in your https://agrifarm-plc.netlify.app/ index.html -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${cleanAppUrl}/';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.borderRadius = '24px';
    iframe.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
    iframe.title = 'Amina Agrifarm AI Assistant';
    document.body.appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = (text: string, type: 'script' | 'iframe') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-emerald-900/60 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Integration Snippets for Netlify</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Embed Amina into https://agrifarm-plc.netlify.app/
        </h2>
        <p className="text-xs sm:text-sm text-emerald-300/80 mt-1">
          Add this floating AI customer-support widget to your existing Netlify website with zero disruption to your current design.
        </p>
      </div>

      {/* Snippet Card 1: Script tag */}
      <div className="bg-slate-950/80 rounded-2xl border border-emerald-800/50 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Option 1: Single &lt;script&gt; Tag (Recommended)</span>
          </span>
          <button
            onClick={() => copyToClipboard(scriptSnippet, 'script')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition-all"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
          </button>
        </div>
        <pre className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-900/70 text-xs font-mono text-emerald-200 overflow-x-auto custom-scrollbar">
          {scriptSnippet}
        </pre>
      </div>

      {/* Snippet Card 2: Iframe tag */}
      <div className="bg-slate-950/80 rounded-2xl border border-emerald-800/50 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Option 2: Direct &lt;iframe&gt; Tag</span>
          </span>
          <button
            onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition-all"
          >
            {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIframe ? 'Copied' : 'Copy HTML'}</span>
          </button>
        </div>
        <pre className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-900/70 text-xs font-mono text-emerald-200 overflow-x-auto custom-scrollbar">
          {iframeSnippet}
        </pre>
      </div>

      {/* Security & Server-Side Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Server-Side Gemini API</span>
          </div>
          <p className="text-emerald-200/70">
            API keys are kept strictly on the Node/Express backend (`/api/amina/chat`) and never exposed to the browser.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Netlify Compatibility</span>
          </div>
          <p className="text-emerald-200/70">
            Leaves your Netlify site styles and DOM completely untouched, running cleanly in its own isolated frame.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-300 font-bold">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Bilingual &amp; Guardrails</span>
          </div>
          <p className="text-emerald-200/70">
            Full English and Amharic support with Agrifarm's strict 2-3 sentence limit and 1 business day SLA.
          </p>
        </div>
      </div>
    </div>
  );
};
