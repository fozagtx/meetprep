import SaveToVault from './SaveToVault';

interface MeetingSummary {
  summary: string;
  action_items: string[];
  decisions: string[];
  follow_ups: string[];
}

interface SummaryProps {
  summary: MeetingSummary;
  vaultHandle: FileSystemDirectoryHandle | null;
}

export default function Summary({ summary, vaultHandle }: SummaryProps) {
  const copyToClipboard = () => {
    const text = `
MEETING SUMMARY
===============

${summary.summary}

ACTION ITEMS
------------
${summary.action_items.map((item, i) => `${i + 1}. ${item}`).join('\n')}

DECISIONS
---------
${summary.decisions.map((item, i) => `${i + 1}. ${item}`).join('\n')}

FOLLOW-UPS
----------
${summary.follow_ups.map((item, i) => `${i + 1}. ${item}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('Summary copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Meeting Summary</h2>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          📋 Copy to Clipboard
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Summary</h3>
        <p className="text-gray-700">{summary.summary}</p>
      </div>

      {/* Action Items Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Action Items</h3>
        {summary.action_items.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {summary.action_items.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No action items identified</p>
        )}
      </div>

      {/* Decisions Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Decisions</h3>
        {summary.decisions.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {summary.decisions.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No decisions recorded</p>
        )}
      </div>

      {/* Follow-ups Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Follow-ups</h3>
        {summary.follow_ups.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {summary.follow_ups.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No follow-ups needed</p>
        )}
      </div>

      {/* Save to Vault */}
      <SaveToVault summary={summary} vaultHandle={vaultHandle} />
    </div>
  );
}

// Made with Bob
