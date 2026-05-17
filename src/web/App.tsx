import Recorder from './components/Recorder';
import VaultPicker from './components/VaultPicker';
import { useVault } from './hooks/useVault';

export default function App() {
  const { vaultHandle, notes, isLoading, pickVault } = useVault();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-slate-900">meetprep</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
          Built for the IBM Bob Hackathon
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-5">
          Meetings, distilled.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Record your meeting from the browser. Get an AI transcript and a structured summary
          (decisions, action items, follow-ups), then save it straight into your Obsidian vault.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
            IBM Watson Speech-to-Text
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
            watsonx.ai · Granite 3
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
            Obsidian
          </span>
        </div>
      </section>

      <section id="try" className="max-w-3xl mx-auto px-6 pb-12">
        <p className="text-xs text-slate-500 text-center mb-4">
          Requires a Chromium-based browser (Chrome, Edge, Arc). Brave: turn off shields for localhost.
        </p>
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Try it now</h2>
            <p className="text-sm text-slate-500 mt-0.5 mb-4">
              Step 1 — connect an Obsidian vault. Step 2 — record a short meeting.
            </p>
            <VaultPicker
              onPickVault={pickVault}
              isLoading={isLoading}
              noteCount={notes.length}
              isConnected={!!vaultHandle}
            />
          </div>
          <div className="p-6">
            <Recorder vaultHandle={vaultHandle} />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid sm:grid-cols-3 gap-4">
          <FeatureCard
            step="01"
            title="Record"
            body="One click captures your mic via the browser. No installs, no plugins."
          />
          <FeatureCard
            step="02"
            title="Transcribe & summarize"
            body="IBM Watson transcribes. Granite extracts a summary, decisions, action items, and follow-ups."
          />
          <FeatureCard
            step="03"
            title="Save to Obsidian"
            body="Write the structured note straight into your vault. Files never leave your machine."
          />
        </div>
      </section>

      <footer className="border-t border-slate-200 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} meetprep</span>
          <span>Powered by IBM watsonx.ai + Watson STT · Built with IBM Bob</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-xs font-mono text-slate-400 mb-2">{step}</div>
      <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </div>
  );
}
