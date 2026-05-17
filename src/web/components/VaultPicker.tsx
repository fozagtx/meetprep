interface VaultPickerProps {
  onPickVault: () => void;
  isLoading: boolean;
  noteCount: number;
  isConnected: boolean;
}

export default function VaultPicker({ onPickVault, isLoading, noteCount, isConnected }: VaultPickerProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPickVault}
        disabled={isLoading}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '⏳ Loading...' : isConnected ? '🔄 Reconnect Vault' : '📁 Connect Obsidian Vault'}
      </button>
      
      {isConnected && (
        <div className="text-sm text-gray-600">
          ✅ Loaded <span className="font-semibold">{noteCount}</span> notes
        </div>
      )}
      
      {!isConnected && (
        <div className="text-xs text-gray-500">
          Chromium browsers only (Chrome, Edge, Brave)
        </div>
      )}
    </div>
  );
}

// Made with Bob
