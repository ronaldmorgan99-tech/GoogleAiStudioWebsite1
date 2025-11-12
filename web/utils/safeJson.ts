export async function safeJson<T = any>(res: Response): Promise<T | null> {
  // Read text to avoid `Unexpected end of JSON input` for empty responses
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error('safeJson: failed to parse JSON', err, text);
    throw new Error('Invalid JSON response from API');
  }
}

export default safeJson;
