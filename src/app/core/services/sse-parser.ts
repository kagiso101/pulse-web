import { AskStreamEvent } from '../../../shared/models/ask.model';

/** One parsed `text/event-stream` frame: the `event:` name and the joined `data:` lines. */
export interface SseFrame {
  event: string;
  data: string;
}

/**
 * Incremental Server-Sent-Events line parser. Feed it decoded text chunks as they arrive
 * (chunks may split lines and even multi-byte sequences — decode with a streaming TextDecoder
 * first) and it returns the frames completed by each chunk.
 *
 * Follows the WHATWG EventSource algorithm for what Pulse needs:
 *  - lines end with `\n`, `\r\n` or `\r`
 *  - a blank line dispatches the frame (only if it has data)
 *  - `event:` sets the type (default "message"), `data:` lines are joined with `\n`
 *  - one optional space after the colon is stripped; `:` comments and `id`/`retry` are ignored
 */
export class SseParser {
  private buffer = '';
  private eventType = '';
  private dataLines: string[] = [];

  push(chunk: string): SseFrame[] {
    this.buffer += chunk;
    const frames: SseFrame[] = [];
    let idx: number;
    while ((idx = findLineEnd(this.buffer)) !== -1) {
      const line = this.buffer.slice(0, idx.valueOf());
      // consume the terminator (\r\n counts as one)
      const next = this.buffer[idx] === '\r' && this.buffer[idx + 1] === '\n' ? idx + 2 : idx + 1;
      // a lone trailing \r could be the first half of \r\n — wait for more input
      if (this.buffer[idx] === '\r' && idx + 1 >= this.buffer.length) return frames;
      this.buffer = this.buffer.slice(next);
      const frame = this.processLine(line);
      if (frame) frames.push(frame);
    }
    return frames;
  }

  /** Call at end of stream: dispatches a pending frame that was never terminated by a blank line. */
  flush(): SseFrame[] {
    const frames: SseFrame[] = [];
    if (this.buffer.length) {
      const frame = this.processLine(this.buffer.replace(/\r$/, ''));
      this.buffer = '';
      if (frame) frames.push(frame);
    }
    const last = this.dispatch();
    if (last) frames.push(last);
    return frames;
  }

  private processLine(line: string): SseFrame | null {
    if (line === '') return this.dispatch();
    if (line.startsWith(':')) return null;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    switch (field) {
      case 'event':
        this.eventType = value;
        break;
      case 'data':
        this.dataLines.push(value);
        break;
      default:
        break; // id, retry, unknown → ignored
    }
    return null;
  }

  private dispatch(): SseFrame | null {
    if (this.dataLines.length === 0) {
      this.eventType = '';
      return null;
    }
    const frame: SseFrame = {
      event: this.eventType || 'message',
      data: this.dataLines.join('\n'),
    };
    this.eventType = '';
    this.dataLines = [];
    return frame;
  }
}

function findLineEnd(s: string): number {
  const n = s.indexOf('\n');
  const r = s.indexOf('\r');
  if (n === -1) return r;
  if (r === -1) return n;
  return Math.min(n, r);
}

/**
 * Maps a raw frame to a typed Ask event (contract §2.10). Unknown event names and malformed
 * JSON on `delta` are dropped (null); malformed `done`/`error` still surface as an error so the
 * stream can terminate honestly.
 */
export function parseAskFrame(frame: SseFrame): AskStreamEvent | null {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(frame.data) as Record<string, unknown>;
  } catch {
    return frame.event === 'delta'
      ? null
      : { type: 'error', message: 'The answer stream was malformed.' };
  }
  switch (frame.event) {
    case 'delta':
      return { type: 'delta', text: typeof payload['text'] === 'string' ? payload['text'] : '' };
    case 'done':
      return {
        type: 'done',
        model: typeof payload['model'] === 'string' ? payload['model'] : '',
        inputTokens: numberOr0(payload['inputTokens']),
        outputTokens: numberOr0(payload['outputTokens']),
      };
    case 'error':
      return {
        type: 'error',
        message:
          typeof payload['message'] === 'string' && payload['message']
            ? payload['message']
            : 'Ask failed.',
      };
    default:
      return null;
  }
}

function numberOr0(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}
