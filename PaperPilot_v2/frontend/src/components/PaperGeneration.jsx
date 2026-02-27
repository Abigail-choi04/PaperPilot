import { useState } from "react";

const API_BASE = "http://localhost:8000";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
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
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap');
  .pg-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .pg-wrap { background: ${C.bg}; min-height: 100vh; font-family: 'Outfit', sans-serif; color: ${C.text}; padding: 40px 0; }
  .pg-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
  .progress-bar { display: flex; align-items: flex-start; gap: 0; margin-bottom: 48px; position: relative; }
  .progress-track { position: absolute; top: 15px; left: 15px; right: 15px; height: 2px; background: ${C.border}; z-index: 0; }
  .progress-fill { height: 100%; background: ${C.accent}; transition: width 0.4s ease; }
  .step-dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; z-index: 1; }
  .step-dot { width: 30px; height: 30px; border-radius: 50%; border: 2px solid ${C.border}; background: ${C.bg}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${C.muted}; transition: all 0.3s; }
  .step-dot.active { border-color: ${C.accent}; background: ${C.accent}; color: white; box-shadow: 0 0 16px rgba(124,106,247,0.4); }
  .step-dot.done { border-color: ${C.green}; background: ${C.green}; color: white; }
  .step-label { font-size: 9px; color: ${C.muted}; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; text-transform: uppercase; text-align: center; white-space: nowrap; }
  .step-label.active { color: ${C.accent}; }
  .step-label.done { color: ${C.green}; }
  .pg-card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 12px; padding: 40px; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .pg-step-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.accent}; margin-bottom: 10px; }
  .pg-card-title { font-family: 'Libre Baskerville', serif; font-size: 28px; font-weight: 400; color: ${C.text}; margin-bottom: 6px; line-height: 1.3; }
  .pg-card-desc { font-size: 13px; color: ${C.muted}; margin-bottom: 32px; font-weight: 300; line-height: 1.6; }
  .field { margin-bottom: 20px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .field-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 8px; display: block; }
  .pg-input, .pg-select { width: 100%; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 6px; color: ${C.text}; font-family: 'Outfit', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
  .pg-input:focus, .pg-select:focus { border-color: ${C.accent}; }
  .pg-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236B6B80'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  .author-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
  .author-tag { display: flex; align-items: center; gap: 6px; background: rgba(124,106,247,0.12); border: 1px solid rgba(124,106,247,0.25); border-radius: 20px; padding: 4px 12px; font-size: 13px; color: ${C.accentL}; }
  .author-tag button { background: none; border: none; color: ${C.muted}; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; transition: color 0.15s; }
  .author-tag button:hover { color: ${C.red}; }
  .author-add-row { display: flex; gap: 8px; }
  .author-add-row .pg-input { flex: 1; }
  .btn-add { padding: 10px 16px; background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3); border-radius: 6px; color: ${C.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-add:hover { background: rgba(124,106,247,0.25); }
  .pg-textarea { width: 100%; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 6px; color: ${C.text}; font-family: 'Outfit', sans-serif; font-size: 14px; padding: 14px; outline: none; resize: vertical; min-height: 200px; line-height: 1.7; transition: border-color 0.15s; }
  .pg-textarea:focus { border-color: ${C.accent}; }
  .pg-textarea.polishing { border-color: rgba(124,106,247,0.4); background: rgba(124,106,247,0.03); }
  .textarea-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .char-count { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${C.muted}; letter-spacing: 1px; }
  .polish-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; background: none; border: 1px solid ${C.border}; border-radius: 6px; color: ${C.sub}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .polish-btn:hover:not(:disabled) { border-color: ${C.gold}; color: ${C.gold}; background: rgba(232,184,75,0.06); }
  .polish-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .gen-dot { width: 6px; height: 6px; border-radius: 50%; background: ${C.gold}; animation: blink 1s ease-in-out infinite; }
  @keyframes blink { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
  .diff-panel { margin-top: 16px; border: 1px solid ${C.border}; border-radius: 8px; overflow: hidden; animation: slideUp 0.25s ease; }
  .diff-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: ${C.surface}; border-bottom: 1px solid ${C.border}; }
  .diff-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.gold}; }
  .diff-actions { display: flex; gap: 8px; }
  .diff-btn { padding: 5px 14px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; cursor: pointer; border: 1px solid; transition: all 0.15s; }
  .diff-btn.accept { border-color: ${C.green}; color: ${C.green}; background: rgba(76,175,125,0.08); }
  .diff-btn.accept:hover { background: rgba(76,175,125,0.18); }
  .diff-btn.reject { border-color: ${C.border}; color: ${C.muted}; background: none; }
  .diff-btn.reject:hover { border-color: ${C.muted}; color: ${C.text}; }
  .diff-body { padding: 16px; font-size: 13px; color: ${C.sub}; line-height: 1.75; font-weight: 300; white-space: pre-wrap; max-height: 220px; overflow-y: auto; }
  .diff-changes { padding: 10px 16px; background: rgba(76,175,125,0.05); border-top: 1px solid ${C.border}; font-size: 11px; color: ${C.muted}; font-family: 'JetBrains Mono', monospace; }
  .pg-error { margin-top: 12px; padding: 10px 14px; background: rgba(224,92,92,0.08); border: 1px solid rgba(224,92,92,0.2); border-radius: 6px; font-size: 12px; color: #e08080; line-height: 1.5; }
  .pg-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid ${C.border}; }
  .btn-back { padding: 11px 24px; background: none; border: 1px solid ${C.border}; border-radius: 6px; color: ${C.muted}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; cursor: pointer; transition: all 0.15s; }
  .btn-back:hover { border-color: ${C.muted}; color: ${C.text}; }
  .btn-next { padding: 11px 28px; background: ${C.accent}; border: none; border-radius: 6px; color: white; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .btn-next:hover:not(:disabled) { background: ${C.accentL}; transform: translateY(-1px); }
  .btn-next:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .review-meta { background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
  .review-meta-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .review-meta-row:last-child { margin-bottom: 0; }
  .review-meta-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${C.muted}; letter-spacing: 1px; text-transform: uppercase; min-width: 90px; padding-top: 2px; }
  .review-meta-val { color: ${C.text}; font-size: 13px; }
  .review-section { margin-bottom: 12px; border: 1px solid ${C.border}; border-radius: 8px; overflow: hidden; }
  .review-section-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: ${C.surface}; cursor: pointer; transition: background 0.15s; }
  .review-section-header:hover { background: rgba(255,255,255,0.02); }
  .review-section-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.accent}; }
  .review-section-body { padding: 16px 18px; font-size: 13px; color: ${C.sub}; line-height: 1.7; white-space: pre-wrap; font-weight: 300; border-top: 1px solid ${C.border}; }
  .format-chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  .format-chip { padding: 8px 20px; border: 1px solid ${C.border}; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; cursor: pointer; transition: all 0.15s; background: none; color: ${C.muted}; text-transform: uppercase; }
  .format-chip:hover { border-color: ${C.muted}; color: ${C.text}; }
  .format-chip.active { border-color: ${C.accent}; color: ${C.accent}; background: rgba(124,106,247,0.08); }
  .export-result { background: rgba(76,175,125,0.08); border: 1px solid rgba(76,175,125,0.25); border-radius: 8px; padding: 20px; margin-top: 20px; animation: slideUp 0.3s ease; }
  .export-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.green}; margin-bottom: 10px; }
  .export-file { font-size: 13px; color: ${C.sub}; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
  .export-file span { color: ${C.green}; }
  .spin-dots { display: flex; gap: 5px; }
  .spin-dot { width: 5px; height: 5px; border-radius: 50%; background: ${C.accent}; animation: blink 1s ease-in-out infinite; }
  .spin-dot:nth-child(2) { animation-delay: 0.15s; }
  .spin-dot:nth-child(3) { animation-delay: 0.3s; }
  .export-loading { display: flex; align-items: center; gap: 12px; padding: 16px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; color: ${C.muted}; text-transform: uppercase; }
`;

async function callGroq(systemPrompt, userMessage) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

const SECTION_STEPS = [
  { key: "abstract",     label: "Abstract",    title: "Abstract",     desc: "A concise summary of your research — problem, approach, and key findings.",           placeholder: "Write your abstract here..."       },
  { key: "introduction", label: "Intro",        title: "Introduction", desc: "Introduce the problem, motivate your work, and outline your contributions.",          placeholder: "Write your introduction here..."    },
  { key: "methodology",  label: "Method",       title: "Methodology",  desc: "Describe your approach, system design, algorithms, or experimental setup.",           placeholder: "Write your methodology here..."     },
  { key: "results",      label: "Results",      title: "Results",      desc: "Present your findings, measurements, and experimental outcomes.",                     placeholder: "Write your results here..."         },
  { key: "discussion",   label: "Discuss",      title: "Discussion",   desc: "Interpret your results, compare with related work, discuss limitations.",             placeholder: "Write your discussion here..."      },
  { key: "conclusion",   label: "Conclusion",   title: "Conclusion",   desc: "Summarize contributions, implications, and future directions.",                      placeholder: "Write your conclusion here..."      },
  { key: "references",   label: "Refs",         title: "References",   desc: "List your citations. No AI assistance for references — these must be yours.",        placeholder: "[1] Author, A. (Year). Title...\n[2] ...", noPolish: true },
];

const ALL_STEPS   = ["info", ...SECTION_STEPS.map((s) => s.key), "review"];
const STEP_LABELS = ["Info", ...SECTION_STEPS.map((s) => s.label), "Export"];

// ─── Paper Info Step ──────────────────────────────────────────────────────────
function PaperInfoStep({ info, setInfo }) {
  const [authorInput, setAuthorInput] = useState("");
  const addAuthor = () => {
    const name = authorInput.trim();
    if (!name) return;
    setInfo((p) => ({ ...p, authors: [...(p.authors || []), name] }));
    setAuthorInput("");
  };
  const removeAuthor = (i) =>
    setInfo((p) => ({ ...p, authors: p.authors.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div className="pg-step-tag">Step 1 of {ALL_STEPS.length}</div>
      <h2 className="pg-card-title">Paper Information</h2>
      <p className="pg-card-desc">Tell us about your paper before you start writing.</p>

      <div className="field">
        <label className="field-label">Paper Title</label>
        <input className="pg-input" placeholder="e.g. Deep Learning for Climate Prediction"
          value={info.title || ""} onChange={(e) => setInfo((p) => ({ ...p, title: e.target.value }))} />
      </div>

      <div className="field-row">
        <div>
          <label className="field-label">University / Institution</label>
          <input className="pg-input" placeholder="e.g. MIT"
            value={info.university || ""} onChange={(e) => setInfo((p) => ({ ...p, university: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Supervisor</label>
          <input className="pg-input" placeholder="e.g. Dr. Jane Smith"
            value={info.supervisor || ""} onChange={(e) => setInfo((p) => ({ ...p, supervisor: e.target.value }))} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Target Venue</label>
        <select className="pg-select" value={info.venue || "ieee"}
          onChange={(e) => setInfo((p) => ({ ...p, venue: e.target.value }))}>
          <option value="ieee">IEEE</option>
          <option value="springer">Springer</option>
          <option value="acm">ACM</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label">Authors / Team Members</label>
        {info.authors?.length > 0 && (
          <div className="author-tags">
            {info.authors.map((a, i) => (
              <div className="author-tag" key={i}>
                {a}<button onClick={() => removeAuthor(i)}>×</button>
              </div>
            ))}
          </div>
        )}
        <div className="author-add-row">
          <input className="pg-input" placeholder="Type a name and press Add or Enter..."
            value={authorInput} onChange={(e) => setAuthorInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAuthor()} />
          <button className="btn-add" onClick={addAuthor}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Step ─────────────────────────────────────────────────────────────
function SectionStep({ stepConfig, stepNum, sections, setSections }) {
  const [polishing,  setPolishing]  = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error,      setError]      = useState("");

  const value    = sections[stepConfig.key] || "";
  const setValue = (v) => setSections((p) => ({ ...p, [stepConfig.key]: v }));

  const polish = async () => {
    if (!value.trim()) return;
    setPolishing(true);
    setSuggestion(null);
    setError("");
    const system = `You are an academic writing assistant. Fix spelling mistakes, grammar errors, punctuation, and spacing in research paper text.
Rules:
- Do NOT add new content or ideas
- Do NOT change meaning or structure  
- Only fix: spelling, grammar, punctuation, spacing, awkward phrasing
- Keep the author's voice
- Respond ONLY with valid JSON: { "polished": "corrected text", "changes": "brief summary of fixes" }
- No markdown, no extra text`;
    try {
      const raw    = await callGroq(system, `Section: ${stepConfig.title}\n\n${value}`);
      const clean  = raw.replace(/```json|```/g, "").trim();
      setSuggestion(JSON.parse(clean));
    } catch (e) {
      setError(e.message || "Polish failed. Try again.");
    } finally {
      setPolishing(false);
    }
  };

  return (
    <div>
      <div className="pg-step-tag">Step {stepNum} of {ALL_STEPS.length}</div>
      <h2 className="pg-card-title">{stepConfig.title}</h2>
      <p className="pg-card-desc">{stepConfig.desc}</p>

      <textarea
        className={`pg-textarea ${polishing ? "polishing" : ""}`}
        placeholder={stepConfig.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={polishing}
        rows={10}
      />

      <div className="textarea-footer">
        <span className="char-count">{value.length} chars · {value.trim().split(/\s+/).filter(Boolean).length} words</span>
        {!stepConfig.noPolish && (
          <button className="polish-btn" onClick={polish} disabled={polishing || !value.trim()}>
            {polishing ? <><div className="gen-dot" /> Polishing…</> : <>✦ Polish with AI</>}
          </button>
        )}
      </div>

      {suggestion && (
        <div className="diff-panel">
          <div className="diff-header">
            <span className="diff-label">✦ Suggested Polish</span>
            <div className="diff-actions">
              <button className="diff-btn reject" onClick={() => setSuggestion(null)}>Discard</button>
              <button className="diff-btn accept" onClick={() => { setValue(suggestion.polished); setSuggestion(null); }}>Accept ✓</button>
            </div>
          </div>
          <div className="diff-body">{suggestion.polished}</div>
          {suggestion.changes && (
            <div className="diff-changes">Fixed: {suggestion.changes}</div>
          )}
        </div>
      )}

      {error && <div className="pg-error">{error}</div>}
    </div>
  );
}

// ─── Review & Export ──────────────────────────────────────────────────────────
function ReviewStep({ info, sections }) {
  const [openSec,         setOpenSec]         = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([info.venue || "ieee"]);
  const [outputType,      setOutputType]      = useState("pdf");
  const [exporting,       setExporting]       = useState(false);
  const [exportResult,    setExportResult]    = useState(null);
  const [error,           setError]           = useState("");

  const toggleFormat = (f) =>
    setSelectedFormats((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f]);

  const buildTxt = () => {
    const lines = [];
    if (info.title)           lines.push(`Title: ${info.title}`);
    if (info.authors?.length) lines.push(`Authors: ${info.authors.join(", ")}`);
    if (info.university)      lines.push(`University: ${info.university}`);
    if (info.supervisor)      lines.push(`Supervisor: ${info.supervisor}`);
    lines.push("");
    SECTION_STEPS.forEach(({ key, title }) => {
      if (sections[key]?.trim()) { lines.push(`${title.toUpperCase()}:\n${sections[key]}`); lines.push(""); }
    });
    return lines.join("\n");
  };

  const handleExport = async () => {
    if (!selectedFormats.length) return;
    setExporting(true); setError(""); setExportResult(null);
    try {
      const fd = new FormData();
      fd.append("file", new File([buildTxt()], "paper.txt", { type: "text/plain" }));
      fd.append("formats", selectedFormats.join(","));
      fd.append("output_type", outputType);
      const res  = await fetch(`${API_BASE}/convert/`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.status === "error") throw new Error(data.message);
      setExportResult(data);
    } catch (e) {
      setError(e.message || "Export failed. Make sure the backend is running at localhost:8000.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="pg-step-tag">Step {ALL_STEPS.length} of {ALL_STEPS.length}</div>
      <h2 className="pg-card-title">Review & Export</h2>
      <p className="pg-card-desc">Check your paper, choose your format, and send to the formatter.</p>

      <div className="review-meta">
        {[["Title", info.title], ["Authors", (info.authors||[]).join(", ")], ["University", info.university], ["Supervisor", info.supervisor], ["Venue", info.venue?.toUpperCase()]]
          .filter(([,v]) => v)
          .map(([label, val]) => (
            <div className="review-meta-row" key={label}>
              <span className="review-meta-label">{label}</span>
              <span className="review-meta-val">{val}</span>
            </div>
          ))}
      </div>

      {SECTION_STEPS.map(({ key, title }) =>
        sections[key]?.trim() ? (
          <div className="review-section" key={key}>
            <div className="review-section-header" onClick={() => setOpenSec(openSec === key ? null : key)}>
              <span className="review-section-name">{title}</span>
              <span style={{ color: C.muted, fontSize: 12 }}>{openSec === key ? "▲" : "▼"}</span>
            </div>
            {openSec === key && <div className="review-section-body">{sections[key]}</div>}
          </div>
        ) : null
      )}

      <div style={{ marginTop: 28 }}>
        <label className="field-label">Export Format</label>
        <div className="format-chips">
          {["ieee", "springer", "acm"].map((f) => (
            <button key={f} className={`format-chip ${selectedFormats.includes(f) ? "active" : ""}`} onClick={() => toggleFormat(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="field-label">Output Type</label>
        <div className="format-chips">
          {["pdf", "tex"].map((t) => (
            <button key={t} className={`format-chip ${outputType === t ? "active" : ""}`} onClick={() => setOutputType(t)}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {exporting && (
        <div className="export-loading">
          <div className="spin-dots"><div className="spin-dot"/><div className="spin-dot"/><div className="spin-dot"/></div>
          Sending to formatter…
        </div>
      )}

      {exportResult && (
        <div className="export-result">
          <div className="export-label">✓ Export Successful</div>
          {exportResult.zip_file && <div className="export-file">ZIP: <span>{exportResult.zip_file}</span></div>}
          {exportResult.files && Object.entries(exportResult.files).map(([type, path]) => (
            <div className="export-file" key={type}>{type.toUpperCase()}: <span>{path}</span></div>
          ))}
          {exportResult.format && <div className="export-file">Format: <span>{exportResult.format.toUpperCase()}</span></div>}
        </div>
      )}

      {error && <div className="pg-error">{error}</div>}

      <button className="btn-next" style={{ marginTop: 20, width: "100%" }}
        onClick={handleExport} disabled={exporting || !selectedFormats.length}>
        {exporting ? "Exporting…" : "Export Paper →"}
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PaperGeneration() {
  const [step,     setStep]     = useState(0);
  const [info,     setInfo]     = useState({ authors: [], venue: "ieee" });
  const [sections, setSections] = useState({});

  const totalSteps  = ALL_STEPS.length;
  const progressPct = (step / (totalSteps - 1)) * 100;
  const canNext     = () => step === 0 ? info.title?.trim() && info.authors?.length > 0 : true;

  const renderStep = () => {
    if (step === 0)              return <PaperInfoStep info={info} setInfo={setInfo} />;
    if (step === totalSteps - 1) return <ReviewStep info={info} sections={sections} />;
    return (
      <SectionStep key={SECTION_STEPS[step-1].key} stepConfig={SECTION_STEPS[step-1]}
        stepNum={step+1} sections={sections} setSections={setSections} />
    );
  };

  return (
    <>
      <style>{css}</style>
      <div className="pg-wrap">
        <div className="pg-inner">
          <div className="progress-bar">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            {ALL_STEPS.map((_, i) => (
              <div className="step-dot-wrap" key={i}>
                <div className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`step-label ${i === step ? "active" : i < step ? "done" : ""}`}>
                  {STEP_LABELS[i]}
                </span>
              </div>
            ))}
          </div>

          <div className="pg-card" key={step}>
            {renderStep()}
            {step < totalSteps - 1 && (
              <div className="pg-nav">
                <button className="btn-back" style={{ visibility: step === 0 ? "hidden" : "visible" }}
                  onClick={() => setStep((s) => s - 1)}>← Back</button>
                <button className="btn-next" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                  {step === totalSteps - 2 ? "Review →" : "Next →"}
                </button>
              </div>
            )}
            {step === totalSteps - 1 && (
              <div className="pg-nav">
                <button className="btn-back" onClick={() => setStep((s) => s - 1)}>← Back</button>
                <div />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
