import { callGranite } from './watsonx';

export interface MeetingSummary {
  summary: string;
  action_items: string[];
  decisions: string[];
  follow_ups: string[];
}

export async function generateSummary(transcript: string): Promise<MeetingSummary> {
  const prompt = `You are a meeting assistant. Analyze the following meeting transcript and provide a structured summary.

Transcript:
${transcript}

Provide your response in the following JSON format (respond ONLY with valid JSON, no other text):
{
  "summary": "A brief 2-3 sentence summary of the meeting",
  "action_items": ["List of action items mentioned"],
  "decisions": ["List of decisions made"],
  "follow_ups": ["List of follow-up items needed"]
}`;

  const response = await callGranite(prompt);

  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Granite returned non-JSON:', response);
    throw new Error('Failed to parse summary response');
  }

  let summary: MeetingSummary;
  try {
    summary = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('JSON parse failed. Raw response:', response);
    throw e;
  }
  
  // Ensure all fields exist
  return {
    summary: summary.summary || 'No summary available',
    action_items: summary.action_items || [],
    decisions: summary.decisions || [],
    follow_ups: summary.follow_ups || [],
  };
}

// Made with Bob
