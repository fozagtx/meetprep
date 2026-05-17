import { useState } from 'react';

interface SaveTranscriptProps {
  transcript: string;
  vaultHandle: FileSystemDirectoryHandle | null;
}

export default function SaveTranscript({ transcript, vaultHandle }: SaveTranscriptProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  const saveTranscript = async () => {
    if (!vaultHandle || !transcript) return;

    setIsSaving(true);
    setSavedPath(null);

    try {
      const perm = await (vaultHandle as any).queryPermission?.({ mode: 'readwrite' });
      if (perm !== 'granted') {
        const req = await (vaultHandle as any).requestPermission?.({ mode: 'readwrite' });
        if (req !== 'granted') {
          throw new Error('Write permission denied for this vault');
        }
      }

      const transcriptsDir = await vaultHandle.getDirectoryHandle('Transcripts', { create: true });

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const filename = `transcript-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.md`;

      const fileHandle = await transcriptsDir.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();

      const content = `---
date: ${now.toISOString()}
type: meeting-transcript
---

# Transcript — ${now.toLocaleDateString()} ${now.toLocaleTimeString()}

${transcript}
`;

      await writable.write(content);
      await writable.close();

      setSavedPath(`Transcripts/${filename}`);
    } catch (err) {
      console.error('Failed to save transcript:', err);
      alert('Failed to save transcript: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = !vaultHandle || !transcript || isSaving;

  return (
    <div className="space-y-1">
      <button
        onClick={saveTranscript}
        disabled={isDisabled}
        title={!vaultHandle ? 'Connect vault first' : ''}
        className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? 'Saving…' : 'Save Transcript'}
      </button>
      {savedPath && (
        <p className="text-sm text-green-700">Saved to <code className="bg-green-50 px-1 rounded">{savedPath}</code></p>
      )}
    </div>
  );
}
