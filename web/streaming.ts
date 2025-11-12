/**
 * Robust JSON stream parser utilities.
 *
 * This file provides helpers to consume fetch Response bodies that may be:
 * - NDJSON (one JSON object per line)
 * - Concatenated JSON objects (}{...)
 * - A single JSON array streamed in chunks
 *
 * The parser is resilient to BOM, stray whitespace, and partial chunks. It
 * never calls a TransformStream controller directly; instead it reads the
 * ReadableStreamDefaultReader and emits parsed objects via a callback.
 */

export async function streamJsonObjects(
  response: Response,
  onObject: (obj: any) => void,
  onError?: (err: unknown) => void
): Promise<void> {
  if (!response.body) {
    throw new Error('Response has no body to stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  // parser state for bracket-based extraction
  let inString = false;
  let escaped = false;
  let depth = 0;
  let startIdx = -1;

  const flushBufferAsArray = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        for (const it of parsed) onObject(it);
        return true;
      }
    } catch (err) {
      // not a single array or malformed; return false so callers can try other modes
      return false;
    }
    return false;
  };

  function tryParseNdjsonLines() {
    if (!buf.includes('\n')) return false;
    const parts = buf.split('\n');
    buf = parts.pop() || '';
    for (const line of parts) {
      const t = line.trim();
      if (!t) continue;
      try {
        onObject(JSON.parse(t));
      } catch (err) {
        // If a line fails to parse, append it back and fallback to bracket parsing
        buf = line + '\n' + buf;
        return false;
      }
    }
    return true;
  }

  function tryBracketParse() {
    // Scan buffer for balanced top-level objects/arrays
    for (let i = 0; i < buf.length; ++i) {
      const ch = buf[i];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
        if (startIdx === -1) startIdx = i; // mark start if not already
        continue;
      }

      if (ch === '{' || ch === '[') {
        if (startIdx === -1) startIdx = i;
        depth++;
        continue;
      }
      if (ch === '}' || ch === ']') {
        depth--;
        if (depth === 0 && startIdx !== -1) {
          const jsonText = buf.slice(startIdx, i + 1);
          try {
            const parsed = JSON.parse(jsonText);
            if (Array.isArray(parsed)) {
              for (const it of parsed) onObject(it);
            } else {
              onObject(parsed);
            }
          } catch (err) {
            // If parsing failed, try to recover by leaving remaining buffer intact
            if (onError) onError(err);
            return false;
          }
          buf = buf.slice(i + 1);
          // reset scan state and restart scanning from beginning of new buf
          i = -1;
          startIdx = -1;
          inString = false;
          escaped = false;
          depth = 0;
        }
      }
    }
    return true;
  }

  // Remove BOM if present
  const stripBom = (s: string) => s.replace(/^\uFEFF/, '');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      buf = stripBom(buf);

      // Fast path: NDJSON if we see newlines
      if (buf.includes('\n')) {
        const ok = tryParseNdjsonLines();
        if (!ok) {
          // If NDJSON parsing failed, fall back to bracket parser
          tryBracketParse();
        }
        continue;
      }

      // If the stream starts with '[' it's likely a JSON array streamed in chunks
      const trimmedStart = buf.trimStart();
      if (trimmedStart.startsWith('[')) {
        // Try to parse whole buffer as array when possible (flush when balanced)
        // We'll attempt bracket parsing which handles arrays
        tryBracketParse();
        continue;
      }

      // Otherwise try bracket-based extraction for concatenated objects
      tryBracketParse();
    }

    // flush remaining buffer
    const remaining = buf.trim();
    if (remaining) {
      // Try: whole array, newline-split, or single object
      if (!flushBufferAsArray(remaining)) {
        if (remaining.includes('\n')) {
          // split final lines
          const parts = buf.split('\n');
          for (const part of parts) {
            const t = part.trim();
            if (!t) continue;
            try {
              onObject(JSON.parse(t));
            } catch (err) {
              if (onError) onError(err);
            }
          }
        } else {
          try {
            onObject(JSON.parse(buf));
          } catch (err) {
            if (onError) onError(err);
          }
        }
      }
    }
  } catch (err) {
    if (onError) onError(err);
    else throw err;
  } finally {
    try {
      reader.releaseLock();
    } catch (_) {}
  }
}

/**
 * Usage example:
 *
 * await streamJsonObjects(response, obj => {
 *   console.log('got object', obj);
 * }, err => console.error('stream parse error', err));
 */

export default streamJsonObjects;
