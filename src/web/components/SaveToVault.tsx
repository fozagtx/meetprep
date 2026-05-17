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

  const saveToVault = async () => {
    if (!vaultHandle) return;

    setIsSaving(true);
    try {
      // Get or create /Meetings directory
      const meetingsDir = await vaultHandle.getDirectoryHandle('Meetings', { create: true });

      // Generate filename: meeting-YYYY-MM-DD-HHMM.md
      const now = new Date();
      const filename = `meeting-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.md`;

      // Create file handle
      const fileHandle = await meetingsDir.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();

      // Generate markdown content with YAML frontmatter
      const content = `---
date: ${now.toISOString()}
type: meeting-summary
---

# Meeting Summary - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}

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

      alert(`✅ Saved to vault: Meetings/${filename}`);
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
    <div className="mt-4">
      <button
        onClick={saveToVault}
        disabled={isDisabled}
        title={!vaultHandle ? 'Connect vault first' : ''}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? '💾 Saving...' : '💾 Save to Vault'}
      </button>
      
      {!vaultHandle && (
        <p className="text-xs text-gray-500 mt-2">
          Connect an Obsidian vault first to save summaries
        </p>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        Requires Chromium browser (Chrome, Edge, Brave)
      </p>
    </div>
  );
}

import { useState } from 'react';

// Made with Bob
