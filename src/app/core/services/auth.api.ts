import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, MeResponse } from '../../../shared/models/auth.model';

/** Contract §1 — Auth. */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** `POST /api/auth/google` (public, rate-limited 10/min/IP). */
  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/api/auth/google`, { idToken });
  }

  /** `GET /api/auth/me`. */
  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.base}/api/auth/me`);
  }
}
