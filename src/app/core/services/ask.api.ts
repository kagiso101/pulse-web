import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AskRequest, AskStreamEvent } from '../../../shared/models/ask.model';
import { ApiError } from '../../../shared/models/api-error.model';
import { AuthService } from '../auth/auth.service';
import { parseAskFrame, SseParser } from './sse-parser';

/**
 * Contract §2.10 — `POST /api/ask` returns `text/event-stream`. HttpClient can't stream a
 * response body progressively, so this uses `fetch` directly (Authorization header attached
 * by hand) and pipes the SSE frames through SseParser into an Observable. Unsubscribing aborts
 * the request.
 */
@Injectable({ providedIn: 'root' })
export class AskApi {
  private readonly auth = inject(AuthService);
  private readonly base = environment.apiBaseUrl;

  ask(req: AskRequest): Observable<AskStreamEvent> {
    return new Observable<AskStreamEvent>((subscriber) => {
      const controller = new AbortController();
      const emitAndEnd = (ev: AskStreamEvent) => {
        subscriber.next(ev);
        subscriber.complete();
      };

      (async () => {
        let res: Response;
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          };
          const token = this.auth.token();
          if (token) headers['Authorization'] = `Bearer ${token}`;
          res = await fetch(`${this.base}/api/ask`, {
            method: 'POST',
            headers,
            body: JSON.stringify(req),
            signal: controller.signal,
          });
        } catch {
          if (controller.signal.aborted) return;
          emitAndEnd({ type: 'error', message: "Can't reach the Pulse API" });
          return;
        }

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) this.auth.sessionExpired();
          emitAndEnd({ type: 'error', message: await this.errorMessage(res) });
          return;
        }
        if (!res.body) {
          emitAndEnd({ type: 'error', message: 'The answer stream was empty.' });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const parser = new SseParser();
        let terminal = false;
        const handle = (frames: ReturnType<SseParser['push']>) => {
          for (const frame of frames) {
            const ev = parseAskFrame(frame);
            if (!ev || terminal) continue;
            subscriber.next(ev);
            if (ev.type !== 'delta') terminal = true;
          }
        };
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            handle(parser.push(decoder.decode(value, { stream: true })));
            if (terminal) break;
          }
          handle(parser.push(decoder.decode()));
          handle(parser.flush());
        } catch {
          if (controller.signal.aborted) return;
          if (!terminal) subscriber.next({ type: 'error', message: 'The connection dropped.' });
          subscriber.complete();
          return;
        }
        if (!terminal) {
          subscriber.next({
            type: 'error',
            message: 'The connection dropped before the answer finished.',
          });
        }
        subscriber.complete();
      })().catch(() => {
        if (!controller.signal.aborted) emitAndEnd({ type: 'error', message: 'Ask failed.' });
      });

      return () => controller.abort();
    });
  }

  private async errorMessage(res: Response): Promise<string> {
    if (res.status === 429) return 'Slow down a moment';
    if (res.status === 503) return 'Ask is not configured on the API yet.';
    if (res.status === 502) return 'A connector is unavailable';
    try {
      const body = (await res.json()) as Partial<ApiError>;
      if (body && typeof body.message === 'string' && body.message) return body.message;
    } catch {
      /* not JSON */
    }
    return `Ask failed (${res.status}).`;
  }
}
