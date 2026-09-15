import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Settings, SettingsUpdate } from '../../../shared/models/settings.model';

/** Contract §2.11 — Settings. */
@Injectable({ providedIn: 'root' })
export class SettingsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/settings`;

  /** `GET /api/settings`. */
  get(): Observable<Settings> {
    return this.http.get<Settings>(this.base);
  }

  /** `PUT /api/settings` body `{ notificationChannel }`. */
  update(body: SettingsUpdate): Observable<Settings> {
    return this.http.put<Settings>(this.base, body);
  }
}
