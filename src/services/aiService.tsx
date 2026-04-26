export async function fetchAIResponse(userMessage: string, aiEngineName: string): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    return `Error: API key is missing. Please add VITE_GEMINI_API_KEY to your .env file. I would normally respond as ${aiEngineName}.`;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a helpful AI assistant inside the DaivAI application. Your name is ${aiEngineName}, but do NOT introduce yourself or say your name. Just answer the user's question directly and concisely. User asks: ${userMessage}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return `Sorry, I encountered an error: ${errorData.error?.message || 'Unknown error'}`;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text as string;

  } catch (error) {
    return 'Sorry, there was a network error communicating with the AI server.';
  }
}
