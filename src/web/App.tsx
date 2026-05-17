import Recorder from './components/Recorder';
import VaultPicker from './components/VaultPicker';
import { useVault } from './hooks/useVault';

export default function App() {
  const { vaultHandle, notes, isLoading, pickVault } = useVault();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Meeting Transcription</h1>
            <VaultPicker
              onPickVault={pickVault}
              isLoading={isLoading}
              noteCount={notes.length}
              isConnected={!!vaultHandle}
            />
          </div>
        </div>
      </div>
      <Recorder vaultHandle={vaultHandle} />
    </div>
  );
}

// Made with Bob
