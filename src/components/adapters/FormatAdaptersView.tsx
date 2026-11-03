import React, { useState, useMemo } from 'react';
import {
  ApprovedFact,
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  HtmlEmailExtraction,
  SrtAnalysisResult,
  SrtCaption,
  WebPageExtraction,
} from '../../types';
import { SAMPLE_FORMAT_ADAPTER_DATA } from '../../services/seedData';
import { runBrandAudit } from '../../services/auditEngine';
import {
  Globe,
  Mail,
  Film,
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  ArrowRight,
  Sparkles,
  Sliders,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface FormatAdaptersViewProps {
  approvedFacts: ApprovedFact[];
  guidelines: BrandGuideline[];
  claims: ClaimItem[];
  onRecordAuditLog: (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    relatedId?: string
  ) => void;
  onSendToAuditor: (
    text: string,
    meta?: {
      contentId?: string;
      source?: string;
      sourceTitle?: string;
      sourceContext?: string;
      srtTelemetry?: {
        captionCount: number;
        avgCps: number;
        maxCps: number;
        exceededCount: number;
        threshold: number;
      };
    }
  ) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const FormatAdaptersView: React.FC<FormatAdaptersViewProps> = ({
  approvedFacts,
  guidelines,
  claims,
  onRecordAuditLog,
  onSendToAuditor,
  showToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'url' | 'email' | 'srt'>('url');

  // ========================================================
  // SUB-TAB A: WEB PAGE URL ADAPTER STATE
  // ========================================================
  const [urlInput, setUrlInput] = useState<string>('https://fernwickpay.com/merchant-gateway');
  const [urlPasteTextInput, setUrlPasteTextInput] = useState<string>('');
  const [isUrlFetching, setIsUrlFetching] = useState<boolean>(false);
  const [urlExtraction, setUrlExtraction] = useState<WebPageExtraction | null>(() => {
    const sample = SAMPLE_FORMAT_ADAPTER_DATA.webUrls[0];
    return {
      url: sample.url,
      isValidUrl: true,
      isSimulated: true,
      pageTitle: sample.title,
      extractedText: sample.extractedText,
      extractedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wordCount: sample.extractedText.trim().split(/\s+/).length,
    };
  });
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Validate URL Helper
  const validateUrl = (raw: string): boolean => {
    try {
      const u = new URL(raw);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Fetch / Extract Web Page
  const handleExtractUrl = (overrideUrl?: string, overrideText?: string) => {
    const targetUrl = (overrideUrl || urlInput).trim();
    if (!validateUrl(targetUrl)) {
      setUrlValidationError('Invalid URL format. Must include http:// or https:// with a valid domain.');
      return;
    }
    setUrlValidationError(null);
    setIsUrlFetching(true);

    setTimeout(() => {
      // Find matching preset or use pasted text / simulated extraction
      const matchedPreset = SAMPLE_FORMAT_ADAPTER_DATA.webUrls.find((w) => w.url === targetUrl);
      const extractedText =
        overrideText ||
        urlPasteTextInput.trim() ||
        (matchedPreset ? matchedPreset.extractedText : `Extracted text from ${targetUrl}: Fernwick Pay enterprise checkout infrastructure.`);

      const extraction: WebPageExtraction = {
        url: targetUrl,
        isValidUrl: true,
        isSimulated: true, // Clearly labelled: browser cross-origin limits mean external page text is simulated or pasted
        pageTitle: matchedPreset ? matchedPreset.title : `Extracted Content from ${new URL(targetUrl).hostname}`,
        extractedText,
        extractedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wordCount: extractedText.trim().split(/\s+/).length,
      };

      setUrlExtraction(extraction);
      setIsUrlFetching(false);
      showToast('Web page content extracted successfully!', 'success');
      onRecordAuditLog(
        'Format Adapter: Web Page Extracted',
        'Format Adapter',
        `Extracted ${extraction.wordCount} words from URL: ${targetUrl} (Simulated CORS Extraction).`,
        'adapter-url'
      );
    }, 450);
  };

  // ========================================================
  // SUB-TAB B: HTML EMAIL ADAPTER STATE
  // ========================================================
  const [emailHtmlInput, setEmailHtmlInput] = useState<string>(
    SAMPLE_FORMAT_ADAPTER_DATA.htmlEmails[0].rawHtml
  );
  const [selectedEmailPresetIndex, setSelectedEmailPresetIndex] = useState<number>(0);

  // Safe HTML parser using browser DOMParser (strips scripts, styles, objects, comments)
  const emailExtractionResult: HtmlEmailExtraction = useMemo(() => {
    if (!emailHtmlInput.trim()) {
      return {
        rawHtml: '',
        extractedText: '',
        strippedTagsCount: 0,
        strippedScriptsCount: 0,
        wordCount: 0,
      };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(emailHtmlInput, 'text/html');

      // Count and strictly remove dangerous tags
      const scripts = doc.querySelectorAll('script');
      const scriptCount = scripts.length;
      scripts.forEach((s) => s.remove());

      const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
      styles.forEach((s) => s.remove());

      const iframes = doc.querySelectorAll('iframe, object, embed');
      iframes.forEach((f) => f.remove());

      // Remove inline event handlers
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith('on')) {
            el.removeAttribute(attr.name);
          }
        });
      });

      // Extract subject if present in title or heading
      const titleEl = doc.querySelector('title, h1, h2');
      const subject = titleEl?.textContent?.trim();

      // Extract body text with clean line breaks
      const bodyText = doc.body ? doc.body.textContent || '' : doc.documentElement.textContent || '';
      const cleanedText = bodyText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n\n');

      const wordCount = cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0;

      return {
        rawHtml: emailHtmlInput,
        extractedText: cleanedText,
        subject,
        strippedTagsCount: styles.length + iframes.length,
        strippedScriptsCount: scriptCount,
        wordCount,
      };
    } catch {
      return {
        rawHtml: emailHtmlInput,
        extractedText: emailHtmlInput.replace(/<[^>]*>?/gm, ' '),
        strippedTagsCount: 0,
        strippedScriptsCount: 0,
        wordCount: 0,
      };
    }
  }, [emailHtmlInput]);

  // Brand findings on extracted email text
  const emailAuditFindings: AuditFinding[] = useMemo(() => {
    if (!emailExtractionResult.extractedText) return [];
    return runBrandAudit(emailExtractionResult.extractedText, guidelines, claims, approvedFacts);
  }, [emailExtractionResult.extractedText, guidelines, claims, approvedFacts]);

  // Handle File Upload for HTML Email
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setEmailHtmlInput(content);
        showToast(`Loaded HTML file: ${file.name}`, 'success');
        onRecordAuditLog(
          'Format Adapter: HTML Email Uploaded',
          'Format Adapter',
          `Imported HTML email template: "${file.name}" (${file.size} bytes).`,
          'adapter-html'
        );
      }
    };
    reader.readAsText(file);
  };

  // ========================================================
  // SUB-TAB C: SRT SUBTITLE ADAPTER STATE
  // ========================================================
  const [srtInput, setSrtInput] = useState<string>(SAMPLE_FORMAT_ADAPTER_DATA.srtSubtitles[0].rawSrt);
  const [cpsThreshold, setCpsThreshold] = useState<number>(20); // Configurable threshold (default 20 CPS)

  // Parse Timestamp Helper (HH:MM:SS,mmm to seconds)
  const parseSrtTimestampToSeconds = (ts: string): number | null => {
    const match = ts.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const millis = parseInt(match[4], 10);
    return hours * 3600 + minutes * 60 + seconds + millis / 1000;
  };

  // Comprehensive SRT Parser & Analysis
  const srtAnalysis: SrtAnalysisResult = useMemo(() => {
    if (!srtInput.trim()) {
      return {
        rawSrtText: '',
        captions: [],
        totalCaptions: 0,
        thresholdCPS: cpsThreshold,
        exceedingCPSCount: 0,
        timingErrorsCount: 0,
        brandViolationsCount: 0,
        avgCPS: 0,
        maxCPS: 0,
        extractedFullText: '',
      };
    }

    // Split blocks by double newline or blank lines
    const rawBlocks = srtInput.split(/\r?\n\r?\n/).filter((b) => b.trim().length > 0);
    const captions: SrtCaption[] = [];
    let totalChars = 0;
    let totalDuration = 0;
    let maxCPS = 0;

    rawBlocks.forEach((block, bIdx) => {
      const lines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return;

      let indexNum = bIdx + 1;
      let timeLine = '';
      let textLines: string[] = [];

      if (/^\d+$/.test(lines[0]) && lines.length >= 2) {
        indexNum = parseInt(lines[0], 10);
        timeLine = lines[1];
        textLines = lines.slice(2);
      } else {
        timeLine = lines[0];
        textLines = lines.slice(1);
      }

      const text = textLines.join(' ');
      const charCount = text.length;

      // Validate timestamp format: "HH:MM:SS,mmm --> HH:MM:SS,mmm"
      const timeParts = timeLine.split(/\s*-->\s*/);
      let hasTimingError = false;
      let timingErrorReason: string | undefined = undefined;
      let startSec = 0;
      let endSec = 0;
      let duration = 0;

      if (timeParts.length !== 2) {
        hasTimingError = true;
        timingErrorReason = 'Malformed timestamp line (missing "-->" separator)';
      } else {
        const s = parseSrtTimestampToSeconds(timeParts[0]);
        const e = parseSrtTimestampToSeconds(timeParts[1]);

        if (s === null || e === null) {
          hasTimingError = true;
          timingErrorReason = 'Invalid timestamp formatting. Expected HH:MM:SS,mmm';
        } else if (e <= s) {
          hasTimingError = true;
          timingErrorReason = `Non-positive duration: End (${timeParts[1]}) <= Start (${timeParts[0]})`;
          startSec = s;
          endSec = e;
        } else {
          startSec = s;
          endSec = e;
          duration = Math.max(0.1, endSec - startSec);
        }
      }

      if (text.length === 0) {
        hasTimingError = true;
        timingErrorReason = timingErrorReason ? `${timingErrorReason} + Empty caption` : 'Empty caption text';
      }

      // CPS Calculation: Number of subtitle text characters ÷ Subtitle duration in seconds
      const cps = duration > 0 ? parseFloat((charCount / duration).toFixed(1)) : 0;
      const isExceeding = cps > cpsThreshold;

      if (cps > maxCPS) maxCPS = cps;
      if (duration > 0) {
        totalChars += charCount;
        totalDuration += duration;
      }

      // Check caption line for brand violations
      const brandIssues: string[] = [];
      if (/guaranteed instant approval/i.test(text)) {
        brandIssues.push('Unsupported Claim: "guaranteed instant approval"');
      }
      if (/100% unbreachable/i.test(text)) {
        brandIssues.push('Absolute Superlative: "100% unbreachable"');
      }
      if (/zero fees forever/i.test(text)) {
        brandIssues.push('Misleading Pricing: "zero fees forever"');
      }
      if (/blowing legacy competitors/i.test(text)) {
        brandIssues.push('Colloquial Hyperbole: "blowing legacy competitors"');
      }

      captions.push({
        index: indexNum,
        startTime: timeParts[0] || '00:00:00,000',
        endTime: timeParts[1] || '00:00:00,000',
        startSeconds: startSec,
        endSeconds: endSec,
        durationSeconds: parseFloat(duration.toFixed(2)),
        text,
        charCount,
        cps,
        isExceedingCPS: isExceeding,
        hasTimingError,
        timingErrorReason,
        brandViolations: brandIssues,
      });
    });

    const fullTranscript = captions.map((c) => c.text).filter(Boolean).join(' ');
    const exceedingCount = captions.filter((c) => c.isExceedingCPS).length;
    const timingErrorsCount = captions.filter((c) => c.hasTimingError).length;
    const brandViolationsCount = captions.filter((c) => c.brandViolations.length > 0).length;
    const avgCPS = totalDuration > 0 ? parseFloat((totalChars / totalDuration).toFixed(1)) : 0;

    return {
      rawSrtText: srtInput,
      captions,
      totalCaptions: captions.length,
      thresholdCPS: cpsThreshold,
      exceedingCPSCount: exceedingCount,
      timingErrorsCount,
      brandViolationsCount,
      avgCPS,
      maxCPS,
      extractedFullText: fullTranscript,
    };
  }, [srtInput, cpsThreshold]);

  // Handle File Upload for SRT
  const handleSrtFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSrtInput(content);
        showToast(`Loaded SRT file: ${file.name}`, 'success');
        onRecordAuditLog(
          'Format Adapter: SRT File Uploaded',
          'Format Adapter',
          `Parsed subtitle file "${file.name}" with ${content.length} characters.`,
          'adapter-srt'
        );
      }
    };
    reader.readAsText(file);
  };

  // Download Cleaned or Original SRT
  const handleDownloadSrt = () => {
    const blob = new Blob([srtInput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Canon_Preserved_Subtitles.srt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded preserved SRT file.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Format Adapters — Web Pages, HTML Emails & SRT Subtitles
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Multi-Format Governance
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Extract and audit brand compliance across web pages, HTML newsletters, and video subtitles.
              Extract clean text without executing untrusted scripts, calculate subtitle reading speed (CPS),
              and forward extracted transcripts directly to the Canon Content Auditor.
            </p>
          </div>
        </div>
      </div>

      {/* Format Selector Tab Strip */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'url'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>A. Web Page URLs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('email')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'email'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>B. HTML Emails</span>
        </button>

        <button
          onClick={() => setActiveSubTab('srt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'srt'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>C. SRT Subtitles & CPS</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB A: WEB PAGE URL ADAPTER
         ======================================================== */}
      {activeSubTab === 'url' && (
        <div className="space-y-5">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Web Page URL Ingestion & Extraction</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">URL Input & Text Extraction</span>
            </div>

            {/* Quick Preset Selector */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-300">Quick-Load Demo URLs:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_FORMAT_ADAPTER_DATA.webUrls.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(preset.url);
                      handleExtractUrl(preset.url, preset.extractedText);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer font-mono"
                  >
                    {preset.url}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input Form */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Web Page URL</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (urlValidationError) setUrlValidationError(null);
                  }}
                  placeholder="https://example.com/landing-page"
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={() => handleExtractUrl()}
                  disabled={isUrlFetching}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isUrlFetching ? 'Extracting...' : 'Extract Web Page'}</span>
                </button>
              </div>
              {urlValidationError && (
                <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{urlValidationError}</span>
                </div>
              )}
            </div>

            {/* Paste Fallback Option (Clearly Labelled) */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Direct Text Paste Fallback (For CORS Restricted Sites)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pasted / Simulated Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Browsers enforce Cross-Origin Resource Sharing (CORS), preventing live scrapers from
                querying arbitrary external domains. When direct fetch is restricted, paste the page text below.
              </p>
              <textarea
                rows={2}
                value={urlPasteTextInput}
                onChange={(e) => setUrlPasteTextInput(e.target.value)}
                placeholder="Paste raw web page text or HTML snippet here if live fetch is unavailable..."
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Extracted Web Content & Auditor Forwarding */}
          {urlExtraction && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-semibold text-white">{urlExtraction.pageTitle}</h4>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                    <span>Source: {urlExtraction.url}</span>
                    <span>·</span>
                    <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-900/60">
                      Simulated CORS Extraction
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onSendToAuditor(urlExtraction.extractedText, {
                        contentId: `content-web-${Date.now()}`,
                        source: 'Web Page URL Adapter',
                        sourceTitle: urlExtraction.pageTitle || urlInput,
                        sourceContext: `URL: ${urlExtraction.url} · Extracted ${urlExtraction.wordCount} words (${urlExtraction.isSimulated ? 'Simulated' : 'DOM Extraction'})`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Send to Canon Content Auditor</span>
                  </button>
                </div>
              </div>

              {/* Extracted Text Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Extracted Body Text ({urlExtraction.wordCount} words)</span>
                  <span>Extracted at {urlExtraction.extractedAt}</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed font-sans">
                  {urlExtraction.extractedText}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB B: HTML EMAIL ADAPTER
         ======================================================== */}
      {activeSubTab === 'email' && (
        <div className="space-y-5">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">HTML Email Parser & Brand Auditor</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Sanitized DOM Extraction</span>
            </div>

            {/* Presets & File Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Demo Samples:</span>
                {SAMPLE_FORMAT_ADAPTER_DATA.htmlEmails.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedEmailPresetIndex(idx);
                      setEmailHtmlInput(preset.rawHtml);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      selectedEmailPresetIndex === idx
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Sample {idx + 1}
                  </button>
                ))}
              </div>

              {/* Upload Input */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload .html File</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleHtmlFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Raw HTML Textarea */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Raw HTML Email Source (Scripts & styles strictly stripped before parsing)</span>
                <span className="font-mono text-[11px]">{emailHtmlInput.length} chars</span>
              </div>
              <textarea
                rows={5}
                value={emailHtmlInput}
                onChange={(e) => setEmailHtmlInput(e.target.value)}
                placeholder="Paste HTML email markup here..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 p-3 rounded-lg focus:outline-none focus:border-indigo-500 font-mono resize-y"
              />
            </div>
          </div>

          {/* Sanitized Extraction Preview & Brand Findings */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">
                    Extracted Email Body & Sanitization Telemetry
                  </h4>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span className="text-emerald-400">
                    {emailExtractionResult.strippedScriptsCount} Scripts Stripped
                  </span>
                  <span>·</span>
                  <span>{emailExtractionResult.strippedTagsCount} Styles Removed</span>
                  <span>·</span>
                  <span>{emailExtractionResult.wordCount} Clean Words</span>
                </div>
              </div>

              <button
                onClick={() =>
                  onSendToAuditor(emailExtractionResult.extractedText, {
                    contentId: `content-email-${Date.now()}`,
                    source: 'HTML Email Adapter',
                    sourceTitle: 'HTML Email Campaign',
                    sourceContext: `Cleaned HTML · ${emailExtractionResult.wordCount} words · ${emailExtractionResult.strippedScriptsCount} scripts stripped`,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Send to Content Auditor</span>
              </button>
            </div>

            {/* Extracted Clean Text */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Clean Extracted Email Copy</span>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {emailExtractionResult.extractedText || 'No text extracted.'}
              </div>
            </div>

            {/* Live Brand Compliance Findings on Email Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert
                    className={`w-4 h-4 ${
                      emailAuditFindings.length > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  />
                  <span>Canon Brand Governance Check on Email Content</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    emailAuditFindings.length > 0
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {emailAuditFindings.length} Violations
                </span>
              </div>

              {emailAuditFindings.length > 0 ? (
                <div className="space-y-2">
                  {emailAuditFindings.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                              f.severity === 'High'
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}
                          >
                            {f.severity}
                          </span>
                          <span className="font-semibold text-slate-200">{f.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <span className="text-rose-400 line-through mr-1">
                            &ldquo;{f.originalSegment}&rdquo;
                          </span>
                          <ArrowRight className="w-3 h-3 inline text-slate-500 mx-1" />
                          <span className="text-emerald-400">
                            Suggested Fix: &ldquo;{f.suggestedFix}&rdquo;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Extracted email content complies with active brand rules.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB C: SRT SUBTITLE ADAPTER WITH CPS METRICS
         ======================================================== */}
      {activeSubTab === 'srt' && (
        <div className="space-y-5">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  SRT Subtitle Parser, Timing Validator & Reading Speed (CPS)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Formula: CPS = Characters ÷ Duration (s)
              </span>
            </div>

            {/* Controls: Presets, Upload, and Configurable Threshold */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Demo Subtitles:</span>
                {SAMPLE_FORMAT_ADAPTER_DATA.srtSubtitles.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSrtInput(preset.rawSrt)}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {idx === 0 ? 'Fast Speech & Superlatives' : 'Timing Error & High CPS'}
                  </button>
                ))}

                {/* Upload Button */}
                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload .srt File</span>
                  <input type="file" accept=".srt" onChange={handleSrtFileUpload} className="hidden" />
                </label>
              </div>

              {/* Configurable CPS Threshold Slider */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-indigo-400" />
                    <span>Configurable CPS Threshold:</span>
                    <span className="font-mono text-indigo-400 font-bold">{cpsThreshold} CPS</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Industry Default: 20 CPS (Max recommended for readability)
                  </div>
                </div>
                <input
                  type="range"
                  min="12"
                  max="30"
                  step="1"
                  value={cpsThreshold}
                  onChange={(e) => setCpsThreshold(parseInt(e.target.value, 10))}
                  className="w-24 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Raw SRT Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Original Subtitle File Content (Preserved without silent timing mutations)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSrt}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Preserved SRT</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={srtInput}
                onChange={(e) => setSrtInput(e.target.value)}
                placeholder="Paste SRT subtitles here..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 p-3 rounded-lg focus:outline-none focus:border-indigo-500 font-mono resize-y"
              />
            </div>
          </div>

          {/* Subtitle Telemetry & Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Captions</div>
              <div className="text-xl font-bold text-white mt-0.5">{srtAnalysis.totalCaptions}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Average / Max CPS</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">
                {srtAnalysis.avgCPS}{' '}
                <span className="text-xs font-normal text-slate-500">/ {srtAnalysis.maxCPS}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Exceeding {cpsThreshold} CPS</div>
              <div
                className={`text-xl font-bold mt-0.5 ${
                  srtAnalysis.exceedingCPSCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {srtAnalysis.exceedingCPSCount}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Timing & Brand Errors</div>
              <div
                className={`text-xl font-bold mt-0.5 ${
                  srtAnalysis.timingErrorsCount + srtAnalysis.brandViolationsCount > 0
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {srtAnalysis.timingErrorsCount + srtAnalysis.brandViolationsCount}
              </div>
            </div>
          </div>

          {/* Detailed Captions Analysis Ledger Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white">
                  Caption Readability (CPS) & Brand Governance Breakdown
                </h4>
              </div>

              <button
                onClick={() =>
                  onSendToAuditor(srtAnalysis.extractedFullText, {
                    contentId: `content-srt-${Date.now()}`,
                    source: 'SRT Subtitles Adapter',
                    sourceTitle: 'Video Subtitle Transcript',
                    sourceContext: `${srtAnalysis.totalCaptions} Captions · Avg ${srtAnalysis.avgCPS} CPS (Max: ${srtAnalysis.maxCPS} CPS)`,
                    srtTelemetry: {
                      captionCount: srtAnalysis.totalCaptions,
                      avgCps: srtAnalysis.avgCPS,
                      maxCps: srtAnalysis.maxCPS,
                      exceededCount: srtAnalysis.exceedingCPSCount,
                      threshold: cpsThreshold,
                    },
                  })
                }
                disabled={!srtAnalysis.extractedFullText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Send Subtitle Transcript to Content Auditor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Timecodes & Duration</th>
                    <th className="py-2.5 px-3">Caption Text</th>
                    <th className="py-2.5 px-3">Length & CPS Rate</th>
                    <th className="py-2.5 px-3">Readability Status</th>
                    <th className="py-2.5 px-3">Brand Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {srtAnalysis.captions.map((cap) => (
                    <tr
                      key={cap.index}
                      className={`hover:bg-slate-950/40 transition-colors ${
                        cap.isExceedingCPS || cap.hasTimingError ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3 align-top font-mono text-slate-400 font-bold">
                        {cap.index}
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        <div>
                          {cap.startTime} &rarr; {cap.endTime}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Duration: <span className="text-slate-300">{cap.durationSeconds}s</span>
                        </div>
                        {cap.hasTimingError && (
                          <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{cap.timingErrorReason}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-slate-200 max-w-[300px]">
                        <p className="leading-relaxed">{cap.text}</p>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[11px] whitespace-nowrap">
                        <div className="text-slate-400">{cap.charCount} characters</div>
                        <div className="font-bold text-xs mt-0.5">
                          <span
                            className={
                              cap.isExceedingCPS ? 'text-rose-400 font-bold' : 'text-emerald-400'
                            }
                          >
                            {cap.cps} CPS
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono">
                        {cap.isExceedingCPS ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 inline-block">
                            &gt; {cpsThreshold} CPS (Fast Speech)
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 inline-block">
                            Normal (&le; {cpsThreshold} CPS)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-xs">
                        {cap.brandViolations.length > 0 ? (
                          <div className="space-y-1">
                            {cap.brandViolations.map((v, vIdx) => (
                              <span
                                key={vIdx}
                                className="block text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-900 px-1.5 py-0.5 rounded"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Compliant
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
