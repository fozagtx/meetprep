import { useState } from 'react';

export interface VaultNote {
  path: string;
  title: string;
  body: string;
}

export function useVault() {
  const [vaultHandle, setVaultHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [notes, setNotes] = useState<VaultNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickVault = async () => {
    try {
      setIsLoading(true);
      
      // Request directory picker
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });

      setVaultHandle(handle);

      // Recursively read all .md files
      const allNotes = await readMarkdownFiles(handle, '');
      setNotes(allNotes);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to pick vault:', err);
        alert('Failed to access vault: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const readMarkdownFiles = async (
    dirHandle: FileSystemDirectoryHandle,
    currentPath: string
  ): Promise<VaultNote[]> => {
    const notes: VaultNote[] = [];

    for await (const entry of dirHandle.values()) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

      if (entry.kind === 'directory') {
        // Recursively read subdirectories
        const subNotes = await readMarkdownFiles(entry as FileSystemDirectoryHandle, entryPath);
        notes.push(...subNotes);
      } else if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        // Read markdown file
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const content = await file.text();

        // Extract title (first # heading or filename)
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : entry.name.replace('.md', '');

        notes.push({
          path: entryPath,
          title,
          body: content,
        });
      }
    }

    return notes;
  };

  return {
    vaultHandle,
    notes,
    isLoading,
    pickVault,
  };
}

// Made with Bob
