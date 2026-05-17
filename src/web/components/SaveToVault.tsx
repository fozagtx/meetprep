import { useState } from 'react';

interface MeetingSummary {
  summary: string;
  action_items: string[];
  decisions: string[];
  follow_ups: string[];
}

interface SaveToVaultProps {
  summary: MeetingSummary;
  vaultHandle: FileSystemDirectoryHandle | null;
  onSaved?: () => void;
}

export default function SaveToVault({ summary, vaultHandle, onSaved }: SaveToVaultProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  const saveToVault = async () => {
    if (!vaultHandle) return;

    setIsSaving(true);
    setSavedPath(null);

    try {
      // Re-check / request readwrite permission (some browsers downgrade after first use)
      const perm = await (vaultHandle as any).queryPermission?.({ mode: 'readwrite' });
      if (perm !== 'granted') {
        const req = await (vaultHandle as any).requestPermission?.({ mode: 'readwrite' });
        if (req !== 'granted') {
          throw new Error('Write permission denied for this vault');
        }
      }

      const meetingsDir = await vaultHandle.getDirectoryHandle('Meetings', { create: true });

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const filename = `meeting-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.md`;

      const fileHandle = await meetingsDir.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();

      const content = `---
date: ${now.toISOString()}
type: meeting-summary
---

# Meeting Summary — ${now.toLocaleDateString()} ${now.toLocaleTimeString()}

## Summary

${summary.summary}

## Action Items

${summary.action_items.length > 0 ? summary.action_items.map((item, i) => `${i + 1}. ${item}`).join('\n') : '_No action items_'}

## Decisions

${summary.decisions.length > 0 ? summary.decisions.map((item, i) => `${i + 1}. ${item}`).join('\n') : '_No decisions recorded_'}

## Follow-ups

${summary.follow_ups.length > 0 ? summary.follow_ups.map((item, i) => `${i + 1}. ${item}`).join('\n') : '_No follow-ups needed_'}
`;

      await writable.write(content);
      await writable.close();

      setSavedPath(`Meetings/${filename}`);
      onSaved?.();
    } catch (err) {
      console.error('Failed to save to vault:', err);
      alert('Failed to save to vault: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = !vaultHandle || isSaving;

  return (
    <div className="mt-4 space-y-2">
      <button
        onClick={saveToVault}
        disabled={isDisabled}
        title={!vaultHandle ? 'Connect vault first' : ''}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? 'Saving…' : 'Save to Vault'}
      </button>

      {savedPath && (
        <p className="text-sm text-green-700">Saved to <code className="bg-green-50 px-1 rounded">{savedPath}</code></p>
      )}

      {!vaultHandle && (
        <p className="text-xs text-gray-500">Connect an Obsidian vault first to save summaries.</p>
      )}
    </div>
  );
}
