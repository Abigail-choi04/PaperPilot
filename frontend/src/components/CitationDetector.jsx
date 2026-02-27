import { useState } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const CITABLE_SECTIONS = ["abstract", "introduction", "methodology", "results", "conclusion"];

const C = {
  bg:      "#0B0B0F",
  surface: "#13131A",
  card:    "#1A1A24",
  border:  "#2A2A3A",
  accent:  "#7C6AF7",
  accentL: "#9D94F9",
  muted:   "#6B6B80",
  text:    "#E8E8F0",
  sub:     "#A0A0B8",
  green:   "#4CAF7D",
  red:     "#E05C5C",
  gold:    "#E8B84B",
  orange:  "#E8934B",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap');

  .cd-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .cd-wrap {
    background: ${C.bg}; min-height: 100vh;
    font-family: 'Outfit', sans-serif; color: ${C.text}; padding: 48px 24px;
  }
  .cd-inner { max-width: 860px; margin: 0 auto; }

  .cd-header { margin-bottom: 40px; }
  .cd-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: ${C.orange}; margin-bottom: 10px;
  }
  .cd-title {
    font-family: 'Libre Baskerville', serif; font-size: 34px;
    font-weight: 400; color: ${C.text}; margin-bottom: 8px; line-height: 1.2;
  }
  .cd-desc { font-size: 14px; color: ${C.muted}; font-weight: 300; line-height: 1.6; max-width: 560px; }

  /* ── Input area ── */
  .cd-input-card {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 32px; margin-bottom: 24px;
  }
  .cd-section-tabs {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
  }
  .cd-tab {
    padding: 6px 14px; border: 1px solid ${C.border}; border-radius: 20px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; background: none; color: ${C.muted};
    transition: all 0.15s;
  }
  .cd-tab:hover { border-color: ${C.muted}; color: ${C.text}; }
  .cd-tab.active { border-color: ${C.orange}; color: ${C.orange}; background: rgba(232,147,75,0.08); }

  .cd-textarea {
    width: 100%; background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 8px; color: ${C.text}; font-family: 'Outfit', sans-serif;
    font-size: 14px; padding: 16px; outline: none; resize: vertical;
    min-height: 180px; line-height: 1.7; transition: border-color 0.15s;
  }
  .cd-textarea:focus { border-color: ${C.orange}; }

  .cd-footer-row {
    display: flex; align-items: center;
    justify-content: space-between; margin-top: 14px;
  }
  .cd-word-count {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: ${C.muted}; letter-spacing: 1px;
  }
  .cd-run-btn {
    padding: 10px 24px; background: ${C.orange}; border: none;
    border-radius: 6px; color: ${C.bg}; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; font-weight: 500; transition: all 0.2s;
  }
  .cd-run-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .cd-run-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Loading ── */
  .cd-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 0; gap: 20px;
  }
  .cd-dots { display: flex; gap: 6px; }
  .cd-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${C.orange}; animation: cdpulse 1.1s ease-in-out infinite;
  }
  .cd-dot:nth-child(2) { animation-delay: 0.18s; }
  .cd-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes cdpulse {
    0%,100% { opacity: 0.2; transform: scale(0.75); }
    50%      { opacity: 1;   transform: scale(1); }
  }
  .cd-loading-text {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase; color: ${C.muted};
  }

  /* ── Results ── */
  .cd-results { animation: cdfade 0.3s ease; }
  @keyframes cdfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .cd-results-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .cd-results-title {
    font-family: 'Libre Baskerville', serif; font-size: 20px;
    font-style: italic; color: ${C.text};
  }
  .cd-summary-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    letter-spacing: 1px; padding: 5px 14px; border-radius: 20px;
  }
  .cd-summary-badge.has-flags {
    background: rgba(232,147,75,0.12); border: 1px solid rgba(232,147,75,0.3);
    color: ${C.orange};
  }
  .cd-summary-badge.clean {
    background: rgba(76,175,125,0.1); border: 1px solid rgba(76,175,125,0.25);
    color: ${C.green};
  }

  /* ── Clean state ── */
  .cd-clean {
    text-align: center; padding: 48px 0;
  }
  .cd-clean-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.6; }
  .cd-clean-text {
    font-family: 'Libre Baskerville', serif; font-size: 18px;
    font-style: italic; color: ${C.text}; margin-bottom: 8px;
  }
  .cd-clean-sub { font-size: 13px; color: ${C.muted}; font-weight: 300; }

  /* ── Section block ── */
  .cd-section-block { margin-bottom: 28px; }
  .cd-section-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    letter-spacing: 2px; text-transform: uppercase;
    color: ${C.orange}; margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .cd-section-label::after {
    content: ''; flex: 1; height: 1px; background: ${C.border};
  }
  .cd-count-badge {
    background: rgba(232,147,75,0.12); border: 1px solid rgba(232,147,75,0.2);
    border-radius: 10px; padding: 2px 8px;
    font-size: 10px; color: ${C.orange};
  }

  /* ── Flag card ── */
  .cd-flag {
    background: ${C.card}; border: 1px solid ${C.border};
    border-left: 3px solid ${C.orange}; border-radius: 8px;
    padding: 16px 20px; margin-bottom: 10px;
    animation: cdfade 0.25s ease both;
  }
  .cd-flag-sentence {
    font-size: 14px; color: ${C.text}; line-height: 1.6;
    margin-bottom: 10px; font-style: italic;
  }
  .cd-flag-sentence::before { content: '"'; color: ${C.orange}; margin-right: 2px; }
  .cd-flag-sentence::after  { content: '"'; color: ${C.orange}; margin-left: 2px; }
  .cd-flag-reason {
    font-size: 12px; color: ${C.muted}; line-height: 1.5;
    display: flex; align-items: flex-start; gap: 8px;
  }
  .cd-flag-icon {
    font-size: 12px; margin-top: 1px; flex-shrink: 0;
  }

  /* ── Error ── */
  .cd-error {
    padding: 14px 18px; background: rgba(224,92,92,0.08);
    border: 1px solid rgba(224,92,92,0.2); border-radius: 8px;
    font-size: 13px; color: #e08080; margin-top: 16px; line-height: 1.5;
  }

  /* ── Reset btn ── */
  .cd-reset {
    margin-top: 32px; padding: 10px 20px; background: none;
    border: 1px solid ${C.border}; border-radius: 6px;
    color: ${C.muted}; font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .cd-reset:hover { border-color: ${C.muted}; color: ${C.text}; }
`;

// ─── Groq call ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an academic writing assistant specializing in research paper integrity.
Your job is to identify sentences that make factual claims, cite statistics, reference prior work,
or make non-obvious statements that require a citation but do not have one.

Rules:
- Only flag sentences that genuinely need a citation
- Do NOT flag common knowledge (e.g., "water boils at 100 degrees")
- Do NOT flag the paper's own findings or contributions
- Do NOT flag sentences that already contain a citation marker like [1], [2], (Author, Year), etc.
- Be concise in your reasons

Respond ONLY with a valid JSON array. No preamble, no markdown backticks. Format:
[
  { "sentence": "the sentence that needs a citation", "reason": "brief reason why" }
]
If no citations are needed, return an empty array: []`;

async function analyzeSection(sectionName, text) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: `Section: ${sectionName.toUpperCase()}\n\n${text}` },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let raw = data.choices[0].message.content.trim();
  if (raw.startsWith("```")) {
    raw = raw.split("```")[1];
    if (raw.startsWith("json")) raw = raw.slice(4);
  }
  return JSON.parse(raw.trim());
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CitationDetector() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [texts,         setTexts]         = useState({});
  const [loading,       setLoading]       = useState(false);
  const [results,       setResults]       = useState(null);
  const [error,         setError]         = useState("");

  const currentText = texts[activeSection] || "";
  const wordCount   = currentText.trim().split(/\s+/).filter(Boolean).length;

  const hasAnyText = CITABLE_SECTIONS.some((s) => texts[s]?.trim().length > 20);

  const run = async () => {
    setLoading(true);
    setError("");
    setResults(null);

    const allResults = {};

    try {
      for (const section of CITABLE_SECTIONS) {
        const text = texts[section];
        if (!text || text.trim().length < 20) continue;
        const flagged = await analyzeSection(section, text);
        if (flagged.length > 0) allResults[section] = flagged;
      }
      setResults(allResults);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalFlags = results
    ? Object.values(results).reduce((acc, arr) => acc + arr.length, 0)
    : 0;

  const reset = () => { setResults(null); setError(""); };

  return (
    <>
      <style>{css}</style>
      <div className="cd-wrap">
        <div className="cd-inner">

          {/* Header */}
          <div className="cd-header">
            <div className="cd-tag">Feature — Citation Detector</div>
            <h1 className="cd-title">Citation Gap Detector</h1>
            <p className="cd-desc">
              Paste each section of your paper and we'll flag sentences that make claims
              without a citation — before peer review does.
            </p>
          </div>

          {/* Input */}
          {!results && (
            <div className="cd-input-card">
              {/* Section tabs */}
              <div className="cd-section-tabs">
                {CITABLE_SECTIONS.map((s) => (
                  <button
                    key={s}
                    className={`cd-tab ${activeSection === s ? "active" : ""}`}
                    onClick={() => setActiveSection(s)}
                  >
                    {texts[s]?.trim() ? "✓ " : ""}{s}
                  </button>
                ))}
              </div>

              {/* Textarea for active section */}
              <textarea
                key={activeSection}
                className="cd-textarea"
                placeholder={`Paste your ${activeSection} here…`}
                value={currentText}
                onChange={(e) =>
                  setTexts((p) => ({ ...p, [activeSection]: e.target.value }))
                }
              />

              <div className="cd-footer-row">
                <span className="cd-word-count">
                  {wordCount} words · {CITABLE_SECTIONS.filter((s) => texts[s]?.trim().length > 20).length} / {CITABLE_SECTIONS.length} sections filled
                </span>
                <button
                  className="cd-run-btn"
                  onClick={run}
                  disabled={loading || !hasAnyText}
                >
                  {loading ? "Scanning…" : "Scan for Citations →"}
                </button>
              </div>

              {error && <div className="cd-error">{error}</div>}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="cd-loading">
              <div className="cd-dots">
                <div className="cd-dot"/><div className="cd-dot"/><div className="cd-dot"/>
              </div>
              <div className="cd-loading-text">Scanning sections…</div>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="cd-results">
              <div className="cd-results-header">
                <div className="cd-results-title">Scan Complete</div>
                <div className={`cd-summary-badge ${totalFlags > 0 ? "has-flags" : "clean"}`}>
                  {totalFlags > 0 ? `${totalFlags} citation gap${totalFlags > 1 ? "s" : ""} found` : "No gaps found"}
                </div>
              </div>

              {totalFlags === 0 ? (
                <div className="cd-clean">
                  <div className="cd-clean-icon">✓</div>
                  <div className="cd-clean-text">All sections look well-cited.</div>
                  <div className="cd-clean-sub">No sentences flagged as needing a citation.</div>
                </div>
              ) : (
                Object.entries(results).map(([section, flags]) => (
                  <div className="cd-section-block" key={section}>
                    <div className="cd-section-label">
                      {section}
                      <span className="cd-count-badge">{flags.length}</span>
                    </div>
                    {flags.map((flag, i) => (
                      <div className="cd-flag" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="cd-flag-sentence">{flag.sentence}</div>
                        <div className="cd-flag-reason">
                          <span className="cd-flag-icon">⚠</span>
                          {flag.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}

              <button className="cd-reset" onClick={reset}>← Scan Another Paper</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
