import { describe, expect, it } from 'vitest';
import { parseAskFrame, SseParser } from './sse-parser';

describe('SseParser', () => {
  it('parses a complete frame with event and data', () => {
    const p = new SseParser();
    expect(p.push('event: delta\ndata: {"text":"Hi"}\n\n')).toEqual([
      { event: 'delta', data: '{"text":"Hi"}' },
    ]);
  });

  it('buffers partial lines across chunks', () => {
    const p = new SseParser();
    expect(p.push('event: del')).toEqual([]);
    expect(p.push('ta\ndata: {"te')).toEqual([]);
    expect(p.push('xt":"a"}\n')).toEqual([]);
    expect(p.push('\n')).toEqual([{ event: 'delta', data: '{"text":"a"}' }]);
  });

  it('emits several frames from one chunk and keeps order', () => {
    const p = new SseParser();
    const frames = p.push(
      'event: delta\ndata: {"text":"1"}\n\nevent: delta\ndata: {"text":"2"}\n\nevent: done\ndata: {"model":"m","inputTokens":1,"outputTokens":2}\n\n',
    );
    expect(frames.map((f) => f.event)).toEqual(['delta', 'delta', 'done']);
  });

  it('joins multi-line data with newlines and defaults the event to message', () => {
    const p = new SseParser();
    expect(p.push('data: a\ndata: b\n\n')).toEqual([{ event: 'message', data: 'a\nb' }]);
  });

  it('handles CRLF line endings, comments and ignored fields', () => {
    const p = new SseParser();
    expect(p.push(': keep-alive\r\nid: 7\r\nevent: delta\r\ndata: {"text":"x"}\r\n\r\n')).toEqual([
      { event: 'delta', data: '{"text":"x"}' },
    ]);
  });

  it('ignores blank lines with no data and strips one leading space only', () => {
    const p = new SseParser();
    expect(p.push('\n\n')).toEqual([]);
    expect(p.push('data:  two spaces\n\n')).toEqual([{ event: 'message', data: ' two spaces' }]);
  });

  it('flush dispatches an unterminated trailing frame', () => {
    const p = new SseParser();
    expect(p.push('event: error\ndata: {"message":"boom"}')).toEqual([]);
    expect(p.flush()).toEqual([{ event: 'error', data: '{"message":"boom"}' }]);
    expect(p.flush()).toEqual([]);
  });
});

describe('parseAskFrame', () => {
  it('maps delta / done / error', () => {
    expect(parseAskFrame({ event: 'delta', data: '{"text":"Hello"}' })).toEqual({
      type: 'delta',
      text: 'Hello',
    });
    expect(
      parseAskFrame({
        event: 'done',
        data: '{"model":"claude","inputTokens":12,"outputTokens":34}',
      }),
    ).toEqual({ type: 'done', model: 'claude', inputTokens: 12, outputTokens: 34 });
    expect(parseAskFrame({ event: 'error', data: '{"message":"Ask is not configured"}' })).toEqual({
      type: 'error',
      message: 'Ask is not configured',
    });
  });

  it('drops unknown events and malformed deltas, but surfaces malformed terminals', () => {
    expect(parseAskFrame({ event: 'ping', data: '{}' })).toBeNull();
    expect(parseAskFrame({ event: 'delta', data: 'not json' })).toBeNull();
    expect(parseAskFrame({ event: 'done', data: 'not json' })).toEqual({
      type: 'error',
      message: 'The answer stream was malformed.',
    });
  });
});
